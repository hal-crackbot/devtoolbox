'use client';

import { useState } from 'react';

export default function JWTDecoder() {
  const [token, setToken] = useState('');
  const [decodedHeader, setDecodedHeader] = useState('');
  const [decodedPayload, setDecodedPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const decodeJWT = (jwt: string) => {
    if (!jwt.trim()) {
      setDecodedHeader('');
      setDecodedPayload('');
      setSignature('');
      setError('');
      return;
    }

    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format - must have 3 parts separated by dots');
      }

      // Decode header
      const headerDecoded = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      setDecodedHeader(JSON.stringify(JSON.parse(headerDecoded), null, 2));

      // Decode payload
      const payloadDecoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      setDecodedPayload(JSON.stringify(JSON.parse(payloadDecoded), null, 2));

      // Set signature (base64url encoded)
      setSignature(parts[2]);
      
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JWT token');
      setDecodedHeader('');
      setDecodedPayload('');
      setSignature('');
    }
  };

  const handleTokenChange = (value: string) => {
    setToken(value);
    decodeJWT(value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getTokenInfo = (payload: string) => {
    try {
      const parsed = JSON.parse(payload);
      const info = [];
      
      if (parsed.exp) {
        const isExpired = Date.now() / 1000 > parsed.exp;
        info.push({
          label: 'Expires',
          value: formatTimestamp(parsed.exp),
          status: isExpired ? 'expired' : 'valid'
        });
      }
      
      if (parsed.iat) {
        info.push({
          label: 'Issued At',
          value: formatTimestamp(parsed.iat)
        });
      }
      
      if (parsed.nbf) {
        const isActive = Date.now() / 1000 >= parsed.nbf;
        info.push({
          label: 'Not Before',
          value: formatTimestamp(parsed.nbf),
          status: isActive ? 'active' : 'not-yet-active'
        });
      }
      
      return info;
    } catch {
      return [];
    }
  };

  const tokenInfo = decodedPayload ? getTokenInfo(decodedPayload) : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">JWT Token Decoder</h1>
      <p className="text-gray-600 mb-6">
        Decode JSON Web Tokens (JWT) and inspect header, payload, and signature. All processing happens in your browser.
      </p>

      {/* JWT Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          JWT Token
        </label>
        <textarea
          value={token}
          onChange={(e) => handleTokenChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          rows={4}
          placeholder="Paste your JWT token here..."
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => handleTokenChange(sampleJWT)}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
          >
            Load Sample JWT
          </button>
          <button
            onClick={() => handleTokenChange('')}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 font-medium">Error:</div>
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {/* Token Info */}
      {tokenInfo.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-3">Token Information:</h3>
          <div className="space-y-2">
            {tokenInfo.map((info, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-blue-700">{info.label}:</span>
                <span className={`font-mono text-sm ${
                  info.status === 'expired' ? 'text-red-600' : 
                  info.status === 'valid' ? 'text-green-600' : 
                  'text-blue-700'
                }`}>
                  {info.value}
                  {info.status === 'expired' && ' (EXPIRED)'}
                  {info.status === 'not-yet-active' && ' (NOT YET ACTIVE)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decoded Sections */}
      {(decodedHeader || decodedPayload) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Header */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Header</h3>
              <button
                onClick={() => copyToClipboard(decodedHeader)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {decodedHeader}
            </pre>
          </div>

          {/* Payload */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Payload</h3>
              <button
                onClick={() => copyToClipboard(decodedPayload)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {decodedPayload}
            </pre>
          </div>
        </div>
      )}

      {/* Signature */}
      {signature && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Signature</h3>
            <button
              onClick={() => copyToClipboard(signature)}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm break-all">
            {signature}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Note: Signature verification requires the secret key and is not performed by this tool.
          </div>
        </div>
      )}

      {/* JWT Structure Info */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">About JWT Tokens:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• JWT tokens consist of three parts: Header.Payload.Signature</li>
          <li>• Header contains the signing algorithm and token type</li>
          <li>• Payload contains the claims (user data, expiration, etc.)</li>
          <li>• Signature ensures the token hasn't been tampered with</li>
          <li>• This tool only decodes - it doesn't verify signatures</li>
          <li>• Never paste tokens containing sensitive data into unknown tools</li>
        </ul>
      </div>
    </div>
  );
}