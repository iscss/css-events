import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePastConferences } from '@/hooks/useEvents';
import { format } from 'date-fns';

// Historical IC²S² records — shown when not yet in the DB.
// DB records for the same year always take precedence.
const HISTORICAL = [
  { year: 2025, title: '11th IC²S² — International Conference on Computational Social Science', location: 'Norrköping, Sweden', dates: 'July 21–24, 2025', url: 'https://2025.ic2s2.net' },
  { year: 2024, title: '10th IC²S² — International Conference on Computational Social Science', location: 'Philadelphia, USA', dates: 'July 17–20, 2024', url: 'https://2024.ic2s2.net' },
  { year: 2023, title: '9th IC²S² — International Conference on Computational Social Science', location: 'Copenhagen, Denmark', dates: 'July 17–20, 2023', url: 'https://ic2s2-2023.org' },
  { year: 2022, title: '8th IC²S² — International Conference on Computational Social Science', location: 'Chicago, USA', dates: 'July 19–22, 2022', url: 'https://2022.ic2s2.org' },
  { year: 2021, title: '7th IC²S² — International Conference on Computational Social Science', location: 'ETH Zürich (Virtual)', dates: 'July 27–31, 2021', url: 'https://ic2s2.ethz.ch' },
  { year: 2020, title: '6th IC²S² — International Conference on Computational Social Science', location: 'MIT (Virtual)', dates: 'July 17–19, 2020', url: 'https://2020.ic2s2.org' },
];

const PastEvents = () => {
  const { data: dbConferences, isLoading } = usePastConferences();

  // Years already covered by DB records
  const dbYears = new Set((dbConferences ?? []).map((c) => new Date(c.event_date).getFullYear()));

  // DB entries as display items
  const dbItems = (dbConferences ?? []).map((c) => {
    const year = new Date(c.event_date).getFullYear();
    const startFmt = format(new Date(c.event_date), 'MMMM d');
    const endFmt = c.end_date ? `–${format(new Date(c.end_date), 'd, yyyy')}` : `, ${year}`;
    return {
      key: c.id,
      year,
      title: c.title,
      location: c.location ?? '',
      dates: `${startFmt}${endFmt}`,
      url: c.event_external_url || c.registration_url || '',
    };
  });

  // Historical entries for years not in DB
  const historicalItems = HISTORICAL
    .filter((h) => !dbYears.has(h.year))
    .map((h) => ({ key: `hist-${h.year}`, ...h }));

  // Merged, sorted newest first
  const all = [...dbItems, ...historicalItems].sort((a, b) => b.year - a.year);

  return (
    <div className="page-wrapper bg-white">
      <Header />
      <main className="main-content">
        <div style={{ backgroundColor: '#0e1f6b', padding: '36px 0 28px' }}>
          <div className="mx-auto px-8" style={{ maxWidth: '860px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>About</p>
            <h1 className="font-bold text-white" style={{ fontSize: '28px' }}>Past Event Highlights</h1>
          </div>
        </div>
        <div style={{ height: '3px', backgroundColor: '#f5d547' }} />

        <div className="mx-auto px-8 py-12" style={{ maxWidth: '860px' }}>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8', marginBottom: '36px' }}>
            The International Conference on Computational Social Science (IC²S²) is the flagship annual event of ISCSS,
            bringing together researchers from sociology, economics, political science, computer science, and beyond.
            Below is the full conference history.
          </p>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse rounded" style={{ height: '56px', backgroundColor: '#f4f6fb' }} />
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {all.map((conf, i) => (
                <div
                  key={conf.key}
                  className="flex items-start gap-6 py-5"
                  style={{ borderBottom: i < all.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}
                >
                  <div className="flex-shrink-0 text-right" style={{ width: '52px' }}>
                    <span className="font-bold" style={{ fontSize: '22px', color: '#0e1f6b', lineHeight: 1 }}>{conf.year}</span>
                  </div>

                  <div className="flex-shrink-0 w-0.5 self-stretch mt-1" style={{ backgroundColor: '#00c4b4', minHeight: '40px' }} />

                  <div className="flex-1">
                    <p className="font-semibold" style={{ fontSize: '13px', color: '#0e1f6b', marginBottom: '2px' }}>{conf.title}</p>
                    {conf.location && (
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>{conf.location}</p>
                    )}
                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{conf.dates}</p>
                    {conf.url && (
                      <a href={conf.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '11px', color: '#00c4b4', fontWeight: 600 }}>
                        View conference →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-8" style={{ fontSize: '11px', color: '#bbb' }}>
            Earlier conferences (2015–2019) archives are available at{' '}
            <a href="https://iscss.org" target="_blank" rel="noopener noreferrer" style={{ color: '#00c4b4' }}>iscss.org</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PastEvents;
