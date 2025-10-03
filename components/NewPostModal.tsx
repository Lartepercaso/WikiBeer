import React, { useState, useRef } from 'react';
import { BeerPost } from '../types';
import { CameraIcon } from '../constants';

interface NewPostModalProps {
  onClose: () => void;
  onAddPost: (post: Omit<BeerPost, 'id' | 'ratings' | 'comments' | 'created_at' | 'user_id'>, imageFile: File | null) => void;
}

// Funzione helper per convertire un data URL in un oggetto File
const dataUrlToFile = (dataUrl: string, filename: string): File | null => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) return null;
    
    const match = arr[0].match(/:(.*?);/);
    if (!match) return null;
    
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};


const NewPostModal: React.FC<NewPostModalProps> = ({ onClose, onAddPost }) => {
  const [beerData, setBeerData] = useState<Partial<BeerPost>>({
    name: '',
    brewery: '',
    nation: '',
    type: '',
    abv: 0,
    price: 0,
    imageUrl: '', // Usato per l'anteprima
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = e.target.type === 'number';
    setBeerData(prev => ({
      ...prev,
      [name]: isNumber ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setBeerData(prev => ({ ...prev, imageUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Impossibile accedere alla fotocamera. Assicurati di aver dato i permessi necessari.");
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setBeerData(prev => ({ ...prev, imageUrl: dataUrl }));
      const file = dataUrlToFile(dataUrl, `photo-${Date.now()}.jpg`);
      if (file) {
          setImageFile(file);
      }
      stopCamera();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (beerData.name && imageFile) {
      const { imageUrl, ...rest } = beerData;
      onAddPost(rest as Omit<BeerPost, 'id' | 'ratings' | 'comments' | 'created_at' | 'user_id'>, imageFile);
    } else {
      alert("Per favore, compila almeno il nome e aggiungi una foto.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Birra</label>
        <input id="name" name="name" placeholder="Es. La Bionda" value={beerData.name} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
      </div>
      <div>
        <label htmlFor="brewery" className="block text-sm font-medium text-gray-700 mb-1">Birrificio</label>
        <input id="brewery" name="brewery" placeholder="Es. Birrificio del Ducato" value={beerData.brewery} onChange={handleInputChange} className="w-full p-2 border rounded"/>
      </div>
      <div>
        <label htmlFor="nation" className="block text-sm font-medium text-gray-700 mb-1">Nazione</label>
        <input id="nation" name="nation" placeholder="Es. Italia" value={beerData.nation} onChange={handleInputChange} className="w-full p-2 border rounded"/>
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo di Birra</label>
        <input id="type" name="type" placeholder="Es. Golden Ale" value={beerData.type} onChange={handleInputChange} className="w-full p-2 border rounded"/>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="abv" className="block text-sm font-medium text-gray-700 mb-1">Grado Alcolico (%)</label>
          <input id="abv" name="abv" type="number" step="0.1" placeholder="Es. 5.0" value={beerData.abv} onChange={handleInputChange} className="w-full p-2 border rounded"/>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Prezzo (€)</label>
          <input id="price" name="price" type="number" step="0.01" placeholder="Es. 6.50" value={beerData.price} onChange={handleInputChange} className="w-full p-2 border rounded"/>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto della birra</label>
        <div className="flex items-center space-x-4">
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          <button type="button" onClick={isCameraOn ? stopCamera : startCamera} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
            <CameraIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
      
      {isCameraOn && (
        <div className="bg-black rounded">
          <video ref={videoRef} autoPlay className="w-full rounded" />
          <button type="button" onClick={capturePhoto} className="w-full bg-red-500 text-white p-2 mt-2 rounded hover:bg-red-600">
            Scatta Foto
          </button>
        </div>
      )}
      
      {beerData.imageUrl && <img src={beerData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded mx-auto"/>}
      <canvas ref={canvasRef} className="hidden" />
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrizione (opzionale)</label>
        <textarea id="description" name="description" value={beerData.description || ''} onChange={handleInputChange} placeholder="Descrivi le sue caratteristiche..." rows={3} className="w-full p-2 border rounded"></textarea>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annulla</button>
        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">Aggiungi Post</button>
      </div>
    </form>
  );
};

export default NewPostModal;