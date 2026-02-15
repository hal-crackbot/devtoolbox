'use client';

import { useState } from 'react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber1?: number;
  lineNumber2?: number;
}

export default function DiffTool() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  // Simple diff algorithm - in production, you'd use a library like diff
  const computeDiff = (text1: string, text2: string): DiffLine[] => {
    let lines1 = text1.split('\n');
    let lines2 = text2.split('\n');

    if (ignoreCase) {
      lines1 = lines1.map(line => line.toLowerCase());
      lines2 = lines2.map(line => line.toLowerCase());
    }

    if (ignoreWhitespace) {
      lines1 = lines1.map(line => line.trim());
      lines2 = lines2.map(line => line.trim());
    }

    const result: DiffLine[] = [];
    let i = 0, j = 0;
    const originalLines1 = text1.split('\n');
    const originalLines2 = text2.split('\n');

    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        // Only text2 has remaining lines
        result.push({
          type: 'added',
          content: originalLines2[j],
          lineNumber2: j + 1,
        });
        j++;
      } else if (j >= lines2.length) {
        // Only text1 has remaining lines
        result.push({
          type: 'removed',
          content: originalLines1[i],
          lineNumber1: i + 1,
        });
        i++;
      } else if (lines1[i] === lines2[j]) {
        // Lines are the same
        result.push({
          type: 'unchanged',
          content: originalLines1[i],
          lineNumber1: i + 1,
          lineNumber2: j + 1,
        });
        i++;
        j++;
      } else {
        // Lines are different - simple approach: mark both as changed
        result.push({
          type: 'removed',
          content: originalLines1[i],
          lineNumber1: i + 1,
        });
        result.push({
          type: 'added',
          content: originalLines2[j],
          lineNumber2: j + 1,
        });
        i++;
        j++;
      }
    }

    return result;
  };

  const diff = computeDiff(text1, text2);

  const getStats = () => {
    const added = diff.filter(line => line.type === 'added').length;
    const removed = diff.filter(line => line.type === 'removed').length;
    const unchanged = diff.filter(line => line.type === 'unchanged').length;
    
    return { added, removed, unchanged, total: added + removed + unchanged };
  };

  const stats = getStats();

  const loadSampleData = () => {
    setText1(`function greetUser(name) {
  console.log("Hello " + name);
  return "Welcome!";
}

const users = ["Alice", "Bob"];
for (let i = 0; i < users.length; i++) {
  greetUser(users[i]);
}`);

    setText2(`function greetUser(name, greeting = "Hello") {
  console.log(greeting + " " + name + "!");
  return "Welcome back!";
}

const users = ["Alice", "Bob", "Charlie"];
users.forEach(user => {
  greetUser(user, "Hi");
});`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Text Diff Tool</h1>
      <p className="text-gray-600 mb-6">
        Compare two texts and see the differences highlighted. Perfect for code reviews, document comparison, and version control.
      </p>

      {/* Options */}
      <div className="mb-6 flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showLineNumbers}
            onChange={(e) => setShowLineNumbers(e.target.checked)}
            className="mr-2"
          />
          <span>Show line numbers</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
            className="mr-2"
          />
          <span>Ignore whitespace</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="mr-2"
          />
          <span>Ignore case</span>
        </label>

        <button
          onClick={loadSampleData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Load Sample
        </button>

        <button
          onClick={() => { setText1(''); setText2(''); }}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          Clear All
        </button>
      </div>

      {/* Input Textareas */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Text
          </label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={10}
            placeholder="Paste original text here..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modified Text
          </label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={10}
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      {/* Stats */}
      {(text1 || text2) && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Comparison Results:</h3>
          <div className="flex gap-6 text-sm">
            <span className="text-green-600">
              <span className="font-medium">{stats.added}</span> lines added
            </span>
            <span className="text-red-600">
              <span className="font-medium">{stats.removed}</span> lines removed
            </span>
            <span className="text-gray-600">
              <span className="font-medium">{stats.unchanged}</span> lines unchanged
            </span>
          </div>
        </div>
      )}

      {/* Diff Output */}
      {(text1 || text2) && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Differences:</h3>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 text-sm font-medium text-gray-700 border-b">
              Side-by-side comparison
            </div>
            <div className="bg-white max-h-96 overflow-auto">
              {diff.map((line, index) => (
                <div
                  key={index}
                  className={`flex text-sm font-mono ${
                    line.type === 'added'
                      ? 'bg-green-50 border-l-4 border-green-500'
                      : line.type === 'removed'
                      ? 'bg-red-50 border-l-4 border-red-500'
                      : 'bg-white'
                  }`}
                >
                  {showLineNumbers && (
                    <div className="flex">
                      <div className="w-12 p-2 text-center text-gray-500 bg-gray-50 border-r">
                        {line.lineNumber1 || ''}
                      </div>
                      <div className="w-12 p-2 text-center text-gray-500 bg-gray-50 border-r">
                        {line.lineNumber2 || ''}
                      </div>
                    </div>
                  )}
                  <div className="flex-1 p-2">
                    <span
                      className={
                        line.type === 'added'
                          ? 'text-green-800'
                          : line.type === 'removed'
                          ? 'text-red-800'
                          : 'text-gray-800'
                      }
                    >
                      {line.type === 'added' && '+ '}
                      {line.type === 'removed' && '- '}
                      {line.content || ' '}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">How to use:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Paste your original text in the left box</li>
          <li>• Paste the modified version in the right box</li>
          <li>• Green lines show additions, red lines show removals</li>
          <li>• Use the options to ignore case or whitespace differences</li>
          <li>• Perfect for comparing code, documents, or configuration files</li>
          <li>• All processing happens locally - your text never leaves your browser</li>
        </ul>
      </div>
    </div>
  );
}