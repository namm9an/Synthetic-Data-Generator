import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../utils/cn';
import { motion } from 'framer-motion';

const fetchImages = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/samples`);
  return data;
};

const PreviewGallery = () => {
    const { data: images = [], isLoading } = useQuery({ queryKey: ['samples'], queryFn: fetchImages });
  const [selected, setSelected] = useState(null);

  return (
    <motion.section
      id="gallery"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Generated Images
      </h2>

      {isLoading ? (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="mb-4 break-inside-avoid w-full h-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
          {images.map((src) => (
            <img
              key={src}
              src={src}
              alt="sample"
              onClick={() => setSelected(src)}
              className="mb-4 w-full rounded-lg cursor-pointer hover:opacity-80 break-inside-avoid"
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <img src={selected} alt="full" className="max-h-[90vh] rounded-lg shadow-lg" />
        </div>
      )}
    </motion.section>
  );
};

export default PreviewGallery;
