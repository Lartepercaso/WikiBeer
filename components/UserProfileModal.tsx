import React from 'react';
import { BeerPost, BreweryPost } from '../types';
import Modal from './Modal';
import { TrashIcon } from '../constants';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfileModalProps {
  user: SupabaseUser | null;
  userBeers: BeerPost[];
  userBreweries: BreweryPost[];
  onClose: () => void;
  onLogout: () => void;
  onDeletePost: (postId: number, view: 'beers' | 'breweries', imageUrl: string) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, userBeers, userBreweries, onClose, onLogout, onDeletePost }) => {
  if (!user) return null;

  const handleDelete = (postId: number, view: 'beers' | 'breweries', imageUrl: string, name: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare "${name}"? L'azione è irreversibile.`)) {
      onDeletePost(postId, view, imageUrl);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Il Mio Profilo">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Dettagli Account</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Email:</span> {user.email}
          </p>
        </div>

        <div className="max-h-[40vh] overflow-y-auto space-y-4 pr-2">
          <div>
            <h4 className="font-semibold text-gray-700">Le mie Birre ({userBeers.length})</h4>
            {userBeers.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {userBeers.map(beer => (
                  <li key={`beer-${beer.id}`} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center space-x-3">
                      <img src={beer.imageUrl} alt={beer.name} className="w-10 h-10 object-cover rounded" />
                      <span className="text-sm font-medium text-gray-800">{beer.name}</span>
                    </div>
                    <button onClick={() => handleDelete(beer.id, 'beers', beer.imageUrl, beer.name)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Non hai ancora aggiunto nessuna birra.</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Le mie Birrerie ({userBreweries.length})</h4>
            {userBreweries.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {userBreweries.map(brewery => (
                  <li key={`brewery-${brewery.id}`} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center space-x-3">
                        <img src={brewery.imageUrl} alt={brewery.name} className="w-10 h-10 object-cover rounded" />
                        <span className="text-sm font-medium text-gray-800">{brewery.name}</span>
                    </div>
                    <button onClick={() => handleDelete(brewery.id, 'breweries', brewery.imageUrl, brewery.name)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Non hai ancora aggiunto nessuna birreria.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Chiudi
          </button>
          <button type="button" onClick={onLogout} className="px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900">
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;