import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex transition-colors">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <CheckSquare className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">TaskFlow</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
              Start your 14-day free trial
            </a>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <div className="mt-2 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="pimpass999@gmail.com"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-3 pl-10 pr-4 text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="password123"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-3 pl-10 pr-4 text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-600 dark:bg-slate-900"
              />
              <label htmlFor="remember-me" className="text-sm text-slate-600 dark:text-slate-400">
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full py-3 text-base" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white dark:bg-slate-950 px-6 text-slate-400 dark:text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">Google</span>
              </button>
              <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="text-sm font-semibold leading-6">GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:flex flex-1 bg-blue-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-lg">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <CheckSquare className="text-blue-600 h-10 w-10" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Master your workflow</h3>
            <p className="text-blue-100 text-lg mb-8">
              Join over 10,000 teams who use TaskFlow to organize their work and reach their goals faster.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-400"></div>
                ))}
              </div>
              <span className="text-sm font-medium text-blue-50">Trusted by top teams</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
