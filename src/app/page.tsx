import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./landing.css";

/* ── Inline SVG icons (no external library needed) ── */

function IconScenario() {
  return (
    <svg className="feature-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="5" y="7" width="30" height="26" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="15" x2="28" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="25" x2="21" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="28" cy="28" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M25.5 28l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg className="feature-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 30V10a2 2 0 0 1 2-2h13l9 9v13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M23 8v9h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="14" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="27" x2="22" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg className="feature-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="5"  y="5"  width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="22" y="5"  width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5"  y="22" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="22" y="22" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Data ── */

const statusRows = [
  { label: "I-9 VERIFICATION ENGINE",    status: "ACTIVE",   variant: "ok"  },
  { label: "EAD AUTO-EXTENSION (C-CLASS)", status: "RUNNING", variant: "ok"  },
  { label: "VISA CLASSIFICATION DB",     status: "SYNCED",   variant: "ok"  },
  { label: "M-274 HANDBOOK INDEX",       status: "INDEXED",  variant: "ok"  },
  { label: "REMOTE VERIFY PROTOCOL",     status: "READY",    variant: "ok"  },
];

const marqueeItems = [
  "I-9 Section 2 Completion",
  "EAD C09 Auto-Extension",
  "H-1B Cap-Subject Petition",
  "Remote I-9 Verification",
  "OPT STEM Extension (24mo)",
  "Section 3 Reverification",
  "M-274 Receipt Rule",
  "I-94 Admission Records",
  "TN Status Mexico/Canada",
  "F-1 CPT Authorization",
  "O-1A Extraordinary Ability",
  "L-1B Specialized Knowledge",
  "EB-2 National Interest Waiver",
  "Form I-765 Processing",
  "EAD 540-Day Auto-Extension",
];

export default function LandingPage() {
  return (
    <div className="landingBody">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-section">
        {/* LEFT — Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" aria-hidden="true" />
            Compliance Infrastructure
          </div>

          <h1 className="hero-h1">
            I-9 Verification.<br />
            <span className="accent-text">Made Precise.</span>
          </h1>

          <p className="hero-body">
            The command center for work authorization compliance. I-9 reporting,
            Visa tracking, and EAD management — verified against official USCIS
            sources in real time.
          </p>

          <div className="hero-actions">
            <Link href="/hub" className="btn-primary">
              Open Command Center
            </Link>
            <Link href="/hub/sop" className="btn-ghost">
              Browse SOPs →
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">247</span>
              <span className="stat-label">Visa Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">M-274</span>
              <span className="stat-label">Handbook Indexed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Live</span>
              <span className="stat-label">USCIS Updates</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Terminal panel */}
        <div className="hero-terminal" role="img" aria-label="System status panel">
          <div className="terminal-header">
            <span className="terminal-title">SYS.STATUS</span>
            <div className="status-indicator">
              <span className="status-dot-ok" aria-hidden="true" />
              ONLINE
            </div>
          </div>

          <div className="terminal-rows">
            {statusRows.map((row) => (
              <div className="terminal-row" key={row.label}>
                <span className="terminal-row-label">{row.label}</span>
                <span className={`terminal-status ${row.variant}`}>
                  <span className="terminal-status-dot" aria-hidden="true" />
                  {row.status}
                </span>
              </div>
            ))}
          </div>

          <div className="terminal-progress">
            <div className="progress-label">
              <span className="progress-label-text">COMPLIANCE SCORE</span>
              <span className="progress-label-score">94 / 100</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ "--target": "94%" } as React.CSSProperties}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="terminal-footer">
            <span className="terminal-footer-text">
              2026-06-16 · 14:23:07 UTC · AUTO-REFRESH
            </span>
            <span className="terminal-cursor" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span className="marquee-tag" key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="features-header">
          <h2>Built for compliance teams.</h2>
          <p>Every tool you need, structured around how you actually work.</p>
        </div>

        <div className="features-grid">
          {/* Main card — I-9 Scenario Builder */}
          <Link href="/hub/playbook" className="feature-main">
            <div>
              <IconScenario />
            </div>
            <div>
              <div className="feature-label">Interactive Tool</div>
              <div className="feature-title">I-9 Scenario Builder</div>
            </div>
            <p className="feature-desc">
              Determine acceptable documents for List A, B, and C based on
              employee work authorization status. Built on the M-274 handbook
              decision tree — no guesswork, no ambiguity.
            </p>
            <div className="feature-arrow">
              Open Scenario Builder <span>→</span>
            </div>
          </Link>

          {/* Card 2 — SOPs */}
          <Link href="/hub/sop" className="feature-card">
            <IconBook />
            <div>
              <div className="feature-label">Reference Library</div>
              <div className="feature-title">M-274 SOP Guides</div>
            </div>
            <p className="feature-desc">
              Standardized procedures for Section 3 reverification, the Receipt
              Rule, and EAD extension policies. Direct links to official USCIS sources.
            </p>
            <div className="feature-arrow">
              View SOPs <span>→</span>
            </div>
          </Link>

          {/* Card 3 — Directory */}
          <Link href="/hub/directory" className="feature-card">
            <IconGrid />
            <div>
              <div className="feature-label">Database</div>
              <div className="feature-title">Compliance Directory</div>
            </div>
            <p className="feature-desc">
              Verified EAD codes, Visa statuses, and Immigrant categories — all
              with extension policies, notes, and cross-references.
            </p>
            <div className="feature-arrow">
              Browse Directory <span>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-text">
            <h2>Compliance doesn&apos;t have to be complex.</h2>
            <p>One hub. Every work authorization answer you need.</p>
          </div>
          <Link href="/hub" className="btn-primary-lg">
            Open Command Center →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <span className="footer-copy">© 2026 HR Hub. Professional Edition.</span>
        <div className="footer-links">
          <a
            href="https://www.uscis.gov/i-9"
            target="_blank"
            rel="noopener noreferrer"
          >
            USCIS I-9
          </a>
          <a
            href="https://i94.cbp.dhs.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            I-94
          </a>
        </div>
      </footer>
    </div>
  );
}
