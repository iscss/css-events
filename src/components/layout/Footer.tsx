import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t" style={{ borderColor: '#e5e7eb', backgroundColor: '#fff' }}>
      <div style={{ borderTop: '3px solid #f5d547' }} />
      <div className="mx-auto px-7 py-5 flex flex-col md:flex-row items-center justify-between gap-3" style={{ maxWidth: '1400px' }}>
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest" style={{ fontSize: '14px', color: '#0e1f6b' }}>ISCSS</span>
          <span style={{ color: '#e5e7eb' }}>|</span>
          <span style={{ fontSize: '11px', color: '#888' }}>International Society for Computational Social Science</span>
        </div>

        <nav className="flex items-center gap-5">
          <Link to="/events" style={{ fontSize: '11px', color: '#555' }} className="hover:text-slate-800">Events</Link>
          <a href="https://jobs.iscss.org" target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#555' }} className="hover:text-slate-800">CSS Jobs</a>
          <a href="https://iscss.org" target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#555' }} className="hover:text-slate-800">iscss.org</a>
        </nav>

        <p style={{ fontSize: '11px', color: '#aaa' }}>
          &copy; {new Date().getFullYear()} ISCSS. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
