import React from 'react';
import { BeerPost } from '../types';
import { ShareIcon, StarIcon, CommentIcon } from '../constants';

interface BeerCardProps {
  post: BeerPost;
  onDetailsClick: (post: BeerPost) => void;
  onShareClick: (post: BeerPost, event: React.MouseEvent) => void;
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

const BeerCard: React.FC<BeerCardProps> = ({ post, onDetailsClick, onShareClick }) => {
  const averageRating = post.ratings.length > 0
    ? post.ratings.reduce((acc, r) => acc + r.value, 0) / post.ratings.length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <img src={post.imageUrl} alt={post.name} className="w-full h-64 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-amber-900">{post.name}</h3>
            <StarRating rating={averageRating} />
        </div>
        <p className="text-sm text-gray-500 mb-2">{post.brewery}</p>
        
        <div className="text-xs mb-4 space-y-1">
            <p><span className="font-semibold">Nazione:</span> {post.nation}</p>
            <p><span className="font-semibold">Tipo:</span> {post.type}</p>
            <p><span className="font-semibold">ABV:</span> {post.abv.toFixed(1)}%</p>
        </div>

        {post.description && (
          <p className="text-sm text-gray-700 mb-4 flex-grow italic">"{post.description}"</p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-lg font-bold text-amber-800">€{post.price.toFixed(2)}</p>
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

export default React.memo(BeerCard);