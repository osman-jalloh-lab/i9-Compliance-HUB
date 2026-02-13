
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "../../landing.css";

export default async function ComplianceDirectoryPage() {
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

            <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{ marginBottom: '4rem', marginTop: '2rem', textAlign: 'center' }}>
                    <div className="badgeHeader" style={{ color: 'var(--glaido-primary)', margin: '0 auto 2rem auto', display: 'inline-block' }}>Compliance Database</div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a' }}>Immigration <span style={{ color: 'var(--glaido-primary)' }}>Directory</span></h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
                        Browse work authorization rules by Visa type, EAD code, or Immigrant category.
                    </p>
                </header>

                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {categories.map((cat) => (
                        <section key={cat.id} style={{ marginBottom: '5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: cat.color }}></div>
                                <h2 className="categoryHeader" style={{ margin: 0, border: 'none', padding: 0, color: '#334155' }}>
                                    {cat.label}
                                </h2>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {allStatuses
                                    .filter((item: any) => item.category === cat.id)
                                    .map((item: any) => (
                                        <Link
                                            href={`/hub/${item.slug}`}
                                            key={item.id}
                                            className="hubCard"
                                            style={{
                                                '--category-color': cat.color,
                                                borderLeft: `4px solid ${cat.color}`,
                                                borderTop: '1px solid rgba(0,0,0,0.08)'
                                            } as any}
                                        >
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: cat.color, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                                    {item.slug}
                                                </div>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1E293B' }}>
                                                    {item.name}
                                                </h3>
                                                <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{item.description || "Detailed guidance available."}</p>
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
