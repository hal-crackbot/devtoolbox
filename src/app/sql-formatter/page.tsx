'use client';

import { useState } from 'react';

export default function SqlFormatter() {
  const [sqlInput, setSqlInput] = useState('');
  const [formattedSql, setFormattedSql] = useState('');
  const [options, setOptions] = useState({
    indent: 4,
    keywordCase: 'UPPER',
    commaPosition: 'AFTER',
    linesBetweenQueries: 2,
    maxLineLength: 80
  });

  const sqlKeywords = new Set([
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
    'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
    'ALTER', 'DROP', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION', 'TRIGGER',
    'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
    'UNION', 'ALL', 'DISTINCT', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CAST', 'CONVERT', 'COALESCE'
  ]);

  const formatKeyword = (keyword: string): string => {
    const normalizedKeyword = keyword.toUpperCase();
    if (!sqlKeywords.has(normalizedKeyword)) return keyword;
    
    return options.keywordCase === 'UPPER' ? 
      normalizedKeyword : 
      normalizedKeyword.toLowerCase();
  };

  const formatSqlQuery = (sql: string): string => {
    if (!sql.trim()) return sql;

    // Split by semicolons to handle multiple statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    return statements.map(statement => {
      const formatted = formatSingleStatement(statement.trim());
      return formatted;
    }).join(';\n'.repeat(options.linesBetweenQueries + 1));
  };

  const formatSingleStatement = (sql: string): string => {
    if (!sql.trim()) return sql;

    let formatted = sql;
    const indentStr = ' '.repeat(options.indent);
    
    // Remove extra whitespace
    formatted = formatted.replace(/\s+/g, ' ').trim();
    
    // Format main clauses
    const mainClauses = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 
      'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE'
    ];
    
    mainClauses.forEach(clause => {
      const regex = new RegExp(`\\b${clause}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${formatKeyword(clause)}`);
    });

    // Format JOIN clauses
    const joinTypes = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'];
    joinTypes.forEach(joinType => {
      const regex = new RegExp(`\\b${joinType}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${indentStr}${formatKeyword(joinType)}`);
    });

    // Format AND/OR in WHERE clauses
    formatted = formatted.replace(/\b(AND|OR)\b/gi, (match) => 
      `\n${indentStr}${formatKeyword(match)}`
    );

    // Format commas in SELECT clauses
    if (options.commaPosition === 'BEFORE') {
      formatted = formatted.replace(/,\s*/g, `\n${indentStr}, `);
    } else {
      formatted = formatted.replace(/,\s*/g, `,\n${indentStr}`);
    }

    // Format VALUES clause
    formatted = formatted.replace(/\bVALUES\b/gi, (match) => 
      `\n${formatKeyword(match)}`
    );

    // Format SET clause items
    formatted = formatted.replace(/(\bSET\b.*?)(\w+\s*=)/gi, (match, set, assignment) => {
      if (match.includes('\n')) return match; // Already formatted
      return `${set}\n${indentStr}${assignment}`;
    });

    // Clean up extra newlines and indentation
    const lines = formatted.split('\n');
    const cleanedLines = lines.map(line => {
      line = line.trim();
      
      // Apply proper indentation based on line type
      if (!line) return '';
      
      // Main clauses start at column 0
      if (/^(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE)/i.test(line)) {
        return line;
      }
      
      // Sub-clauses get indented
      if (/^(INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL OUTER JOIN|CROSS JOIN|AND|OR|,)/i.test(line)) {
        return indentStr + line;
      }
      
      // Other lines get indented
      return indentStr + line;
    });

    return cleanedLines.filter(line => line !== '').join('\n');
  };

  const formatSql = () => {
    if (!sqlInput.trim()) {
      setFormattedSql('');
      return;
    }

    try {
      const formatted = formatSqlQuery(sqlInput);
      setFormattedSql(formatted);
    } catch (error) {
      setFormattedSql('Error formatting SQL: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const minifySql = () => {
    if (!sqlInput.trim()) {
      setFormattedSql('');
      return;
    }

    const minified = sqlInput
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),;])\s*/g, '$1')
      .trim();
    
    setFormattedSql(minified);
  };

  const copyToClipboard = async () => {
    if (!formattedSql) return;
    
    try {
      await navigator.clipboard.writeText(formattedSql);
      const button = document.getElementById('copy-button');
      const originalText = button?.textContent ?? 'Copy SQL';
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

  const loadSampleSql = () => {
    const sampleSql = `SELECT u.id, u.name, u.email, p.title as post_title, p.created_at FROM users u INNER JOIN posts p ON u.id = p.user_id WHERE u.active = 1 AND p.published = 1 AND u.created_at > '2023-01-01' ORDER BY p.created_at DESC LIMIT 10;

UPDATE users SET last_login = NOW(), login_count = login_count + 1 WHERE id = 123 AND active = 1;

INSERT INTO logs (user_id, action, ip_address, created_at) VALUES (123, 'login', '192.168.1.1', NOW());`;
    
    setSqlInput(sampleSql);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">SQL Formatter</h1>
      <p className="text-gray-600 mb-6">
        Format and beautify SQL queries with customizable styling options. Supports multiple SQL dialects and complex queries.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">SQL Input</h2>
            <button
              onClick={loadSampleSql}
              className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Load Sample
            </button>
          </div>
          
          <textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            placeholder="Paste your SQL query here..."
            className="w-full h-80 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          {/* Options */}
          <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-700">Formatting Options</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Indent Size
                </label>
                <select
                  value={options.indent}
                  onChange={(e) => setOptions({...options, indent: parseInt(e.target.value)})}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Keyword Case
                </label>
                <select
                  value={options.keywordCase}
                  onChange={(e) => setOptions({...options, keywordCase: e.target.value})}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UPPER">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Comma Position
                </label>
                <select
                  value={options.commaPosition}
                  onChange={(e) => setOptions({...options, commaPosition: e.target.value})}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AFTER">After field</option>
                  <option value="BEFORE">Before field</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Lines Between Queries
                </label>
                <select
                  value={options.linesBetweenQueries}
                  onChange={(e) => setOptions({...options, linesBetweenQueries: parseInt(e.target.value)})}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={formatSql}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Format SQL
            </button>
            <button
              onClick={minifySql}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Minify SQL
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Formatted SQL</h2>
            {formattedSql && (
              <button
                id="copy-button"
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Copy SQL
              </button>
            )}
          </div>

          <textarea
            value={formattedSql}
            readOnly
            placeholder="Formatted SQL will appear here..."
            className="w-full h-80 p-4 font-mono text-sm border border-gray-300 rounded-lg bg-gray-50 resize-none"
          />

          {formattedSql && !formattedSql.startsWith('Error') && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Formatting Complete!</h3>
              <p className="text-sm text-green-700">
                SQL formatted successfully. 
                {formattedSql.split(';').filter(s => s.trim()).length} statement(s) processed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-3">SQL Formatting Features:</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• <strong>Multi-Statement Support:</strong> Handles multiple SQL statements separated by semicolons</li>
          <li>• <strong>Keyword Recognition:</strong> Automatically identifies and formats SQL keywords</li>
          <li>• <strong>JOIN Formatting:</strong> Properly indents JOIN clauses and ON conditions</li>
          <li>• <strong>WHERE Clause Formatting:</strong> Breaks down AND/OR conditions for readability</li>
          <li>• <strong>SELECT List Formatting:</strong> Organizes column lists with proper comma placement</li>
          <li>• <strong>Minification:</strong> Removes unnecessary whitespace for compact queries</li>
        </ul>
      </div>
    </div>
  );
}