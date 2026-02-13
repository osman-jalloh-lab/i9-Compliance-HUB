
import Link from "next/link";

export default function Navbar() {
    return (
        <nav style={{
            padding: '1.5rem 4rem',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <Link href="/" style={{ textDecoration: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                <span style={{ color: 'var(--glaido-primary)' }}>HR Hub</span> <span style={{ color: '#94a3b8', fontWeight: '400' }}>Explorer</span>
            </Link>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link href="/hub" className="navLink">The Explorer</Link>
                <Link href="/hub/playbook" className="navLink">Scenario Playbook</Link>
                <Link href="/hub/directory" className="navLink">Compliance Directory</Link>
                <Link href="/hub/sop" className="navLink">SOP Guides</Link>
                <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>
                <a href="https://www.uscis.gov/i-9" target="_blank" className="navLink" style={{ fontSize: '0.85rem' }}>USCIS I-9 ↗</a>
                <a href="https://i94.cbp.dhs.gov/" target="_blank" className="navLink" style={{ fontSize: '0.85rem' }}>I-94 ↗</a>
            </div>
        </nav>
    );
}
