import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
      <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-8">
        <CheckSquare className="text-white h-12 w-12" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Oops! The page you're looking for doesn't exist or has been moved to another universe.
      </p>
      <Link to="/">
        <Button variant="primary" className="flex items-center gap-2 px-8">
          <Home className="h-5 w-5" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
