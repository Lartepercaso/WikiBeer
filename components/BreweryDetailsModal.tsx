import React, { useState } from 'react';
import { BreweryPost } from '../types';
import Modal from './Modal';
import { ShareIcon, StarIcon, DirectionsIcon, TrashIcon } from '../constants';
import { User as SupabaseUser } from '@supabase/supabase-js';


interface BreweryDetailsModalProps {
  post: BreweryPost | null;
  user: SupabaseUser | null;
  isAdmin: boolean;
  onClose: () => void;
  onAddComment: (postId: number, commentText: string) => void;
  onRate: (postId: number, rating: number) => void;
  onShareClick: (post: BreweryPost, event: React.MouseEvent) => void;
  onDelete: (postId: number, view: 'beers' | 'breweries', imageUrl: string) => void;
}

const BreweryDetailsModal: React.FC<BreweryDetailsModalProps> = ({ post, user, isAdmin, onClose, onAddComment, onRate, onShareClick, onDelete }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  if (!post) return null;
  
  const isLoggedIn = !!user;
  const isOwner = user?.id === post.user_id;

  const userRating = user ? post.ratings.find(r => r.user_id === user.id)?.value || 0 : 0;
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !isLoggedIn) return;
    setIsSubmitting(true);
    await onAddComment(post.id, commentText);
    setCommentText('');
    setIsSubmitting(false);
  };

  const handleRating = (rating: number) => {
    if (!isLoggedIn) {
      alert("Devi effettuare il login per votare!");
      return;
    }
    onRate(post.id, rating);
  };

  const handleDelete = () => {
    if(window.confirm(`Sei sicuro di voler eliminare "${post.name}"? L'azione è irreversibile.`)) {
        onDelete(post.id, 'breweries', post.imageUrl);
        onClose();
    }
  };
  
  const averageRating = post.ratings.length > 0
    ? post.ratings.reduce((acc, r) => acc + r.value, 0) / post.ratings.length
    : 0;

  const directionsUrl = `https://www.openstreetmap.org/directions?from=&to=${post.lat},${post.lng}`;

  return (
    <Modal isOpen={!!post} onClose={onClose} title={post.name}>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {(isOwner || isAdmin) && (
             <button 
                onClick={handleDelete}
                className="absolute top-3 right-14 flex items-center space-x-1.5 text-sm bg-red-100 text-red-800 px-3 py-1.5 rounded-full hover:bg-red-200 transition flex-shrink-0"
              >
                 <TrashIcon className="w-4 h-4"/>
                 <span>Elimina</span>
             </button>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <img src={post.imageUrl} alt={post.name} className="w-full sm:w-40 h-48 object-cover rounded-md shadow-md"/>
          <div className="text-sm flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-lg text-amber-900">{post.address}</p>
                    <p className="text-gray-600">{post.city}, {post.nation}</p>
                     <a 
                        href={directionsUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm mt-2 text-amber-800 font-semibold hover:text-amber-600 transition bg-amber-100 px-3 py-1.5 rounded-full"
                      >
                        <DirectionsIcon className="w-5 h-5"/>
                        <span>Ottieni Indicazioni</span>
                    </a>
                </div>
                 <button onClick={(e) => onShareClick(post, e)} className="flex items-center space-x-1.5 text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-300 transition flex-shrink-0">
                     <ShareIcon className="w-4 h-4"/>
                     <span>Condividi</span>
                 </button>
            </div>
            <p className="text-gray-700 italic mt-4">"{post.description}"</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-md text-gray-800 mb-2">Valuta questa birreria</h4>
           <div className="flex items-center space-x-2">
             <div className="flex">
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                        <StarIcon
                        key={ratingValue}
                        className={`w-7 h-7 sm:w-8 sm:h-8 cursor-pointer transition-colors ${
                            ratingValue <= (hoverRating || userRating)
                            ? 'text-amber-400'
                            : 'text-gray-300'
                        }`}
                        onClick={() => handleRating(ratingValue)}
                        onMouseEnter={() => isLoggedIn && setHoverRating(ratingValue)}
                        onMouseLeave={() => isLoggedIn && setHoverRating(0)}
                        />
                    );
                })}
             </div>
             <span className="text-gray-600 text-sm">
                ({averageRating.toFixed(1)}/5 da {post.ratings.length} voti)
            </span>
           </div>
           {!isLoggedIn && <p className="text-xs text-gray-500 mt-1">Effettua il login per lasciare una valutazione.</p>}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-md text-gray-800 mb-2">Commenti ({post.comments.length})</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {post.comments.length > 0 ? (
                post.comments.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-2 rounded-md">
                        <p className="text-xs font-bold text-gray-700">{comment.user_email}</p>
                        <p className="text-sm text-gray-800">{comment.text}</p>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">Nessun commento ancora. Sii il primo!</p>
            )}
          </div>
          
          {isLoggedIn ? (
            <form onSubmit={handleCommentSubmit} className="mt-4 flex items-start space-x-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Scrivi un commento..."
                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                rows={2}
                disabled={isSubmitting}
              />
              <button type="submit" disabled={isSubmitting || !commentText.trim()} className="px-4 py-2 bg-amber-600 text-white rounded-md h-full disabled:bg-amber-300 hover:bg-amber-700 transition">
                Invia
              </button>
            </form>
          ) : (
             <p className="text-sm text-gray-500 mt-4">Effettua il login per lasciare un commento.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BreweryDetailsModal;