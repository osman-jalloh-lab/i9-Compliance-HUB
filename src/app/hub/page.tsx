
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "../landing.css";
import I9ScenarioBuilder from "@/components/I9ScenarioBuilder";
import LiveFeedCard from "@/components/LiveFeedCard";
import FunFactsCard from "@/components/FunFactsCard";

export default async function HubPage() {
    const allStatuses = await prisma.visaOrStatus.findMany({
        orderBy: { name: 'asc' }
    });

    const categories = [
        { id: 'Visa', label: 'Visas', color: '#0891B2' },
        { id: 'Status', label: 'Statuses', color: '#C026D3' },
        { id: 'EAD Code (A)', label: 'EAD Codes (A)', color: '#65A30D' },
        { id: 'EAD Code (C)', label: 'EAD Codes (C)', color: '#D97706' },
        { id: 'Immigrant Category', label: 'Immigrant Categories', color: '#7C3AED' },
    ];

    return (
        <div className="landingBody" style={{ minHeight: '100dvh' }}>
            <Navbar />

            <main style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                    <h1 className="hub-h1" style={{ letterSpacing: '-2px' }}>
                        HR Compliance Hub
                    </h1>
                    <p className="hub-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Your central command for I-9 verification, EAD tracking, and immigration compliance.
                    </p>
                </header>

                {/* Bento Grid */}
                <div className="bentoGrid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gridAutoRows: 'minmax(200px, auto)',
                    gap: '1.5rem',
                    marginBottom: '6rem'
                }}>

                    {/* Live Feed - Large Card (Span 4 cols, 2 rows) */}
                    <div style={{ gridColumn: 'span 4', gridRow: 'span 2' }}>
                        <LiveFeedCard />
                    </div>

                    {/* Fun Facts - Medium Card (Span 4 cols) */}
                    <div style={{ gridColumn: 'span 4' }}>
                        <FunFactsCard />
                    </div>

                    {/* New Rules 2025 - Medium Card (Span 4 cols) */}
                    <div className="bento-card-warm" style={{
                        gridColumn: 'span 4',
                        padding: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            background: 'var(--warn)',
                            color: '#09090B',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.6875rem',
                            fontWeight: '800',
                            letterSpacing: '0.06em'
                        }}>NEW</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--t1)', marginBottom: '0.5rem' }}>Updated Rules 2025</h3>
                        <p style={{ color: 'var(--t2)', lineHeight: '1.5' }}>
                            Major changes to remote verification for E-Verify employers. New retention guidelines effective Jan 1st.
                        </p>
                        <a href="#" style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Read Policy Memo <span>→</span>
                        </a>
                    </div>

                    {/* Recent I-9 Updates Timeline - Wide Card (Span 6 cols) */}
                    <div className="bento-card" style={{
                        gridColumn: 'span 6',
                        padding: '2rem',
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--t1)' }}>Recent I-9 Updates</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ minWidth: '7px', height: '7px', borderRadius: '50%', background: 'var(--border-hi)', flexShrink: 0 }}></div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--t3)', display: 'block', letterSpacing: '0.04em' }}>Aug 01, 2023</span>
                                    <span style={{ fontWeight: '600', color: 'var(--t1)', fontSize: '0.9375rem' }}>New Form I-9 Edition (08/01/23) Released</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ minWidth: '7px', height: '7px', borderRadius: '50%', background: 'var(--border-hi)', flexShrink: 0 }}></div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--t3)', display: 'block', letterSpacing: '0.04em' }}>Jul 21, 2023</span>
                                    <span style={{ fontWeight: '600', color: 'var(--t1)', fontSize: '0.9375rem' }}>DHS Announcement on Remote Verification</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ minWidth: '7px', height: '7px', borderRadius: '50%', background: 'var(--border-hi)', flexShrink: 0 }}></div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--t3)', display: 'block', letterSpacing: '0.04em' }}>May 04, 2022</span>
                                    <span style={{ fontWeight: '600', color: 'var(--t1)', fontSize: '0.9375rem' }}>Automatic EAD Extension increased to 540 days</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Downloads - Small Card (Span 2 cols) */}
                    <div className="bento-card" style={{
                        gridColumn: 'span 2',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{ fontWeight: '700', color: 'var(--t3)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Downloads</div>
                        <a href="https://www.uscis.gov/sites/default/files/document/forms/i-9.pdf" target="_blank" rel="noopener noreferrer" style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            color: 'var(--t1)',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            transition: 'border-color 0.2s ease',
                        }}>
                            Form I-9
                        </a>
                        <a href="#" style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            color: 'var(--t1)',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            transition: 'border-color 0.2s ease',
                        }}>
                            M-274 Handbook
                        </a>
                    </div>
                </div>

                {/* Scenario Builder Section */}
                <div style={{ marginBottom: '6rem' }}>
                    <I9ScenarioBuilder />
                </div>
            </main>
        </div>
    );
}
