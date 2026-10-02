import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const About = () => (
  <div className="page-wrapper bg-white">
    <Header />
    <main className="main-content">
      <div style={{ backgroundColor: '#0e1f6b', padding: '40px 0 32px' }}>
        <div className="mx-auto px-8" style={{ maxWidth: '1100px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>About</p>
          <h1 className="font-bold text-white" style={{ fontSize: '32px', fontFamily: 'Open Sans, sans-serif' }}>About ISCSS</h1>
        </div>
      </div>
      <div style={{ height: '4px', backgroundColor: '#f5d547' }} />

      <div className="mx-auto px-8 py-14" style={{ maxWidth: '1100px' }}>

        {/* Mission */}
        <section className="mb-14">
          <h2 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00c4b4', borderLeft: '3px solid #00c4b4', paddingLeft: '10px', marginBottom: '20px' }}>
            Mission
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.85', marginBottom: '16px' }}>
            The International Society for Computational Social Science (ISCSS) is committed to advancing path-breaking research at the intersection of the computational, experimental, social, and behavioral sciences. Comprised of multidisciplinary researchers from around the globe, the Society's main purpose is to organize and manage the annual International Conference on Computational Social Science (IC²S²).
          </p>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.85', marginBottom: '16px' }}>
            Beyond this mission, ISCSS plans to expand to oversee:
          </p>
          <ul style={{ paddingLeft: '0', listStyle: 'none' }} className="space-y-2">
            {[
              'Dissemination of research results and advances in the field of CSS',
              'Maintenance of a dedicated website and mailing list for publicizing academic advances',
              'Publication of journal(s) and/or preprint archive for CSS research',
              'Development and dissemination of a CSS teaching curriculum',
              'Engagement in charitable activities',
              'Partnership with other organizations interested in supporting work in the field of CSS',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3" style={{ fontSize: '15px', color: '#444', lineHeight: '1.7' }}>
                <span className="flex-shrink-0" style={{ marginTop: '9px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00c4b4', display: 'inline-block' }} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <hr style={{ borderColor: '#e5e7eb', marginBottom: '48px' }} />

        {/* History */}
        <section>
          <h2 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00c4b4', borderLeft: '3px solid #00c4b4', paddingLeft: '10px', marginBottom: '20px' }}>
            History
          </h2>
          <div style={{ fontSize: '15px', color: '#333', lineHeight: '1.85' }} className="space-y-5">
            <p>
              In the mid-2000s, a new field at the intersection of the computational and social sciences began to take shape, driven by the explosive growth of digital platforms and the data they generated. In 2009, an influential paper published in <em>Science</em> gave a name to this emerging field: Computational Social Science. Shortly thereafter, researchers from across disciplines began to refer to themselves as computational social scientists.
            </p>
            <p>
              In 2015, a group of these researchers organized the first in a series of annual meetings which would come to be known as the International Conference on Computational Social Science (IC²S²). A diverse group of researchers convened in Helsinki to discuss topics at the forefront of CSS, developing the program for conferences to come.
            </p>
            <p>
              The ISCSS articles of incorporation were submitted on July 9th, 2021, with the aim of overseeing these conferences. The Society fosters cooperation amongst organizers and establishes institutional guardrails and processes. In the future, the Society aims to serve as a source of support and leadership for the broader CSS community.
            </p>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
