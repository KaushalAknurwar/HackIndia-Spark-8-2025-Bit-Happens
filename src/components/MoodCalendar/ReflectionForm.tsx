import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ReflectionFormProps {
  prompt: string;
  reflection: string;
  onReflectionChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const ReflectionForm = ({ 
  prompt, 
  reflection, 
  onReflectionChange, 
  onSave, 
  onClose 
}: ReflectionFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="space-y-4"
    >
      <label className="block text-sm font-medium text-black">
        {prompt}
      </label>
      <Textarea
        placeholder="Share your thoughts... (max 280 characters)"
        value={reflection}
        onChange={(e) => onReflectionChange(e.target.value)}
        maxLength={280}
        className="min-h-[100px] text-black"
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave} className="relative">
          Save Entry
        </Button>
      </div>
    </motion.div>
  );
};

export default ReflectionForm;