
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="landingBody">
      <Navbar />

      <main>
        <section className="heroSection" style={{ padding: '8rem 2rem', position: 'relative', zIndex: 1 }}>
          <div className="badgeHeader">⚡ Intelligent Compliance</div>
          <h1 className="mainHeadline" style={{ color: '#1e293b', fontSize: 'clamp(3.5rem, 8vw, 5rem)', letterSpacing: '-0.02em' }}>
            HR Compliance <br />
            <span style={{ color: 'var(--glaido-primary)', background: 'linear-gradient(135deg, #D8B4FE 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Simplified.</span>
          </h1>
          <p className="subHeadline" style={{ color: '#475569', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            The instant-access hub for I-9 reporting, Visa statuses, and work authorization rules.
            Real-time guidance from the M-274 handbook at your fingertips.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link href="/hub" className="buttonPrimary">
              Explore the Hub
            </Link>
            <Link href="/hub/sop" style={{
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #e2e8f0',
              color: '#1e293b',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              View SOPs
            </Link>
          </div>
        </section>

        <section className="gridSection">
          <h2 className="sectionHeadline" style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', color: '#1e293b', fontWeight: '800' }}>
            The Modern Tool for Compliance Teams
          </h2>

          <div className="cardGrid">
            {/* Interactive Scenarios -> Playbook */}
            <Link href="/hub/playbook" className="glowCard" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>🎯</div>
              <h3>Interactive Scenarios</h3>
              <p>Use our new I-9 Builder to determine acceptable documents for List A, B, and C based on employee status.</p>
            </Link>

            {/* SOPs -> SOP Page */}
            <Link href="/hub/sop" className="glowCard" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>📋</div>
              <h3>M-274 SOPs</h3>
              <p>Standardized procedures for Section 3 reverification and the Receipt Rule. Direct links to official USCIS sources.</p>
            </Link>

            {/* Always Audit Ready -> Hub Main */}
            <Link href="/hub" className="glowCard" style={{ gridColumn: '1 / -1', maxWidth: '800px', margin: '0 auto', textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>🛡️</div>
              <h3>Always Audit-Ready</h3>
              <p>Verified extension policies for EAD codes like C08, C09, and C26. Stay ahead of regulatory changes effortlessly.</p>
            </Link>
          </div>
        </section>

        <section style={{
          padding: '8rem 2rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '2rem', color: '#1e293b' }}>
            Ready to streamline your I-9 workflow?
          </h2>
          <Link href="/hub" className="buttonPrimary" style={{ fontSize: '1.25rem', padding: '1.25rem 3rem' }}>
            Start Exploring Now
          </Link>
          {/* Removed 500+ text as requested */}
        </section>
      </main>

      <footer style={{
        padding: '4rem',
        borderTop: '1px solid rgba(255,255,255,0.5)',
        color: '#64748b',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ fontWeight: '600' }}>© 2026 HR Hub. Professional Edition.</div>
        <div style={{ display: 'flex', gap: '2.5rem' }}>
          <a href="https://www.uscis.gov/i-9" target="_blank" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }} className="footerLink">Official Form I-9</a>
          <a href="https://i94.cbp.dhs.gov/" target="_blank" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }} className="footerLink">I-94 Website</a>
        </div>
      </footer>
    </div>
  );
}
