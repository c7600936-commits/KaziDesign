
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.DESIGNER);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === UserRole.DESIGNER) {
      // Basic verification: designer must have a company email
      if (!email.toLowerCase().endsWith('@kazidesign.com') && !email.toLowerCase().endsWith('@admin.com')) {
        setError('Designers must use a verified @kazidesign.com email.');
        return;
      }
    }

    if (!email || !name) {
      setError('Please fill in all fields.');
      return;
    }

    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-amber-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
            <i className="fas fa-drafting-pencil"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">KaziDesign</h2>
          <p className="mt-2 text-sm text-gray-500">Professional Interior Design Workflow</p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
          <button
            onClick={() => setRole(UserRole.DESIGNER)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              role === UserRole.DESIGNER ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Designer / Pro
          </button>
          <button
            onClick={() => setRole(UserRole.CLIENT)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              role === UserRole.CLIENT ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Client Access
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder={role === UserRole.DESIGNER ? "name@kazidesign.com" : "your@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {role === UserRole.DESIGNER && (
                <p className="mt-1 text-[10px] text-gray-400 font-medium italic">
                  * Designers require verified company credentials.
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all shadow-lg shadow-amber-600/20"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <i className="fas fa-lock text-amber-500 group-hover:text-amber-400"></i>
            </span>
            Sign in to Workspace
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            Secure workspace for Kenya's leading interior designers and their valued clients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
