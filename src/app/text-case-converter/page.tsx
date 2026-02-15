'use client';

import { useState } from 'react';

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState('');

  const conversions = {
    uppercase: (text: string) => text.toUpperCase(),
    lowercase: (text: string) => text.toLowerCase(),
    titleCase: (text: string) => text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
    camelCase: (text: string) => text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, ''),
    pascalCase: (text: string) => text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, ''),
    snakeCase: (text: string) => text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_'),
    kebabCase: (text: string) => text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-'),
    constantCase: (text: string) => text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toUpperCase())
      .join('_'),
    dotCase: (text: string) => text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('.'),
    alternatingCase: (text: string) => text
      .split('')
      .map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join(''),
    inverseCase: (text: string) => text
      .split('')
      .map(char => char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase())
      .join(''),
    sentenceCase: (text: string) => {
      const sentences = text.split(/([.!?]+)/);
      return sentences.map(sentence => {
        const trimmed = sentence.trim();
        if (trimmed.length === 0 || /^[.!?]+$/.test(trimmed)) return sentence;
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      }).join('');
    }
  };

  const caseOptions = [
    { key: 'uppercase', label: 'UPPERCASE', description: 'ALL LETTERS CAPITALIZED' },
    { key: 'lowercase', label: 'lowercase', description: 'all letters in lowercase' },
    { key: 'titleCase', label: 'Title Case', description: 'First Letter Of Each Word Capitalized' },
    { key: 'sentenceCase', label: 'Sentence case', description: 'First letter of each sentence capitalized.' },
    { key: 'camelCase', label: 'camelCase', description: 'firstWordLowercaseFollowingWordsCapitalized' },
    { key: 'pascalCase', label: 'PascalCase', description: 'FirstLetterOfEachWordCapitalized' },
    { key: 'snakeCase', label: 'snake_case', description: 'words_separated_by_underscores' },
    { key: 'kebabCase', label: 'kebab-case', description: 'words-separated-by-hyphens' },
    { key: 'constantCase', label: 'CONSTANT_CASE', description: 'ALL_WORDS_UPPERCASE_WITH_UNDERSCORES' },
    { key: 'dotCase', label: 'dot.case', description: 'words.separated.by.dots' },
    { key: 'alternatingCase', label: 'aLtErNaTiNg CaSe', description: 'EvErY oThEr LeTtEr CaPiTaLiZeD' },
    { key: 'inverseCase', label: 'iNVERSE cASE', description: 'cAPITAL LETTERS BECOME LOWERCASE' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  const getCharCount = (text: string) => {
    return text.length;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Text Case Converter</h1>
      <p className="text-gray-600 mb-6">
        Convert text between different cases: uppercase, lowercase, camelCase, snake_case, and more.
      </p>

      {/* Input Text */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Text
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Enter text to convert..."
        />
        <div className="mt-2 text-sm text-gray-500 flex gap-4">
          <span>Characters: {getCharCount(inputText)}</span>
          <span>Words: {getWordCount(inputText)}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setInputText('Hello World Example Text')}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
          >
            Sample Text
          </button>
          <button
            onClick={() => setInputText('')}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Conversion Results */}
      {inputText && (
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold mb-4">Converted Text:</h3>
          
          {caseOptions.map((option) => {
            const convertedText = conversions[option.key as keyof typeof conversions](inputText);
            
            return (
              <div key={option.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">{option.label}</h4>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(convertedText)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded border font-mono text-sm break-all">
                  {convertedText || <span className="text-gray-400 italic">Empty result</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Common Use Cases:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>camelCase:</strong> JavaScript variables and functions</li>
          <li>• <strong>PascalCase:</strong> Class names, React components</li>
          <li>• <strong>snake_case:</strong> Python variables, database columns</li>
          <li>• <strong>kebab-case:</strong> CSS classes, URL slugs</li>
          <li>• <strong>CONSTANT_CASE:</strong> Environment variables, constants</li>
          <li>• <strong>Title Case:</strong> Headlines, titles</li>
          <li>• <strong>Sentence case:</strong> Regular sentences and paragraphs</li>
        </ul>
      </div>
    </div>
  );
}