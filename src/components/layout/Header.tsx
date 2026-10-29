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
      <div className="px-8 flex items-center justify-between" style={{ height: '64px' }}>
        <Link to="/" className="flex items-baseline gap-3">
          <span className="font-bold tracking-widest text-white" style={{ fontSize: '22px' }}>ISCSS</span>
          <span className="font-medium text-white/80" style={{ fontSize: '16px' }}>Events</span>
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 -mr-2 text-white"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-2 rounded shadow-lg py-1 z-50"
              style={{ backgroundColor: '#fff', border: '0.5px solid #e5e7eb', minWidth: '220px' }}
            >
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-5 py-3 text-base font-medium transition-colors hover:bg-slate-50"
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
