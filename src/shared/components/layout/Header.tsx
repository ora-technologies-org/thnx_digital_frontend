import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, LogOut } from 'lucide-react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Thnx Digital</span>
          </Link>

          {/* Nav */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'MERCHANT' && (
                  <Link to="/merchant/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                )}
                <span className="text-sm text-gray-600">{user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/browse">
                  <Button variant="ghost" size="sm">Browse</Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};