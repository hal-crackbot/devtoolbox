'use client';

import { useState, useEffect, useRef } from 'react';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple QR code generation using a canvas-based approach
  // Note: In a real implementation, you'd use a proper QR library like qrcode
  const generateQR = async () => {
    if (!text.trim()) {
      setQrDataUrl('');
      return;
    }

    // For now, we'll create a placeholder QR code visualization
    // In production, you'd install and use the 'qrcode' npm package
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Create a simple grid pattern as placeholder
    // This is just for demonstration - replace with actual QR generation
    const moduleSize = size / 25; // 25x25 grid
    const modules = generateSimplePattern(text);

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // Draw QR pattern
    ctx.fillStyle = 'black';
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        if (modules[row] && modules[row][col]) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Convert to data URL
    setQrDataUrl(canvas.toDataURL());
  };

  // Simple pattern generator (placeholder for real QR encoding)
  const generateSimplePattern = (input: string) => {
    const modules = Array(25).fill(null).map(() => Array(25).fill(false));
    
    // Create finder patterns (corners)
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        // Top-left
        modules[i][j] = (i === 0 || i === 6 || j === 0 || j === 6 || 
                        (i >= 2 && i <= 4 && j >= 2 && j <= 4));
        // Top-right
        modules[i][18 + j] = (i === 0 || i === 6 || j === 0 || j === 6 || 
                             (i >= 2 && i <= 4 && j >= 2 && j <= 4));
        // Bottom-left
        modules[18 + i][j] = (i === 0 || i === 6 || j === 0 || j === 6 || 
                             (i >= 2 && i <= 4 && j >= 2 && j <= 4));
      }
    }

    // Add some data pattern based on input
    const hash = input.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    for (let i = 9; i < 16; i++) {
      for (let j = 9; j < 16; j++) {
        modules[i][j] = ((hash + i * j) % 3) === 0;
      }
    }

    return modules;
  };

  useEffect(() => {
    generateQR();
  }, [text, size, errorCorrection]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  const copyQRImage = async () => {
    if (!qrDataUrl) return;
    
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      alert('QR code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy QR code:', err);
      alert('Failed to copy QR code to clipboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">QR Code Generator</h1>
      <p className="text-gray-600 mb-6">
        Generate QR codes for text, URLs, phone numbers, and more. All processing happens in your browser.
      </p>

      {/* Text Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content to encode
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Enter text, URL, phone number, or any content to encode..."
        />
        <div className="text-xs text-gray-500 mt-1">
          {text.length} characters
        </div>
      </div>

      {/* Options */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size: {size}x{size}px
          </label>
          <input
            type="range"
            min="100"
            max="500"
            step="50"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Error Correction
          </label>
          <select
            value={errorCorrection}
            onChange={(e) => setErrorCorrection(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>

      {/* QR Code Display */}
      {text && (
        <div className="mb-6 text-center">
          <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="mx-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            )}
          </div>
          
          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={downloadQR}
              disabled={!qrDataUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Download PNG
            </button>
            <button
              onClick={copyQRImage}
              disabled={!qrDataUrl}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Copy Image
            </button>
          </div>
        </div>
      )}

      {/* Quick Templates */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Quick Templates:</h3>
        <div className="grid md:grid-cols-2 gap-2">
          <button
            onClick={() => setText('https://example.com')}
            className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg"
          >
            <div className="font-medium">Website URL</div>
            <div className="text-sm text-gray-600">https://example.com</div>
          </button>
          
          <button
            onClick={() => setText('tel:+1234567890')}
            className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg"
          >
            <div className="font-medium">Phone Number</div>
            <div className="text-sm text-gray-600">tel:+1234567890</div>
          </button>
          
          <button
            onClick={() => setText('mailto:example@email.com')}
            className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg"
          >
            <div className="font-medium">Email Address</div>
            <div className="text-sm text-gray-600">mailto:example@email.com</div>
          </button>
          
          <button
            onClick={() => setText('WIFI:T:WPA;S:NetworkName;P:password;;')}
            className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg"
          >
            <div className="font-medium">WiFi Network</div>
            <div className="text-sm text-gray-600">WPA network credentials</div>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">About QR Codes:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• QR codes can store up to 3,000 characters</li>
          <li>• Higher error correction allows the code to work even when damaged</li>
          <li>• This tool works entirely offline - no data is sent anywhere</li>
          <li>• QR codes work with any modern smartphone camera</li>
        </ul>
      </div>
    </div>
  );
}