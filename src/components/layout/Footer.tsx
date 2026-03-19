import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Calendar className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700">CSS Events</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/events" className="text-sm text-slate-500 hover:text-slate-700">Events</Link>
            <a href="https://jobs.iscss.org" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-700">CSS Jobs</a>
          </nav>

          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} CSS Events. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
