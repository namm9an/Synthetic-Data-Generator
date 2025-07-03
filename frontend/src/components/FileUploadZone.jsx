import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Button from './ui/Button';
import { API_BASE_URL, formatFileSize } from '../utils/cn';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = [
  'application/x-pytorch',
  'application/onnx',
  'text/csv',
  'application/zip',
  'application/octet-stream',
  'application/x-npy',
];

const FileUploadZone = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      setStatus({ type: 'error', message: rejectedFiles[0].errors[0].message });
      return;
    }
    setFile(acceptedFiles[0]);
    setStatus(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: MAX_SIZE_BYTES,
    accept: {
      '.pt,.pth': ACCEPTED_TYPES,
      '.onnx': ACCEPTED_TYPES,
      '.csv': ACCEPTED_TYPES,
      '.npz': ACCEPTED_TYPES,
    },
    multiple: false,
    onDrop,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus({ type: 'success', message: 'Upload successful!' });
      setFile(null);
    } catch (error) {
      setStatus({ type: 'error', message: error?.response?.data?.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section
      id="upload"
      
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Upload Custom Model / Dataset
      </h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 cursor-pointer text-center transition-colors ${
          isDragActive ? 'border-neon-cyan' : 'border-gray-400/40'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-neon-cyan font-medium">Drop the file here...</p>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-300">Drag & drop a file here, or click to select one</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Accepted: .pt .pth .onnx .csv .npz — Max 10 MB
            </p>
          </>
        )}
      </div>

      {file && (
        <div className="mt-6 flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{formatFileSize(file.size)}</p>
          </div>
          <Button size="sm" onClick={() => setFile(null)} variant="ghost">
            Remove
          </Button>
        </div>
      )}

      <div className="mt-6 text-center">
        <Button
          size="lg"
          loading={uploading}
          disabled={!file || uploading}
          onClick={handleUpload}
          className="px-10"
        >
          Upload
        </Button>
      </div>

      {status && (
        <p
          className={`mt-4 text-center font-medium ${
            status.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status.message}
        </p>
      )}
    </section>
  );
};

export default FileUploadZone;
