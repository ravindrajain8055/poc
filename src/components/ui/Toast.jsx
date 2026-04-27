import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 min-w-[300px] bg-white border border-gray-200 rounded-lg shadow-xl p-4 flex items-start gap-3"
      >
        {type === 'success' ? (
          <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
        ) : (
          <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
