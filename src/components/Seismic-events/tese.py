import pandas as pd

data = pd.read_csv("all_month.csv")

starttime = data[data['time'].str.contains("2024-10-01",case=False)]
# endtime = data.time.loc["01/03/2023"]

print(starttime)
