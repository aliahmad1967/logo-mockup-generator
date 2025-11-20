import React, { useState, useRef } from 'react';
import { Upload, Wand2, Download, CornerUpLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { editImage, fileToBase64 } from '../services/gemini';

export const ImageEditor: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setSourceImage(`data:image/png;base64,${base64}`);
      setResultImage(null); // Reset previous result
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt.trim()) return;

    setLoading(true);
    try {
      const rawBase64 = sourceImage.split(',')[1]; // Extract raw base64
      // Send to Gemini 2.5 Flash Image
      const editedUrl = await editImage(rawBase64, prompt);
      setResultImage(editedUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to edit image.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSourceImage(null);
    setResultImage(null);
    setPrompt('');
  };

  const handleUseResultAsSource = () => {
    if (resultImage) {
      setSourceImage(resultImage);
      setResultImage(null);
      setPrompt('');
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-900 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Smart Image Editor</h2>
            <p className="text-gray-400">Use natural language to modify your images.</p>
          </div>
          {sourceImage && (
             <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                <CornerUpLeft className="w-4 h-4" /> Reset
             </Button>
          )}
        </header>

        {!sourceImage ? (
           // Empty State
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="border-2 border-dashed border-gray-700 rounded-3xl h-96 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-gray-800/50 transition-all"
           >
             <div className="bg-gray-800 p-6 rounded-full mb-6">
                <Upload className="w-12 h-12 text-indigo-400" />
             </div>
             <h3 className="text-xl font-semibold text-white mb-2">Upload an Image to Edit</h3>
             <p className="text-gray-400">Supports JPG, PNG, WEBP</p>
             <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleFileChange}
             />
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Column */}
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Original</h4>
                <img src={sourceImage} alt="Original" className="w-full h-auto rounded-lg object-cover max-h-[400px]" />
              </div>

              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                 <label className="block text-sm font-medium text-gray-300 mb-2">What would you like to change?</label>
                 <div className="flex gap-2">
                   <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., 'Add a retro filter', 'Remove the person', 'Make it night time'"
                      className="flex-1 bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                   />
                   <Button onClick={handleEdit} isLoading={loading} disabled={!prompt.trim()}>
                     <Wand2 className="w-5 h-5" />
                   </Button>
                 </div>
                 <div className="mt-4 flex flex-wrap gap-2">
                    {['Add a neon glow', 'Turn into a sketch', 'Make it cyberpunk style'].map(s => (
                      <button 
                        key={s}
                        onClick={() => setPrompt(s)}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            {/* Result Column */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 flex flex-col h-full">
              <h4 className="text-sm font-medium text-indigo-400 mb-3 uppercase tracking-wider">Result</h4>
              <div className="flex-1 bg-gray-900/50 rounded-lg flex items-center justify-center overflow-hidden relative group min-h-[300px]">
                {resultImage ? (
                   <>
                     <img src={resultImage} alt="Edited" className="w-full h-full object-contain" />
                     <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-center">
                       <Button onClick={handleUseResultAsSource} variant="secondary" className="text-sm">
                         Use as new input
                       </Button>
                       <a 
                         href={resultImage}
                         download={`edited-${Date.now()}.png`}
                         className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                       >
                         <Download className="w-4 h-4 mr-2" /> Save
                       </a>
                     </div>
                   </>
                ) : (
                  <div className="text-center text-gray-500">
                    {loading ? (
                       <div className="flex flex-col items-center">
                         <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                         <span>Editing pixels...</span>
                       </div>
                    ) : (
                       <span>Edited image appears here</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
