
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "../landing.css";
import I9ScenarioBuilder from "@/components/I9ScenarioBuilder";

export default async function HubPage() {
    const allStatuses = await prisma.visaOrStatus.findMany({
        orderBy: { name: 'asc' }
    });

    const categories = [
        { id: 'Visa', label: 'Visas', color: 'var(--color-visa)' },
        { id: 'Status', label: 'Statuses', color: 'var(--color-status)' },
        { id: 'EAD Code (A)', label: 'EAD Codes (A)', color: 'var(--color-ead-a)' },
        { id: 'EAD Code (C)', label: 'EAD Codes (C)', color: 'var(--color-ead-c)' },
        { id: 'Immigrant Category', label: 'Immigrant Categories', color: 'var(--color-immigrant)' },
    ];

    return (
        <div className="landingBody" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />

            <main style={{ padding: '4rem', maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{ marginBottom: '6rem' }}>
                    <div className="badgeHeader" style={{ color: 'var(--glaido-primary)' }}>Compliance Intelligence</div>
                    <h1 className="mainHeadline" style={{ fontSize: '3.5rem', color: '#0f172a' }}>HR Immigration <span style={{ color: 'var(--glaido-primary)' }}>Data Hub</span></h1>
                    <p className="subHeadline" style={{ color: '#64748b' }}>Search and verify work authorization rules, EAD extension policies, and I-9 compliance triggers in real-time.</p>
                </header>

                {/* Interactive Scenario Builder */}
                <I9ScenarioBuilder />

                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {categories.map((cat) => (
                        <section key={cat.id} style={{ marginBottom: '6rem' }}>
                            <h2 className="categoryHeader" style={{ borderLeft: `8px solid ${cat.color}`, paddingLeft: '1.5rem' } as any}>
                                {cat.label}
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '2rem'
                            }}>
                                {allStatuses
                                    .filter((item: any) => item.category === cat.id)
                                    .map((item: any) => (
                                        <Link
                                            href={`/hub/${item.slug}`}
                                            key={item.id}
                                            className="hubCard"
                                            style={{ '--category-color': cat.color, borderTop: `4px solid ${cat.color}` } as any}
                                        >
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: cat.color, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                                    {item.slug}
                                                </div>
                                                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                                                    {item.name} <span>→</span>
                                                </h2>
                                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.description || "Detailed guidance available."}</p>
                                            </div>
                                            <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '1px' }}>
                                                VIEW VERIFICATION GUIDE
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
}
