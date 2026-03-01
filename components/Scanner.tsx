
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

interface ScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Não foi possível acessar a câmera.');
      }
    }
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // In a real app, we'd use a barcode library here. 
    // We simulate a successful scan for the demo when the user clicks 'Scan'.
    onScan('EXF-12345'); 
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 text-white">
        <h2 className="text-lg font-bold">Módulo Scan & Buy</h2>
        <button onClick={onClose}><X size={28} /></button>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-8">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Scanner Overlay UI */}
            <div className="relative z-10 w-64 h-64 border-2 border-blue-400 rounded-lg shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1"></div>
              
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500/50 animate-pulse"></div>
            </div>
          </>
        )}
      </div>

      <div className="bg-black/80 p-8 flex flex-col items-center">
        <p className="text-white text-sm mb-6 opacity-80">Aponte para o QR Code ou Código de Barras na prateleira</p>
        <button 
          onClick={captureFrame}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-blue-600 shadow-xl active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <Camera size={32} />
          </div>
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Scanner;
