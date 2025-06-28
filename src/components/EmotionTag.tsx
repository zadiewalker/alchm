'use client';

import { FC } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const EMOTIONS = ['😊', '😢', '😡', '😱', '❤️', '😴', '🤔', '😎'];

const EmotionTag: FC<Props> = ({ value, onChange, placeholder }) => {
  return (
    <div>
      <p className="mb-2 font-medium">{placeholder}</p>
      <div className="flex flex-wrap gap-2">
        {EMOTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onChange(emoji)}
            className={`text-2xl px-3 py-2 border rounded-full ${
              value === emoji ? 'bg-black text-white' : 'bg-gray-100'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionTag;
