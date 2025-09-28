import { useState } from 'react';

interface TimeSliderProps {
  onDateChange: (date: Date) => void;
  startDate?: Date;
  endDate?: Date;
}

export const TimeSlider: React.FC<TimeSliderProps> = ({
  onDateChange,
  startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  endDate = new Date()
}) => {
  const [value, setValue] = useState<number>(endDate.getTime());
  const min = startDate.getTime();
  const max = endDate.getTime();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    onDateChange(new Date(newValue));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="w-full p-4 bg-gray-800 rounded-lg">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full"
      />
      <div className="flex justify-between mt-2 text-sm text-gray-400">
        <span>{formatDate(min)}</span>
        <span>{formatDate(value)}</span>
        <span>{formatDate(max)}</span>
      </div>
    </div>
  );
};