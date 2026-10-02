import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ABOUT_ITEMS = [
  { to: '/about', label: 'About ISCSS' },
  { to: '/contact', label: 'Contact' },
  { to: '/past-events', label: 'Past Event Highlights' },
];

const Header = () => {
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useAdminCheck();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAboutActive = ABOUT_ITEMS.some((i) => location.pathname === i.to);
  const isActive = (path: string) => location.pathname === path;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: '#0e1f6b' }}>
      <div style={{ height: '3px', backgroundColor: '#f5d547' }} />
      <div className="container mx-auto px-6 flex items-center justify-between" style={{ height: '49px' }}>
        <Link to="/" className="font-bold tracking-widest text-white" style={{ fontSize: '15px' }}>
          ISCSS
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">

          <Link
            to="/"
            className="text-xs font-medium transition-colors hover:text-white"
            style={isActive('/')
              ? { color: '#fff', borderBottom: '2px solid #f5d547', paddingBottom: '2px' }
              : { color: 'rgba(255,255,255,0.8)' }}
          >
            Home
          </Link>

          {/* About dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setAboutOpen((o) => !o)}
              className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-white"
              style={isAboutActive
                ? { color: '#fff', borderBottom: '2px solid #f5d547', paddingBottom: '2px' }
                : { color: 'rgba(255,255,255,0.8)' }}
            >
              About
              <ChevronDown className="w-3 h-3" style={{ transform: aboutOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {aboutOpen && (
              <div
                className="absolute left-0 top-full mt-2 rounded shadow-lg py-1 z-50"
                style={{ backgroundColor: '#fff', border: '0.5px solid #e5e7eb', minWidth: '190px' }}
              >
                {ABOUT_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setAboutOpen(false)}
                    className="block px-4 py-2 text-xs font-medium transition-colors hover:bg-slate-50"
                    style={{ color: isActive(item.to) ? '#0e1f6b' : '#555', fontWeight: isActive(item.to) ? 700 : 400 }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/events"
            className="text-xs font-medium transition-colors hover:text-white"
            style={isActive('/events')
              ? { color: '#fff', borderBottom: '2px solid #f5d547', paddingBottom: '2px' }
              : { color: 'rgba(255,255,255,0.8)' }}
          >
            Events
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="text-xs font-medium transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user && (
            <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-300 hover:text-white hover:bg-white/10">
              Sign Out
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-1" style={{ backgroundColor: '#0e1f6b' }}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm py-2 pl-3"
            style={{ color: isActive('/') ? '#fff' : 'rgba(255,255,255,0.7)', borderLeft: isActive('/') ? '2px solid #f5d547' : '2px solid transparent' }}
          >
            Home
          </Link>
          {ABOUT_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm py-2 pl-3"
              style={{ color: isActive(item.to) ? '#fff' : 'rgba(255,255,255,0.7)', borderLeft: isActive(item.to) ? '2px solid #f5d547' : '2px solid transparent' }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm py-2 pl-3 mt-1"
            style={{ color: isActive('/events') ? '#fff' : 'rgba(255,255,255,0.7)', borderLeft: isActive('/events') ? '2px solid #f5d547' : '2px solid transparent' }}
          >
            Events
          </Link>
          {user && (
            <div className="pt-2 border-t border-white/10 mt-2">
              <Button variant="ghost" size="sm" className="w-full text-slate-300 hover:text-white"
                onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                Sign Out
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
