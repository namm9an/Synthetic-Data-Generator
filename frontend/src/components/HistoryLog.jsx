import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, formatDate } from '../utils/cn';
import Button from './ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const fetchHistory = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/datasets`);
  return data;
};

const HistoryLog = () => {
    const [filter, setFilter] = useState('');
  const { data: history = [], isLoading } = useQuery({ queryKey: ['history'], queryFn: fetchHistory });

  const regenerateMutation = useMutation({
    mutationFn: async (item) => {
      await axios.post(`${API_BASE_URL}/generate`, item);
    },
    onSuccess: () => {
      toast.success('Regeneration queued');
    },
  });

  const filtered = history.filter((h) => h.classLabel.toLowerCase().includes(filter.toLowerCase()));

  return (
    <motion.section
      id="history"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Generation History
      </h2>

      <input
        type="text"
        placeholder="Filter by class label"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full mb-4 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
          {filtered.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.classLabel} <span className="text-xs text-gray-500 ml-2">(noise {item.noiseLevel})</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.timestamp)}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => regenerateMutation.mutate(item)}>
                Regenerate
              </Button>
            </div>
          ))}
          {!filtered.length && <p className="text-center text-gray-500 py-4">No results</p>}
        </div>
      )}
    </motion.section>
  );
};

export default HistoryLog;
