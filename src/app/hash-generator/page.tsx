"use client";
import { useState } from "react";

async function hash(algo: string, text: string) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// MD5 is not in Web Crypto, so we include a minimal implementation
function md5(str: string): string {
  function h(a: number, b: number) { const c = (a & 0xffff) + (b & 0xffff); return (((a >> 16) + (b >> 16) + (c >> 16)) << 16) | (c & 0xffff); }
  function r(n: number, c: number) { return (n << c) | (n >>> (32 - c)); }
  function f(q: number, a: number, b: number, x: number, s: number, t: number) { return h(r(h(h(a, q), h(x, t)), s), b); }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return f((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return f((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return f(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return f(c ^ (b | ~d), a, b, x, s, t); }

  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); if (c < 128) bytes.push(c); else if (c < 2048) { bytes.push(192 | (c >> 6)); bytes.push(128 | (c & 63)); } else { bytes.push(224 | (c >> 12)); bytes.push(128 | ((c >> 6) & 63)); bytes.push(128 | (c & 63)); } }
  const len = bytes.length;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const bitLen = len * 8;
  bytes.push(bitLen & 0xff, (bitLen >> 8) & 0xff, (bitLen >> 16) & 0xff, (bitLen >> 24) & 0xff, 0, 0, 0, 0);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  for (let i = 0; i < bytes.length; i += 64) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++) w[j] = bytes[i + j * 4] | (bytes[i + j * 4 + 1] << 8) | (bytes[i + j * 4 + 2] << 16) | (bytes[i + j * 4 + 3] << 24);
    let a = a0, b = b0, c = c0, d = d0;
    a=ff(a,b,c,d,w[0],7,-680876936);d=ff(d,a,b,c,w[1],12,-389564586);c=ff(c,d,a,b,w[2],17,606105819);b=ff(b,c,d,a,w[3],22,-1044525330);
    a=ff(a,b,c,d,w[4],7,-176418897);d=ff(d,a,b,c,w[5],12,1200080426);c=ff(c,d,a,b,w[6],17,-1473231341);b=ff(b,c,d,a,w[7],22,-45705983);
    a=ff(a,b,c,d,w[8],7,1770035416);d=ff(d,a,b,c,w[9],12,-1958414417);c=ff(c,d,a,b,w[10],17,-42063);b=ff(b,c,d,a,w[11],22,-1990404162);
    a=ff(a,b,c,d,w[12],7,1804603682);d=ff(d,a,b,c,w[13],12,-40341101);c=ff(c,d,a,b,w[14],17,-1502002290);b=ff(b,c,d,a,w[15],22,1236535329);
    a=gg(a,b,c,d,w[1],5,-165796510);d=gg(d,a,b,c,w[6],9,-1069501632);c=gg(c,d,a,b,w[11],14,643717713);b=gg(b,c,d,a,w[0],20,-373897302);
    a=gg(a,b,c,d,w[5],5,-701558691);d=gg(d,a,b,c,w[10],9,38016083);c=gg(c,d,a,b,w[15],14,-660478335);b=gg(b,c,d,a,w[4],20,-405537848);
    a=gg(a,b,c,d,w[9],5,568446438);d=gg(d,a,b,c,w[14],9,-1019803690);c=gg(c,d,a,b,w[3],14,-187363961);b=gg(b,c,d,a,w[8],20,1163531501);
    a=gg(a,b,c,d,w[13],5,-1444681467);d=gg(d,a,b,c,w[2],9,-51403784);c=gg(c,d,a,b,w[7],14,1735328473);b=gg(b,c,d,a,w[12],20,-1926607734);
    a=hh(a,b,c,d,w[5],4,-378558);d=hh(d,a,b,c,w[8],11,-2022574463);c=hh(c,d,a,b,w[11],16,1839030562);b=hh(b,c,d,a,w[14],23,-35309556);
    a=hh(a,b,c,d,w[1],4,-1530992060);d=hh(d,a,b,c,w[4],11,1272893353);c=hh(c,d,a,b,w[7],16,-155497632);b=hh(b,c,d,a,w[10],23,-1094730640);
    a=hh(a,b,c,d,w[13],4,681279174);d=hh(d,a,b,c,w[0],11,-358537222);c=hh(c,d,a,b,w[3],16,-722521979);b=hh(b,c,d,a,w[6],23,76029189);
    a=hh(a,b,c,d,w[9],4,-640364487);d=hh(d,a,b,c,w[12],11,-421815835);c=hh(c,d,a,b,w[15],16,530742520);b=hh(b,c,d,a,w[2],23,-995338651);
    a=ii(a,b,c,d,w[0],6,-198630844);d=ii(d,a,b,c,w[7],10,1126891415);c=ii(c,d,a,b,w[14],15,-1416354905);b=ii(b,c,d,a,w[5],21,-57434055);
    a=ii(a,b,c,d,w[12],6,1700485571);d=ii(d,a,b,c,w[3],10,-1894986606);c=ii(c,d,a,b,w[10],15,-1051523);b=ii(b,c,d,a,w[1],21,-2054922799);
    a=ii(a,b,c,d,w[8],6,1873313359);d=ii(d,a,b,c,w[15],10,-30611744);c=ii(c,d,a,b,w[6],15,-1560198380);b=ii(b,c,d,a,w[13],21,1309151649);
    a=ii(a,b,c,d,w[4],6,-145523070);d=ii(d,a,b,c,w[11],10,-1120210379);c=ii(c,d,a,b,w[2],15,718787259);b=ii(b,c,d,a,w[9],21,-343485551);
    a0=h(a0,a);b0=h(b0,b);c0=h(c0,c);d0=h(d0,d);
  }
  const hex = (n: number) => Array.from({length:4},(_,i)=>((n>>(i*8))&0xff).toString(16).padStart(2,"0")).join("");
  return hex(a0)+hex(b0)+hex(c0)+hex(d0);
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<{ md5: string; sha1: string; sha256: string } | null>(null);

  const generate = async () => {
    const [sha1, sha256] = await Promise.all([hash("SHA-1", input), hash("SHA-256", input)]);
    setHashes({ md5: md5(input), sha1, sha256 });
  };

  const copyHash = (v: string) => navigator.clipboard.writeText(v);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Hash Generator</h1>
      <p className="text-gray-400 mb-6">Generate MD5, SHA-1, and SHA-256 hashes from any text. Everything runs in your browser.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <textarea className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:border-purple-500 focus:outline-none resize-y" placeholder="Enter text to hash..." value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={generate} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Generate Hashes</button>
      {hashes && (
        <div className="mt-4 space-y-3">
          {(["md5", "sha1", "sha256"] as const).map((algo) => (
            <div key={algo} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 uppercase font-bold">{algo === "sha1" ? "SHA-1" : algo === "sha256" ? "SHA-256" : "MD5"}</span>
                <button onClick={() => copyHash(hashes[algo])} className="text-xs text-purple-400 hover:text-purple-300">Copy</button>
              </div>
              <code className="font-mono text-sm break-all">{hashes[algo]}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
