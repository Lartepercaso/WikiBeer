import React from 'react';
import { SearchIcon, HelpIcon, LanguageIcon, BeerIcon, BreweryIcon, UserIcon } from '../constants';

type View = 'beers' | 'breweries';

interface HeaderProps {
  onSearchClick: () => void;
  onHelpClick: () => void;
  onPolicyClick: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onNewBeerClick: () => void;
  onNewBreweryClick: () => void;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onViewChange: (view: 'beers' | 'breweries') => void;
  isLoggedIn: boolean;
  view: View;
  beerCount: number;
  breweryCount: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearchClick, 
  onHelpClick, 
  onPolicyClick, 
  onLoginClick,
  onSignUpClick,
  onNewBeerClick,
  onNewBreweryClick,
  onLogoutClick,
  onProfileClick,
  onViewChange,
  isLoggedIn,
  view,
  beerCount,
  breweryCount
}) => {
  const navButtonStyle = "p-2 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center h-16 w-24"; // Increased width
  const activeNavButtonStyle = "bg-amber-500 text-amber-900";
  const inactiveNavButtonStyle = "bg-amber-800 text-amber-300 hover:bg-amber-700";

  return (
    <header className="bg-amber-900/90 text-white shadow-md sticky top-0 z-30 backdrop-blur-sm">
      <nav className="container mx-auto px-2 sm:px-6 py-3 flex justify-between items-center">
        {/* Left Side */}
        <div className="flex-1 flex justify-start">
           <h1 className="text-lg sm:text-xl font-bold tracking-wider text-amber-300">WiKiBeer & Brewery</h1>
        </div>

        {/* Center Navigation */}
        <div className="flex-1 flex justify-center items-center space-x-2 sm:space-x-4">
           <button onClick={() => onViewChange('beers')} className={`${navButtonStyle} ${view === 'beers' ? activeNavButtonStyle : inactiveNavButtonStyle}`} aria-label="Sezione Birre">
               <BeerIcon className="w-7 h-7" />
               <span className="text-xs font-semibold tracking-wider mt-1">BIRRE ({beerCount})</span>
           </button>
           <div className="h-8 w-px bg-amber-600"></div>
           <button onClick={() => onViewChange('breweries')} className={`${navButtonStyle} ${view === 'breweries' ? activeNavButtonStyle : inactiveNavButtonStyle}`} aria-label="Sezione Birrerie">
               <BreweryIcon className="w-7 h-7" />
               <span className="text-xs font-semibold tracking-wider mt-1">BIRRERIE ({breweryCount})</span>
           </button>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-end items-center space-x-1 sm:space-x-2">
          <button onClick={onSearchClick} className="p-2 rounded-full hover:bg-amber-700 transition-colors" aria-label="Cerca">
            <SearchIcon className="w-5 h-5" />
          </button>
          <button onClick={onPolicyClick} className="text-sm hidden md:block px-2 py-2 rounded-md hover:bg-amber-700 transition-colors">Policy</button>
          <button onClick={onHelpClick} className="p-2 rounded-full hover:bg-amber-700 transition-colors" aria-label="Aiuto">
            <HelpIcon className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-amber-600 hidden sm:block"></div>
          {isLoggedIn ? (
            <>
              <button onClick={onNewBeerClick} className="bg-amber-500 text-amber-900 font-bold px-3 py-2 text-sm rounded-md hover:bg-amber-400 transition-transform hover:scale-105 whitespace-nowrap">
                +<span className="hidden sm:inline">laTua </span>Birra
              </button>
               <button onClick={onNewBreweryClick} className="bg-amber-500 text-amber-900 font-bold px-3 py-2 text-sm rounded-md hover:bg-amber-400 transition-transform hover:scale-105 whitespace-nowrap">
                +<span className="hidden sm:inline">la Tua </span>Birreria
              </button>
              <button onClick={onProfileClick} className="p-2 rounded-full hover:bg-amber-700 transition-colors" aria-label="Profilo Utente">
                <UserIcon className="w-6 h-6" />
              </button>
              <button onClick={onLogoutClick} className="text-sm px-3 py-2 rounded-md hover:bg-amber-700 transition-colors">
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} className="text-sm px-3 py-2 rounded-md hover:bg-amber-700 transition-colors">
                LOGIN
              </button>
              <button onClick={onSignUpClick} className="bg-amber-500 text-amber-900 font-bold px-3 py-2 text-sm rounded-md hover:bg-amber-400 transition-transform hover:scale-105">
                SIGN UP
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default React.memo(Header);