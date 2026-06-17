import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import "../app/landing.css";

export default function Navbar() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <span className="logo-dot" aria-hidden="true" />
          <span className="logo-brand">HRHUB</span>
          <span className="logo-sub">EXPLORER</span>
        </Link>

        {/* Nav Links */}
        <div className="nav-links">
          <Link href="/hub" className="navLink">The Explorer</Link>
          <Link href="/hub/playbook" className="navLink">Scenario Playbook</Link>
          <Link href="/hub/directory" className="navLink">Directory</Link>
          <Link href="/hub/sop" className="navLink">SOP Guides</Link>
          <span className="nav-sep" aria-hidden="true" />
          <a
            href="https://www.uscis.gov/i-9"
            target="_blank"
            rel="noopener noreferrer"
            className="navLink nav-ext"
          >
            USCIS I-9 ↗
          </a>
          <a
            href="https://i94.cbp.dhs.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="navLink nav-ext"
          >
            I-94 ↗
          </a>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </nav>
  );
}
