import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { API_BASE_URL } from '../utils/cn';
import Button from './ui/Button';
import { useSuggestions } from '../hooks/useSuggestions';

const schema = z.object({
  classLabel: z.string().min(1, 'Required'),
  noiseLevel: z.number().min(0).max(1),
  outputSize: z.number().min(1).max(1000),
});

const GenerationForm = () => {
    const [labelQuery, setLabelQuery] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema), defaultValues: { noiseLevel: 0.3, outputSize: 100 } });

  // Watchers
  const noiseLevel = watch('noiseLevel');

  // AI suggestions hooks
  const { data: labelSuggestions = [] } = useSuggestions('/suggest/labels', labelQuery);
  const { data: noiseSuggestions = [] } = useSuggestions('/suggest/noise', watch('classLabel'));

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(`${API_BASE_URL}/generate`, payload);
      return data;
    },
  });

  const onSubmit = async (values) => {
    await mutation.mutateAsync(values, {
      onSuccess: () => {
        reset();
        toast.success('Generation started!'); // Replace with toast provider
      },
      onError: (err) => {
        console.error(err);
        toast.error('Generation failed');
      },
    });
  };

  return (
    <motion.section
      id="generate"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
        Generate Your Data
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Class label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class Label</label>
          <input
            type="text"
            {...register('classLabel')}
            onChange={(e) => {
              register('classLabel').onChange(e);
              setLabelQuery(e.target.value);
            }}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-neon-cyan focus:border-neon-cyan"
            placeholder="e.g. cat"
            autoComplete="off"
          />
          {errors.classLabel && <p className="mt-1 text-red-600 text-sm">{errors.classLabel.message}</p>}

          {/* Suggestions dropdown */}
          {!!labelQuery && labelSuggestions.length > 0 && (
            <ul className="mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {labelSuggestions.map((s) => (
                <li
                  key={s}
                  onClick={() => {
                    reset({ classLabel: s, noiseLevel, outputSize: watch('outputSize') });
                    setLabelQuery('');
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Noise level slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Noise Level ({noiseLevel})</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            {...register('noiseLevel', { valueAsNumber: true })}
            className="w-full"
          />
          {errors.noiseLevel && <p className="mt-1 text-red-600 text-sm">{errors.noiseLevel.message}</p>}

          {/* Noise suggestions */}
          {noiseSuggestions.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Optimal noise levels: {noiseSuggestions.join(', ')}</p>
          )}
        </div>

        {/* Output size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output Size</label>
          <input
            type="number"
            {...register('outputSize', { valueAsNumber: true })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-neon-cyan focus:border-neon-cyan"
          />
          {errors.outputSize && <p className="mt-1 text-red-600 text-sm">{errors.outputSize.message}</p>}
        </div>

        <div className="text-center">
          <Button size="lg" loading={mutation.isPending} disabled={mutation.isPending} className="px-12">
            {mutation.isPending ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </form>
    </motion.section>
  );
};

export default GenerationForm;
