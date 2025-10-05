from flask import Flask, render_template, request, jsonify
import requests
import pandas as pd
from datetime import datetime

data = pd.read_csv("all_month.csv")


app = Flask(__name__)

# Function to fetch earthquake data from USGS
def fetch_earthquake_data(start_time, end_time, min_magnitude, max_magnitude, min_depth, max_depth, min_lat, max_lat, min_lon, max_lon, limit=1000):
    base_url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
   
    params = {
        'format': 'geojson',
        'starttime': start_time,
        'endtime': end_time,
        'minmagnitude': min_magnitude,
        'maxmagnitude': max_magnitude,
        'mindepth': min_depth,
        'maxdepth': max_depth,
        'minlatitude': min_lat,
        'maxlatitude': max_lat,
        'minlongitude': min_lon,
        'maxlongitude': max_lon,
        'orderby': 'time',
        'limit': limit
    }

    response = requests.get(base_url, params=params)
   
    if response.status_code == 200:
        return response.json()
    else:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    # Get form data from the frontend
    time = request.form.get('time')
    magnitude = request.form.get('mag', 0)
    depth = request.form.get('depth', 0)

    st = data['time'].str.contains(time,case=False) and data['depth'].str.contains(time,case=False) and data['mag'].str.contains(time,case=False)
    output = data[st]
    start_time_coordinates = (output.longitude, output.latitude)


    # Fetch earthquake data
    earthquake_data = fetch_earthquake_data(time, magnitude, depth)
   
    # Process and return the results as JSON for the frontend
    if earthquake_data:
        earthquakes = []
        for feature in earthquake_data['features']:
            properties = feature['properties']
            geometry = feature['geometry']
            event_time = datetime.utcfromtimestamp(properties['time'] / 1000).strftime('%Y-%m-%d %H:%M:%S')
            earthquakes.append({
                'time': event_time,
                'magnitude': properties['mag'],
                'depth': geometry['coordinates'][2],
                'latitude': geometry['coordinates'][1],
                'longitude': geometry['coordinates'][0],
                'place': properties['place']
            })
        return jsonify(earthquakes)
    else:
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)