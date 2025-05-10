import React from 'react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachHourOfInterval, eachDayOfInterval, eachWeekOfInterval } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MoodGraphProps {
  entries: Array<{
    created_at: string;
    mood: string;
  }>;
  view: 'day' | 'week' | 'month';
}

const MOOD_VALUES = {
  '😊': 8,
  '😢': 2,
  '😡': 1,
  '😴': 3,
  '😌': 7,
  '🤔': 5,
  '😰': 4,
  '🥳': 9
};

const MoodGraph = ({ entries, view }: MoodGraphProps) => {
  const getMoodData = () => {
    const now = new Date();
    let labels: string[] = [];
    let data: number[] = [];

    switch (view) {
      case 'day':
        const hours = eachHourOfInterval({
          start: startOfDay(now),
          end: endOfDay(now),
        });
        labels = hours.map(hour => format(hour, 'HH:mm'));
        data = hours.map(hour => {
          const entry = entries.find(e => 
            new Date(e.created_at).getHours() === hour.getHours() &&
            format(new Date(e.created_at), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
          );
          return entry ? MOOD_VALUES[entry.mood as keyof typeof MOOD_VALUES] : 0;
        });
        break;

      case 'week':
        const days = eachDayOfInterval({
          start: startOfWeek(now),
          end: endOfWeek(now),
        });
        labels = days.map(day => format(day, 'EEE'));
        data = days.map(day => {
          const dayEntries = entries.filter(e => 
            format(new Date(e.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          );
          if (dayEntries.length === 0) return 0;
          const avgMood = dayEntries.reduce((sum, entry) => 
            sum + MOOD_VALUES[entry.mood as keyof typeof MOOD_VALUES], 0
          ) / dayEntries.length;
          return avgMood;
        });
        break;

      case 'month':
        const weeks = eachWeekOfInterval({
          start: startOfMonth(now),
          end: endOfMonth(now),
        });
        labels = weeks.map(week => `Week ${format(week, 'w')}`);
        data = weeks.map(week => {
          const weekEntries = entries.filter(e => {
            const entryDate = new Date(e.created_at);
            return entryDate >= week && entryDate < new Date(week.getTime() + 7 * 24 * 60 * 60 * 1000);
          });
          if (weekEntries.length === 0) return 0;
          const avgMood = weekEntries.reduce((sum, entry) => 
            sum + MOOD_VALUES[entry.mood as keyof typeof MOOD_VALUES], 0
          ) / weekEntries.length;
          return avgMood;
        });
        break;
    }

    return { labels, data };
  };

  const { labels, data } = getMoodData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Mood Level',
        data,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${view.charAt(0).toUpperCase() + view.slice(1)}ly Mood Trend`,
        color: 'white',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="p-4 bg-black/40 rounded-xl border border-white/20">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MoodGraph; 