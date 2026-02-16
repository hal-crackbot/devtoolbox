'use client';

import { useState } from 'react';

export default function JsonToCsv() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState('');
  const [options, setOptions] = useState({
    includeHeaders: true,
    delimiter: ',',
    flattenNested: false
  });

  const flattenObject = (obj: any, prefix = ''): any => {
    let flattened: any = {};
    
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let newKey = prefix ? `${prefix}.${key}` : key;
        
        if (obj[key] === null || obj[key] === undefined) {
          flattened[newKey] = '';
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          if (options.flattenNested) {
            Object.assign(flattened, flattenObject(obj[key], newKey));
          } else {
            flattened[newKey] = JSON.stringify(obj[key]);
          }
        } else if (Array.isArray(obj[key])) {
          flattened[newKey] = obj[key].join('; ');
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  };

  const escapeCSVField = (field: string): string => {
    if (typeof field !== 'string') field = String(field);
    
    // If field contains delimiter, newlines, or quotes, wrap in quotes and escape internal quotes
    if (field.includes(options.delimiter) || field.includes('\n') || field.includes('\r') || field.includes('"')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    
    return field;
  };

  const convertJsonToCsv = () => {
    setError('');
    
    if (!jsonInput.trim()) {
      setError('Please enter JSON data to convert');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsed)) {
        setError('JSON must be an array of objects for CSV conversion');
        return;
      }

      if (parsed.length === 0) {
        setCsvOutput('');
        return;
      }

      // Flatten all objects if needed
      const flattened = parsed.map(item => 
        typeof item === 'object' ? flattenObject(item) : { value: item }
      );

      // Get all unique keys across all objects
      const allKeys = [...new Set(flattened.flatMap(obj => Object.keys(obj)))];

      let csv = '';

      // Add headers if enabled
      if (options.includeHeaders) {
        csv += allKeys.map(key => escapeCSVField(key)).join(options.delimiter) + '\n';
      }

      // Add data rows
      flattened.forEach(obj => {
        const row = allKeys.map(key => {
          const value = obj[key] ?? '';
          return escapeCSVField(String(value));
        });
        csv += row.join(options.delimiter) + '\n';
      });

      setCsvOutput(csv);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const downloadCsv = () => {
    if (!csvOutput) return;
    
    const blob = new Blob([csvOutput], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!csvOutput) return;
    
    try {
      await navigator.clipboard.writeText(csvOutput);
      // Show a temporary success message
      const button = document.getElementById('copy-button');
      const originalText = button?.textContent;
      if (button) {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const loadSampleData = () => {
    const sampleJson = JSON.stringify([
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30,
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "zip": "10001"
        },
        "skills": ["JavaScript", "React", "Node.js"]
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com", 
        "age": 25,
        "address": {
          "street": "456 Oak Ave",
          "city": "San Francisco",
          "zip": "94102"
        },
        "skills": ["Python", "Django", "PostgreSQL"]
      }
    ], null, 2);
    
    setJsonInput(sampleJson);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">JSON to CSV Converter</h1>
      <p className="text-gray-600 mb-6">
        Convert JSON arrays to CSV format with customizable options. Perfect for data analysis, spreadsheet imports, and database migrations.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">JSON Input</h2>
            <button
              onClick={loadSampleData}
              className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Load Sample
            </button>
          </div>
          
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON array here..."
            className="w-full h-80 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          {/* Options */}
          <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-700">Conversion Options</h3>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.includeHeaders}
                  onChange={(e) => setOptions({...options, includeHeaders: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">Include column headers</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.flattenNested}
                  onChange={(e) => setOptions({...options, flattenNested: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">Flatten nested objects (dot notation)</span>
              </label>

              <div className="flex items-center space-x-2">
                <label className="text-sm">Delimiter:</label>
                <select
                  value={options.delimiter}
                  onChange={(e) => setOptions({...options, delimiter: e.target.value})}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={convertJsonToCsv}
            className="mt-4 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Convert to CSV
          </button>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">CSV Output</h2>
            {csvOutput && (
              <div className="flex space-x-2">
                <button
                  id="copy-button"
                  onClick={copyToClipboard}
                  className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  Copy CSV
                </button>
                <button
                  onClick={downloadCsv}
                  className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Download
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <textarea
              value={csvOutput}
              readOnly
              placeholder="CSV output will appear here after conversion..."
              className="w-full h-80 p-4 font-mono text-sm border border-gray-300 rounded-lg bg-gray-50 resize-none"
            />
            
            {error && (
              <div className="absolute top-4 left-4 right-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {csvOutput && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Conversion Complete!</h3>
              <p className="text-sm text-green-700">
                Successfully converted JSON to CSV format. 
                {csvOutput.split('\n').filter(line => line.trim()).length - (options.includeHeaders ? 1 : 0)} data rows processed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-3">Usage Tips:</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• <strong>Input Format:</strong> JSON must be an array of objects for proper CSV conversion</li>
          <li>• <strong>Nested Objects:</strong> Use "flatten nested objects" to convert nested data to dot notation (address.street)</li>
          <li>• <strong>Arrays in Fields:</strong> Array values are automatically joined with semicolons</li>
          <li>• <strong>Special Characters:</strong> Fields containing delimiters or quotes are properly escaped</li>
          <li>• <strong>Large Files:</strong> Processing happens entirely in your browser - no data leaves your device</li>
        </ul>
      </div>
    </div>
  );
}