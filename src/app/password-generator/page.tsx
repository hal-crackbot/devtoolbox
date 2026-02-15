'use client';

import { useState } from 'react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  const generatePassword = () => {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    if (!charset) {
      setPassword('Please select at least one character type');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length < 8) return { score: 1, text: 'Weak', color: 'text-red-500' };
    if (pwd.length < 12) return { score: 2, text: 'Fair', color: 'text-yellow-500' };
    if (pwd.length < 16) return { score: 3, text: 'Good', color: 'text-blue-500' };
    return { score: 4, text: 'Strong', color: 'text-green-500' };
  };

  const strength = password ? getPasswordStrength(password) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Password Generator</h1>
      <p className="text-gray-600 mb-6">
        Generate secure, random passwords with customizable options.
      </p>

      {/* Password Output */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generated Password
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
            placeholder="Click 'Generate Password' to create a password"
          />
          <button
            onClick={copyToClipboard}
            disabled={!password}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copy
          </button>
        </div>
        {strength && (
          <div className="mt-2 text-sm">
            Strength: <span className={`font-medium ${strength.color}`}>{strength.text}</span>
          </div>
        )}
      </div>

      {/* Length Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password Length: {length}
        </label>
        <input
          type="range"
          min="4"
          max="128"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>4</span>
          <span>128</span>
        </div>
      </div>

      {/* Character Type Options */}
      <div className="mb-6 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Include Characters:</h3>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="mr-2"
          />
          <span>Uppercase letters (A-Z)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="mr-2"
          />
          <span>Lowercase letters (a-z)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="mr-2"
          />
          <span>Numbers (0-9)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="mr-2"
          />
          <span>Symbols (!@#$%^&*)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
            className="mr-2"
          />
          <span>Exclude similar characters (i, l, 1, L, o, 0, O)</span>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
      >
        Generate Password
      </button>

      {/* Security Tips */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Security Tips:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use unique passwords for each account</li>
          <li>• Consider using a password manager</li>
          <li>• Enable two-factor authentication when possible</li>
          <li>• Longer passwords are generally more secure</li>
          <li>• This tool runs entirely in your browser - passwords are never sent anywhere</li>
        </ul>
      </div>
    </div>
  );
}