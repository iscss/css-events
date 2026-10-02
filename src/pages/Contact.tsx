import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Contact = () => (
  <div className="page-wrapper bg-white">
    <Header />
    <main className="main-content">
      <div style={{ backgroundColor: '#0e1f6b', padding: '36px 0 28px' }}>
        <div className="mx-auto px-8" style={{ maxWidth: '860px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>About</p>
          <h1 className="font-bold text-white" style={{ fontSize: '28px' }}>Contact</h1>
        </div>
      </div>
      <div style={{ height: '3px', backgroundColor: '#f5d547' }} />

      <div className="mx-auto px-8 py-12" style={{ maxWidth: '860px' }}>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8', marginBottom: '40px' }}>
          Get in touch with the International Society for Computational Social Science.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* Address */}
          <div className="flex items-start gap-6 py-6" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
            <div style={{ width: '100px', flexShrink: 0 }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00c4b4' }}>Address</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.9' }}>
                Vermont Complex Systems Institute<br />
                University of Vermont<br />
                Burlington, Vermont, USA
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-6 py-6" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
            <div style={{ width: '100px', flexShrink: 0 }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00c4b4' }}>Email</p>
            </div>
            <div>
              <a href="mailto:IC2S2@uvm.edu" style={{ fontSize: '13px', color: '#0e1f6b', fontWeight: 600 }}>
                IC2S2@uvm.edu
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="flex items-start gap-6 py-6">
            <div style={{ width: '100px', flexShrink: 0 }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00c4b4' }}>Social</p>
            </div>
            <div>
              <a
                href="https://bsky.app/profile/iscss.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '13px', color: '#0e1f6b', fontWeight: 600 }}
              >
                Bluesky ↗
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Contact;
