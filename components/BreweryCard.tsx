import React from 'react';
import { BreweryPost, User } from '../types';
import { ShareIcon, StarIcon, DirectionsIcon, CommentIcon, TrashIcon } from '../constants';

interface BreweryCardProps {
  post: BreweryPost;
  user: User | null;
  isAdmin: boolean;
  onDetailsClick: (post: BreweryPost) => void;
  onShareClick: (post: BreweryPost, event: React.MouseEvent) => void;
  onDelete: (postId: number, view: 'beers' | 'breweries', imageUrl: string) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          className={`w-5 h-5 ${index < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const BreweryCard: React.FC<BreweryCardProps> = ({ post, user, isAdmin, onDetailsClick, onShareClick, onDelete }) => {
  const averageRating = post.ratings.length > 0
    ? post.ratings.reduce((acc, r) => acc + r.value, 0) / post.ratings.length
    : 0;
    
  const directionsUrl = `https://www.openstreetmap.org/directions?from=&to=${post.lat},${post.lng}`;
  
  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if(window.confirm(`Sei sicuro di voler eliminare "${post.name}"? L'azione è irreversibile.`)) {
          onDelete(post.id, 'breweries', post.imageUrl);
      }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
       {isAdmin && (
        <button 
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-red-600/80 text-white p-1.5 rounded-full hover:bg-red-700 transition z-10" 
          aria-label="Elimina post"
        >
            <TrashIcon className="w-4 h-4" />
        </button>
      )}
      <img src={post.imageUrl} alt={post.name} className="w-full h-64 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-amber-900">{post.name}</h3>
            <StarRating rating={averageRating} />
        </div>
        <p className="text-sm text-gray-500 mb-2">{post.city}, {post.nation}</p>
        
        {post.description && (
          <p className="text-sm text-gray-700 mb-4 flex-grow italic">"{post.description.substring(0, 100)}{post.description.length > 100 ? '...' : ''}"</p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
             <a 
                href={directionsUrl}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center space-x-2 text-sm text-amber-800 font-semibold hover:text-amber-600 transition"
              >
                <DirectionsIcon className="w-5 h-5"/>
                <span>Indicazioni</span>
            </a>
            <div className="flex items-center space-x-2">
                 <div className="flex items-center text-gray-500 text-sm" title={`${post.comments.length} commenti`}>
                    <CommentIcon className="w-5 h-5 mr-1"/>
                    <span>{post.comments.length}</span>
                </div>
                <button onClick={(e) => onShareClick(post, e)} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition" aria-label="Condividi">
                    <ShareIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => onDetailsClick(post)} className="text-xs bg-amber-800 text-white font-semibold px-4 py-2 rounded-full hover:bg-amber-900 transition">
                    Vedi Dettagli
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BreweryCard);