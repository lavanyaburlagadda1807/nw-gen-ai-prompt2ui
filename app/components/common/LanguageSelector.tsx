import React from 'react';

export interface LanguageOption {
  value: string;
  label: string;
}

const languageOptions: LanguageOption[] = [
  { value: 'en-IN', label: 'English' },
  { value: 'te-IN', label: 'Telugu' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange, className = '' }: LanguageSelectorProps) {
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => onLanguageChange(e.target.value)}
      className={`bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none ${className}`}
    >
      {languageOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
