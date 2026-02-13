
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
        <div className="landingBody" style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
            <Navbar />

            <main style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                    <h1 style={{
                        fontFamily: "'Inter', sans-serif", // Or a serif font if imported
                        fontSize: '4rem',
                        fontWeight: '800',
                        color: '#0F172A',
                        marginBottom: '1rem',
                        letterSpacing: '-2px'
                    }}>
                        HR Compliance Hub
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
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
                    <div style={{
                        gridColumn: 'span 4',
                        background: '#FFF7ED',
                        borderRadius: '24px',
                        padding: '2rem',
                        position: 'relative',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            background: '#F97316',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.7rem',
                            fontWeight: '800'
                        }}>NEW</div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#9A3412', marginBottom: '0.5rem' }}>Updated Rules 2025</h3>
                        <p style={{ color: '#C2410C', lineHeight: '1.5' }}>
                            Major changes to remote verification for E-Verify employers. New retention guidelines effective Jan 1st.
                        </p>
                        <a href="#" style={{ marginTop: '1rem', color: '#EA580C', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Read Policy Memo <span>→</span>
                        </a>
                    </div>

                    {/* Recent I-9 Updates Timeline - Wide Card (Span 6 cols) */}
                    <div style={{
                        gridColumn: 'span 6',
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '2rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #E2E8F0'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1E293B' }}>Recent I-9 Updates</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }}></div>
                                <div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B', display: 'block' }}>Aug 01, 2023</span>
                                    <span style={{ fontWeight: '600', color: '#334155' }}>New Form I-9 Edition (08/01/23) Released</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }}></div>
                                <div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B', display: 'block' }}>Jul 21, 2023</span>
                                    <span style={{ fontWeight: '600', color: '#334155' }}>DHS Announcement on Remote Verification</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }}></div>
                                <div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B', display: 'block' }}>May 04, 2022</span>
                                    <span style={{ fontWeight: '600', color: '#334155' }}>Automatic EAD Extension increased to 540 days</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Downloads - Small Card (Span 2 cols) */}
                    <div style={{
                        gridColumn: 'span 2',
                        background: '#F1F5F9',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{ fontWeight: '800', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Downloads</div>
                        <a href="https://www.uscis.gov/sites/default/files/document/forms/i-9.pdf" target="_blank" style={{
                            background: '#fff',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            color: '#1E293B',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
                        }}>
                            📄 Form I-9
                        </a>
                        <a href="#" style={{
                            background: '#fff',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            color: '#1E293B',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
                        }}>
                            📄 Form I-95
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
