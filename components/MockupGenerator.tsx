import React, { useState, useRef } from 'react';
import { Upload, RefreshCw, Download, Maximize2 } from 'lucide-react';
import { Button } from './ui/Button';
import { generateMockup, fileToBase64 } from '../services/gemini';

const PRODUCTS = [
  'Ceramic Coffee Mug', 'Cotton T-Shirt', 'Hoodie', 'Tote Bag', 'Cap', 'Laptop Sticker', 'Throw Pillow', 'Phone Case'
];

const STYLES = [
  'Studio Lighting (Clean White Background)',
  'Lifestyle (On a wooden table in a cafe)',
  'Urban Street (Outdoor natural light)',
  'Minimalist (Soft pastel background)',
  'Industrial (Concrete background)'
];

export const MockupGenerator: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const base64 = await fileToBase64(file);
      // Add prefix for preview display
      setLogo(`data:image/png;base64,${base64}`);
    }
  };

  const handleGenerate = async () => {
    if (!logoFile || !logo) return;
    
    setLoading(true);
    try {
      const rawBase64 = logo.split(',')[1]; // Extract raw base64 for API
      const resultUrl = await generateMockup(rawBase64, product, style, customPrompt);
      setGeneratedImage(resultUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to generate mockup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Logo Mockup Generator</h2>
          <p className="text-gray-400">Upload your logo and visualize it on real-world products using AI.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Upload Section */}
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-2">1. Upload Logo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${logo ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'}`}
              >
                {logo ? (
                  <img src={logo} alt="Logo Preview" className="h-24 object-contain mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                )}
                <span className="text-sm text-gray-400">{logo ? 'Click to change' : 'Click to upload logo'}</span>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Configuration Section */}
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">2. Select Product</label>
                <select 
                  value={product} 
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">3. Select Style</label>
                <select 
                  value={style} 
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Extra Details (Optional)</label>
                <textarea 
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Make the mug blue, add steam rising..."
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm h-24 resize-none"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!logo} 
                isLoading={loading}
                className="w-full py-3 text-lg"
              >
                Generate Mockup
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 h-[600px] flex flex-col relative overflow-hidden group">
              {generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt="Generated Mockup" 
                    className="w-full h-full object-contain bg-black"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={generatedImage} 
                      download={`mockup-${Date.now()}.png`}
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-2 rounded-lg text-white border border-white/20"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                    <button 
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-2 rounded-lg text-white border border-white/20"
                      onClick={() => window.open(generatedImage, '_blank')}
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  {loading ? (
                     <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-full mb-4"></div>
                        <p>Gemini is crafting your mockup...</p>
                     </div>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-gray-700/30 rounded-full flex items-center justify-center mb-4">
                        <RefreshCw className="w-10 h-10 text-gray-600" />
                      </div>
                      <p className="text-lg">Your generated design will appear here</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
