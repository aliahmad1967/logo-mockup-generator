import React, { useState } from 'react';
import { ImageIcon, Download } from 'lucide-react';
import { Button } from './ui/Button';
import { generateImage } from '../services/gemini';
import { AspectRatio } from '../types';

const ASPECT_RATIOS: AspectRatio[] = ['1:1', '3:4', '4:3', '16:9', '9:16'];

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const url = await generateImage(prompt, aspectRatio);
      setGeneratedImage(url);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
         <header className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Creative Studio</h2>
          <p className="text-gray-400">Generate high-quality assets from scratch using Imagen 4.</p>
        </header>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-8 shadow-xl">
           <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1">
               <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Prompt</label>
               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Describe the image you want to generate..."
                 className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
               />
             </div>
             <div className="w-full md:w-48 flex flex-col gap-4">
               <div>
                 <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Aspect Ratio</label>
                 <div className="grid grid-cols-2 gap-2">
                   {ASPECT_RATIOS.map(ratio => (
                     <button
                       key={ratio}
                       onClick={() => setAspectRatio(ratio)}
                       className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                         aspectRatio === ratio 
                           ? 'bg-indigo-600 text-white' 
                           : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                       }`}
                     >
                       {ratio}
                     </button>
                   ))}
                 </div>
               </div>
               <Button 
                 onClick={handleGenerate} 
                 disabled={!prompt.trim()} 
                 isLoading={loading}
                 className="mt-auto h-12"
               >
                 Generate
               </Button>
             </div>
           </div>
        </div>

        {/* Result Area */}
        <div className="flex justify-center">
           {generatedImage ? (
              <div className="relative group rounded-xl overflow-hidden shadow-2xl max-w-full">
                 <img 
                   src={generatedImage} 
                   alt="Generated" 
                   className="max-h-[600px] w-auto object-contain bg-black" 
                 />
                 <a 
                    href={generatedImage} 
                    download={`imagen-${Date.now()}.jpg`}
                    className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                    <Download className="w-4 h-4 mr-2" /> Download High-Res
                 </a>
              </div>
           ) : (
             <div className={`w-full h-96 border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center ${loading ? 'bg-gray-800/30' : ''}`}>
                {loading ? (
                   <div className="text-center">
                      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400 animate-pulse">Dreaming up pixels...</p>
                   </div>
                ) : (
                   <div className="text-center text-gray-600">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Enter a prompt above to start</p>
                   </div>
                )}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};
