import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const MENU_ITEMS = [
  { to: '/?tab=upcoming', label: 'Upcoming Events' },
  { to: '/?tab=past', label: 'Past Events' },
];

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentTab = new URLSearchParams(location.search).get('tab');
  const isActive = (to: string) =>
    location.pathname === '/' && to === `/?tab=${currentTab}`;

  // Close the menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
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

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 text-white"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-2 rounded shadow-lg py-1 z-50"
              style={{ backgroundColor: '#fff', border: '0.5px solid #e5e7eb', minWidth: '190px' }}
            >
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-xs font-medium transition-colors hover:bg-slate-50"
                  style={{ color: isActive(item.to) ? '#0e1f6b' : '#555', fontWeight: isActive(item.to) ? 700 : 400 }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
