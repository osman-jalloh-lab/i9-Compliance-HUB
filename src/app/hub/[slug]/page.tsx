

import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DeepDiveSection from "@/components/DeepDiveSection";
import { notFound } from "next/navigation";
import "../../landing.css";

interface PageProps {
    params: { slug: string };
}

export default async function HubDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const data = await prisma.visaOrStatus.findUnique({
        where: { slug: slug },
        include: {
            workAuthorization: true,
            i9Actions: true,
            sources: true,
        },
    });

    if (!data) {
        notFound();
    }

    const categoryColors: Record<string, string> = {
        'Visa': 'var(--color-visa)',
        'Status': 'var(--color-status)',
        'EAD Code (A)': 'var(--color-ead-a)',
        'EAD Code (C)': 'var(--color-ead-c)',
        'Immigrant Category': 'var(--color-immigrant)',
    };

    const themeColor = categoryColors[data.category] || 'var(--glaido-primary)';

    return (
        <div className="landingBody" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />

            <main style={{ padding: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '4rem' }}>
                    <div style={{ color: themeColor, fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>
                        {data.category} / {data.slug.toUpperCase()}
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a' }}>{data.name}</h1>
                    <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                        {data.description || "Official guidance and work authorization rules for this category."}
                    </p>
                    {data.officialRef && (
                        <a href={data.officialRef} target="_blank" rel="noopener noreferrer" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: themeColor,
                            fontWeight: '800',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            background: `${themeColor}10`,
                            padding: '0.75rem 1.25rem',
                            borderRadius: '12px',
                            border: `1px solid ${themeColor}30`
                        }}>
                            📜 View Official Handbook Section ↗
                        </a>
                    )}
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                    {/* Work Authorization Card */}
                    <section className="glowCard" style={{ borderLeft: `8px solid ${themeColor}`, background: '#fff' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>⚡</span> Work Authorization
                        </div>
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Allowed to Work?</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: data.workAuthorization?.canWork ? '#10b981' : '#ef4444' }}>{data.workAuthorization?.canWork ? "YES" : "NO"}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Sponsorship Required?</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>{data.workAuthorization?.requiresSponsorship ? "YES" : "NO"}</div>
                            </div>
                            <div>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Maximum Duration</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{data.workAuthorization?.maxDuration || "Indefinite / Varies"}</div>
                            </div>
                            <div>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Key Restrictions</div>
                                <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>{data.workAuthorization?.restrictions || "No standard employment restrictions listed."}</div>
                            </div>
                        </div>
                    </section>

                    {/* I-9 Actions Section */}
                    <section style={{ display: 'grid', gap: '2rem', alignContent: 'start' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>Compliance Actions</h2>
                        {data.i9Actions.map((action: any) => (
                            <div key={action.id} style={{
                                background: '#fff',
                                padding: '2rem',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                                position: 'relative',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: '#ef4444' }}></div>
                                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#ef4444', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Trigger: {action.trigger}</div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>{action.actionType}</h3>
                                <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.95rem' }}>{action.details}</p>
                            </div>
                        ))}
                        {data.i9Actions.length === 0 && (
                            <div style={{ color: '#94a3b8', padding: '3rem', textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: '20px', background: '#fff' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                                No critical I-9 actions required at this time.
                            </div>
                        )}
                    </section>
                </div>

                <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', color: '#0f172a' }}>Acceptable I-9 Documents</h2>
                        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {data.workAuthorization?.documentTypes ? JSON.parse(data.workAuthorization.documentTypes).map((doc: string) => (
                                    <span key={doc} style={{ background: '#f1f5f9', color: '#475569', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                                        {doc.toUpperCase()}
                                    </span>
                                )) : <span style={{ color: '#94a3b8' }}>Consult M-274 Guide</span>}
                            </div>
                            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                                Employers must examine one document from List A <strong>OR</strong> one from List B and one from List C.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', color: '#0f172a' }}>Regulatory Sources</h2>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                            {data.sources.map((source: any) => (
                                <li key={source.id}>
                                    <a href={source.url || '#'} target="_blank" className="sourceLink" style={{
                                        color: '#1e293b',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1.25rem 2rem',
                                        background: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '16px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{source.title}</span>
                                        <span style={{ color: themeColor, fontWeight: '800', fontSize: '0.8rem' }}>LINK ↗</span>
                                    </a>
                                </li>
                            ))}
                            {data.sources.length === 0 && <li style={{ color: '#94a3b8' }}>No official sources referenced.</li>}
                        </ul>
                    </section>
                </div>

                <DeepDiveSection entityName={data.name} category={data.category} />
            </main>
        </div>
    );
}
