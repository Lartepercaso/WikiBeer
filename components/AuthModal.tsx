
import React, { useState } from 'react';
import Modal from './Modal';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, onSignUp }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Per favore, inserisci email e password.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    try {
      if (isLoginView) {
        await onLogin(email, password);
      } else {
        await onSignUp(email, password);
      }
      // On success, the parent component will close the modal
    } catch (err: any) {
        setError(err.message || 'Si è verificato un errore.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isLoginView ? 'Login' : 'Registrati'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            required
            minLength={6}
            disabled={isSubmitting}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-400">
          {isSubmitting ? 'Attendere...' : (isLoginView ? 'Accedi' : 'Registrati')}
        </button>
        <p className="text-sm text-center">
          {isLoginView ? "Non hai un account? " : "Hai già un account? "}
          <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-amber-600 hover:text-amber-500" disabled={isSubmitting}>
            {isLoginView ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default AuthModal;