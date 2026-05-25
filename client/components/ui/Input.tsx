'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-pinterest focus:ring-2 focus:ring-pinterest/20 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-pinterest">{error}</p>}
    </div>
  );
}
