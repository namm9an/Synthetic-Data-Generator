import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';
import { API_BASE_URL } from '../utils/cn';

const fetchStats = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/stats`);
  return data;
};

const COLORS = ['#00ffff', '#ff00ff', '#8b5cf6', '#00ff00', '#3b82f6'];

const StatsDashboard = () => {
    const { data, isLoading } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });

  return (
    <motion.section
      id="stats"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Analytics Dashboard
      </h2>
      {isLoading || !data ? (
        <p className="text-center text-gray-500">Loading charts...</p>
      ) : (
        <div className="grid gap-8">
          {/* Bar Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.perDay}>
                <XAxis dataKey="date" hide />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" fill="#00ffff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">Total generations per day</p>
          </div>

          {/* Pie Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="count" data={data.labels} innerRadius={40} outerRadius={80} paddingAngle={4} label>
                  {data.labels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">Most common class labels</p>
          </div>

          {/* Line Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.avgNoise}>
                <XAxis dataKey="date" hide />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#ff00ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">Average noise level</p>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default StatsDashboard;
