import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onLoginClick }) => {
  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center text-white text-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598305344428-09a54b68181f?q=80&w=1974&auto=format&fit=crop')" }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center animate-fade-in-up">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-amber-300 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          WiKiBeer & Brewery
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-amber-100 max-w-2xl">
          il social con il più alto contenuto di luppolo !
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onLoginClick} 
              className="bg-amber-500 text-amber-900 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-amber-400 transition-transform hover:scale-105"
            >
              Beer Lover (Login)
            </button>
            <button 
              onClick={onEnter} 
              className="bg-white/20 backdrop-blur-sm text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg border border-white/30 hover:bg-white/30 transition-transform hover:scale-105"
            >
              Ospite
            </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;