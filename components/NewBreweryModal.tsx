import React, { useState } from 'react';
import { BreweryPost } from '../types';

interface NewBreweryModalProps {
  onClose: () => void;
  onAddBrewery: (breweryData: Omit<BreweryPost, 'id' | 'ratings' | 'comments' | 'created_at' | 'user_id' | 'lat' | 'lng'>, imageFile: File) => void;
}

const NewBreweryModal: React.FC<NewBreweryModalProps> = ({ onClose, onAddBrewery }) => {
  const [breweryData, setBreweryData] = useState<Partial<Omit<BreweryPost, 'lat' | 'lng'>>>({
    name: '',
    address: '',
    city: '',
    nation: '',
    imageUrl: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBreweryData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setBreweryData(prev => ({ ...prev, imageUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (breweryData.name && imageFile) {
        // Lat/Lng will be added in App.tsx, here we just pass the form data
        const { imageUrl, ...rest } = breweryData;
        onAddBrewery(rest as any, imageFile);
    } else {
      alert("Per favore, compila almeno il nome e aggiungi una foto.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-1 sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Birreria</label>
            <input id="name" name="name" placeholder="Es. Birrificio Lambrate" value={breweryData.name} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
        </div>
        <div className="col-span-1 sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Indirizzo</label>
            <input id="address" name="address" placeholder="Es. Via Adelchi, 5" value={breweryData.address} onChange={handleInputChange} className="w-full p-2 border rounded"/>
        </div>
        <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Città</label>
            <input id="city" name="city" placeholder="Es. Milano" value={breweryData.city} onChange={handleInputChange} className="w-full p-2 border rounded"/>
        </div>
        <div>
            <label htmlFor="nation" className="block text-sm font-medium text-gray-700 mb-1">Nazione</label>
            <input id="nation" name="nation" placeholder="Es. Italia" value={breweryData.nation} onChange={handleInputChange} className="w-full p-2 border rounded"/>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto della birreria</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required className="text-sm" />
      </div>
      
      {breweryData.imageUrl && <img src={breweryData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded mx-auto"/>}
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrizione (opzionale)</label>
        <textarea id="description" name="description" value={breweryData.description || ''} onChange={handleInputChange} placeholder="Descrivi la birreria, la sua storia, le sue birre..." rows={3} className="w-full p-2 border rounded"></textarea>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annulla</button>
        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">Aggiungi Birreria</button>
      </div>
    </form>
  );
};

export default NewBreweryModal;