import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BeerPost, BreweryPost, Comment, Rating } from './types';
import { supabase } from './services/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { MOCK_BEERS, MOCK_BREWERIES } from './mockData';

import Header from './components/Header';
import BeerCard from './components/BeerCard';
import BreweryCard from './components/BreweryCard';
import DetailsModal from './components/DetailsModal';
import BreweryDetailsModal from './components/BreweryDetailsModal';
import Modal from './components/Modal';
import NewPostModal from './components/NewPostModal';
import NewBreweryModal from './components/NewBreweryModal';
import SearchBar from './components/SearchBar';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import MapComponent from './components/MapComponent';
import UserProfileModal from './components/UserProfileModal';

type View = 'beers' | 'breweries';
type Notification = { message: string; type: 'success' | 'error' };

const ADMIN_EMAIL = 'admin@wikibeer.com';

const App: React.FC = () => {
    const [beers, setBeers] = useState<BeerPost[]>([]);
    const [breweries, setBreweries] = useState<BreweryPost[]>([]);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [view, setView] = useState<View>('beers');
    const [hasEntered, setHasEntered] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Modal States
    const [selectedBeer, setSelectedBeer] = useState<BeerPost | null>(null);
    const [selectedBrewery, setSelectedBrewery] = useState<BreweryPost | null>(null);
    const [isNewBeerModalOpen, setIsNewBeerModalOpen] = useState(false);
    const [isNewBreweryModalOpen, setIsNewBreweryModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isGuestWelcomeOpen, setIsGuestWelcomeOpen] = useState(false);
    const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
    
    // Search and Filter States
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});
    
    // Share Popover State
    const [sharePopover, setSharePopover] = useState<{ visible: boolean; x: number; y: number; post: BeerPost | BreweryPost | null }>({ visible: false, x: 0, y: 0, post: null });
    
    // Notification State
    const [notification, setNotification] = useState<Notification | null>(null);

    // Map state
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    const isAdmin = useMemo(() => user?.email === ADMIN_EMAIL, [user]);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // --- AUTH & DATA FETCHING ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const { data: beersData, error: beersError } = await supabase.from('beers').select('*, ratings(*), comments(*)');
                if (beersError) throw beersError;
                
                if (beersData && beersData.length > 0) {
                    setBeers(beersData as any);
                } else {
                    console.log("Nessuna birra trovata nel database, carico i dati di test.");
                    setBeers(MOCK_BEERS);
                }

                const { data: breweriesData, error: breweriesError } = await supabase.from('breweries').select('*, ratings(*), comments(*)');
                if (breweriesError) throw breweriesError;

                if (breweriesData && breweriesData.length > 0) {
                    setBreweries(breweriesData as any);
                } else {
                    console.log("Nessuna birreria trovata nel database, carico i dati di test.");
                    setBreweries(MOCK_BREWERIES);
                }

            } catch (error: any) {
                console.error('Error fetching initial data:', error.message);
                showNotification("Errore nel caricamento dei dati, carico i dati di test.", "error");
                setBeers(MOCK_BEERS);
                setBreweries(MOCK_BREWERIES);
            } finally {
                setLoading(false);
            }
        };


        fetchInitialData();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

     useEffect(() => {
        if (view === 'breweries' && !userLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
                (error) => {
                    console.error("Error getting user location", error);
                    showNotification("Impossibile ottenere la tua posizione.", "error");
                }
            );
        }
    }, [view, userLocation]);

    // --- HANDLERS ---
    const handleLogin = useCallback(async (email: string, password: string): Promise<void> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            showNotification(error.message, 'error');
        } else {
            setUser(data.user); // Explicitly set user state immediately
            showNotification('Login effettuato con successo!');
            setIsAuthModalOpen(false);
        }
    }, []);

    const handleSignUp = useCallback(async (email: string, password: string): Promise<void> => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            showNotification(error.message, 'error');
        } else {
            setUser(data.user); // Set user state immediately (might be null until confirmation)
            showNotification('Registrazione completata! Controlla la tua email per la conferma.', 'success');
            setIsAuthModalOpen(false);
        }
    }, []);

    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsUserProfileModalOpen(false);
        showNotification('Logout effettuato.', 'success');
    }, []);

    const handleAddBeer = useCallback(async (postData: Omit<BeerPost, 'id' | 'ratings' | 'comments' | 'created_at' | 'user_id'>, imageFile: File | null) => {
        if (!user || !imageFile) {
            showNotification("Devi essere loggato per aggiungere una birra.", "error");
            return;
        }

        const filePath = `${user.id}/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('posts-images').upload(filePath, imageFile);
        if (uploadError) return showNotification(`Upload fallito: ${uploadError.message}`, 'error');

        const { data: { publicUrl } } = supabase.storage.from('posts-images').getPublicUrl(filePath);
        
        const newPostPayload = { ...postData, imageUrl: publicUrl, user_id: user.id };
        const { data: insertedPost, error: insertError } = await supabase.from('beers').insert(newPostPayload).select().single();
        
        if (insertError || !insertedPost) {
          return showNotification(`Errore nell'inserimento della birra: ${insertError?.message || 'Nessun dato restituito dal database. Controlla i permessi (RLS).'}`, 'error');
        }
        
        const newCompletePost: BeerPost = {
            ...insertedPost,
            ratings: [],
            comments: []
        };

        setBeers(currentBeers => [newCompletePost, ...currentBeers]);
        setIsNewBeerModalOpen(false);
        showNotification('Nuova birra aggiunta!', 'success');
    }, [user]);
    
    const handleAddBrewery = useCallback(async (breweryData: Omit<BreweryPost, 'id' | 'ratings' | 'comments' | 'created_at' | 'user_id' | 'lat' | 'lng'>, imageFile: File) => {
        if (!user || !imageFile) {
            showNotification("Devi essere loggato per aggiungere una birreria.", "error");
            return;
        }

        const filePath = `${user.id}/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('posts-images').upload(filePath, imageFile);
        if (uploadError) return showNotification(`Upload fallito: ${uploadError.message}`, 'error');
        
        const { data: { publicUrl } } = supabase.storage.from('posts-images').getPublicUrl(filePath);
        
        const newBreweryPayload = { 
            ...breweryData, 
            imageUrl: publicUrl, 
            user_id: user.id,
            lat: 41.902782 + (Math.random() - 0.5) * 0.2, // Placeholder coordinates
            lng: 12.496366 + (Math.random() - 0.5) * 0.2,
        };
        const { data: insertedBrewery, error: insertError } = await supabase.from('breweries').insert(newBreweryPayload).select().single();

        if (insertError || !insertedBrewery) {
           return showNotification(`Errore nell'inserimento della birreria: ${insertError?.message || 'Nessun dato restituito dal database. Controlla i permessi (RLS).'}`, 'error');
        }

        const newCompleteBrewery: BreweryPost = {
            ...insertedBrewery,
            ratings: [],
            comments: []
        };
        
        setBreweries(currentBreweries => [newCompleteBrewery, ...currentBreweries]);
        setIsNewBreweryModalOpen(false);
        showNotification('Nuova birreria aggiunta!', 'success');
    }, [user]);

    const handleAddComment = useCallback(async (postId: number, commentText: string, targetView: 'beers' | 'breweries') => {
        if (!user) return;
        const newComment = { post_id: postId, user_id: user.id, user_email: user.email, text: commentText, table_name: targetView };
        const { data: insertedComment, error } = await supabase.from('comments').insert(newComment).select().single();
        if (error) return showNotification(`Errore: ${error.message}`, 'error');

        const stateUpdater = targetView === 'beers' ? setBeers : setBreweries;
        stateUpdater(prev => prev.map(p => p.id === postId ? { ...p, comments: [insertedComment as any, ...p.comments] } : p));
        if (targetView === 'beers') setSelectedBeer(prev => prev && { ...prev, comments: [insertedComment as any, ...prev.comments] });
        else setSelectedBrewery(prev => prev && { ...prev, comments: [insertedComment as any, ...prev.comments] });
    }, [user]);

    const handleRate = useCallback(async (postId: number, ratingValue: number, targetView: 'beers' | 'breweries') => {
        if (!user) return;
        
        const { error } = await supabase.from('ratings').upsert(
            { post_id: postId, user_id: user.id, value: ratingValue, table_name: targetView },
            { onConflict: 'post_id, user_id, table_name' }
        ).select();

        if (error) return showNotification(`Errore: ${error.message}`, 'error');

        const newRating: Rating = { user_id: user.id, value: ratingValue };

        const updateItemState = (item: BeerPost | BreweryPost) => {
            if (item.id === postId) {
                const otherRatings = item.ratings.filter(r => r.user_id !== user.id);
                return { ...item, ratings: [...otherRatings, newRating] };
            }
            return item;
        };

        if (targetView === 'beers') {
            setBeers(prev => prev.map(p => updateItemState(p) as BeerPost));
            setSelectedBeer(prev => prev ? updateItemState(prev) as BeerPost : null);
        } else {
            setBreweries(prev => prev.map(p => updateItemState(p) as BreweryPost));
            setSelectedBrewery(prev => prev ? updateItemState(prev) as BreweryPost : null);
        }
    }, [user]);
    
    const handleDeletePost = useCallback(async (postId: number, postView: 'beers' | 'breweries', imageUrl: string) => {
        // Find the post to check ownership
        const post = postView === 'beers' ? beers.find(b => b.id === postId) : breweries.find(b => b.id === postId);
        
        if (!user || (!isAdmin && user.id !== post?.user_id)) {
            showNotification("Non hai i permessi per eliminare questo post.", "error");
            return;
        }

        // 1. Delete Image from Storage
        try {
            const urlParts = imageUrl.split('/');
            const filePath = urlParts.slice(urlParts.indexOf('posts-images') + 1).join('/');
            
            if (filePath) {
                const { error: storageError } = await supabase.storage.from('posts-images').remove([filePath]);
                if (storageError) {
                    // Log error but proceed to delete DB record, as it might be an old/invalid link
                    console.error("Could not delete image, maybe it was already removed:", storageError.message);
                }
            }
        } catch (e) {
            console.error("Error parsing image URL for deletion:", e);
        }

        // 2. Delete Post from Database
        const { error: dbError } = await supabase.from(postView).delete().match({ id: postId });
        if (dbError) {
            return showNotification(`Errore durante l'eliminazione: ${dbError.message}`, 'error');
        }

        // 3. Update local state
        if (postView === 'beers') {
            setBeers(current => current.filter(p => p.id !== postId));
            setSelectedBeer(null);
        } else {
            setBreweries(current => current.filter(p => p.id !== postId));
            setSelectedBrewery(null);
        }
        
        setIsUserProfileModalOpen(false);
        showNotification('Post eliminato con successo.', 'success');
    }, [user, isAdmin, beers, breweries]);

    const handleShareClick = (post: BeerPost | BreweryPost, event: React.MouseEvent) => {
        event.stopPropagation();
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setSharePopover({ visible: true, x: rect.left, y: rect.bottom + window.scrollY, post: post });
    };

    // Fix: Changed String(...) to .toString() to allow TypeScript to correctly infer the type as a string before calling .toLowerCase(). This resolves the error where 'toLowerCase' was called on an 'unknown' type.
    const filteredBeers = useMemo(() => beers.filter(beer => Object.entries(filters).every(([key, value]) => value ? (beer[key as keyof BeerPost] ?? '').toString().toLowerCase().includes(value.toLowerCase()) : true)), [beers, filters]);
    // Fix: Changed String(...) to .toString() to allow TypeScript to correctly infer the type as a string before calling .toLowerCase(). This resolves the error where 'toLowerCase' was called on an 'unknown' type.
    const filteredBreweries = useMemo(() => breweries.filter(brewery => Object.entries(filters).every(([key, value]) => value ? (brewery[key as keyof BreweryPost] ?? '').toString().toLowerCase().includes(value.toLowerCase()) : true)), [breweries, filters]);
    
    const searchFields = view === 'beers'
        ? [{ name: 'name', placeholder: 'Nome Birra' }, { name: 'brewery', placeholder: 'Birrificio' }, { name: 'nation', placeholder: 'Nazione' }, { name: 'type', placeholder: 'Tipo' }]
        : [{ name: 'name', placeholder: 'Nome Birreria' }, { name: 'city', placeholder: 'Città' }, { name: 'nation', placeholder: 'Nazione' }];

    const SharePopover = () => {
        if (!sharePopover.visible || !sharePopover.post) return null;
        const url = window.location.href;
        const text = `Dai un'occhiata a ${sharePopover.post.name} su WiKiBeer & Brewery!`;
        return (
            <div className="fixed bg-white rounded-lg shadow-xl border z-50 p-2 space-y-1 text-sm animate-fade-in-fast" style={{ left: `${sharePopover.x}px`, top: `${sharePopover.y}px`}}>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="block px-3 py-1 hover:bg-gray-100 rounded">Facebook</a>
                <a href={`https://wa.me/?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="block px-3 py-1 hover:bg-gray-100 rounded">WhatsApp</a>
                <a href={`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`} className="block px-3 py-1 hover:bg-gray-100 rounded">Email</a>
                <button onClick={() => { navigator.clipboard.writeText(url); setSharePopover({ ...sharePopover, visible: false }); showNotification('Link copiato!', 'success'); }} className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded">Copia Link</button>
            </div>
        );
    };

    if (!hasEntered) {
        return <LandingPage onEnter={() => { setHasEntered(true); setIsGuestWelcomeOpen(true); }} onLoginClick={() => { setHasEntered(true); setIsAuthModalOpen(true); }} />;
    }

    return (
        <div className="bg-amber-50 min-h-screen" onClick={() => sharePopover.visible && setSharePopover({ ...sharePopover, visible: false })}>
            <Header
                onSearchClick={() => setIsSearchOpen(!isSearchOpen)}
                onHelpClick={() => setIsHelpModalOpen(true)}
                onPolicyClick={() => setIsPolicyModalOpen(true)}
                onLoginClick={() => setIsAuthModalOpen(true)}
                onSignUpClick={() => setIsAuthModalOpen(true)}
                onNewBeerClick={() => user ? setIsNewBeerModalOpen(true) : setIsAuthModalOpen(true)}
                onNewBreweryClick={() => user ? setIsNewBreweryModalOpen(true) : setIsAuthModalOpen(true)}
                onLogoutClick={handleLogout}
                onProfileClick={() => setIsUserProfileModalOpen(true)}
                onViewChange={setView}
                isLoggedIn={!!user}
                view={view}
                beerCount={beers.length}
                breweryCount={breweries.length}
            />

            {notification && (
                <div className={`fixed top-24 right-4 z-[100] p-4 rounded-md shadow-lg text-white transition-transform transform animate-fade-in-down ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {notification.message}
                </div>
            )}
            
            <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearch={setFilters} fields={searchFields} />
            
            <main className="container mx-auto p-4 sm:p-6">
                 {loading ? (
                    <div className="flex justify-center items-center h-64">
                         <div className="w-16 h-16 border-4 border-t-transparent border-amber-800 rounded-full animate-spin"></div>
                    </div>
                 ) : (
                    <>
                        {view === 'breweries' && <MapComponent userLocation={userLocation} breweries={filteredBreweries} />}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                            {view === 'beers' ? (
                                filteredBeers.map(post => <BeerCard key={post.id} post={post} user={user} isAdmin={isAdmin} onDetailsClick={setSelectedBeer} onShareClick={handleShareClick} onDelete={handleDeletePost} />)
                            ) : (
                                filteredBreweries.map(post => <BreweryCard key={post.id} post={post} user={user} isAdmin={isAdmin} onDetailsClick={setSelectedBrewery} onShareClick={handleShareClick} onDelete={handleDeletePost} />)
                            )}
                        </div>
                    </>
                 )}
            </main>
            
            <SharePopover />
            
            <DetailsModal post={selectedBeer} user={user} isAdmin={isAdmin} onClose={() => setSelectedBeer(null)} onAddComment={(id, text) => handleAddComment(id, text, 'beers')} onRate={(id, val) => handleRate(id, val, 'beers')} onShareClick={handleShareClick} onDelete={handleDeletePost} />
            <BreweryDetailsModal post={selectedBrewery} user={user} isAdmin={isAdmin} onClose={() => setSelectedBrewery(null)} onAddComment={(id, text) => handleAddComment(id, text, 'breweries')} onRate={(id, val) => handleRate(id, val, 'breweries')} onShareClick={handleShareClick} onDelete={handleDeletePost} />
            
            {isNewBeerModalOpen && <Modal isOpen={isNewBeerModalOpen} onClose={() => setIsNewBeerModalOpen(false)} title="Aggiungi una nuova birra"><NewPostModal onClose={() => setIsNewBeerModalOpen(false)} onAddPost={handleAddBeer} /></Modal>}
            {isNewBreweryModalOpen && <Modal isOpen={isNewBreweryModalOpen} onClose={() => setIsNewBreweryModalOpen(false)} title="Aggiungi una nuova birreria"><NewBreweryModal onClose={() => setIsNewBreweryModalOpen(false)} onAddBrewery={handleAddBrewery} /></Modal>}
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} onSignUp={handleSignUp} />}
            {isHelpModalOpen && <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title="Aiuto"><p>Benvenuto in WiKiBeer & Brewery! Qui puoi trovare e recensire birre e birrerie. Usa la ricerca per filtrare i risultati. Fai il login per aggiungere nuovi post, commentare e votare.</p></Modal>}
            {isPolicyModalOpen && <Modal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} title="Policy"><p>La nostra policy è semplice: rispetta gli altri utenti, non inserire contenuti inappropriati e bevi responsabilmente. Tutte le informazioni inserite sono condivise con la community.</p></Modal>}
            {isUserProfileModalOpen && user && <UserProfileModal 
                user={user}
                userBeers={beers.filter(b => b.user_id === user.id)}
                userBreweries={breweries.filter(b => b.user_id === user.id)}
                onClose={() => setIsUserProfileModalOpen(false)}
                onLogout={handleLogout}
                onDeletePost={handleDeletePost}
            />}
            {isGuestWelcomeOpen && (
                <Modal isOpen={isGuestWelcomeOpen} onClose={() => setIsGuestWelcomeOpen(false)} title="Benvenuto Ospite!">
                    <div className="text-center space-y-4">
                        <p>In qualità di ospite potrai utilizzare la piattaforma in maniera limitata senza poter lasciare commenti e valutazioni.</p>
                        <p className="font-semibold">Iscriviti gratuitamente e sfrutta appieno l'esperienza.</p>
                        <p className="text-sm text-amber-800 font-bold">Bevi responsabilmente!</p>
                        <button onClick={() => setIsGuestWelcomeOpen(false)} className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition">Ho capito</button>
                    </div>
                </Modal>
            )}

             <style>{`
                @keyframes fade-in-fast { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-fast { animation: fade-in-fast 0.1s ease-out forwards; }
                @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default App;