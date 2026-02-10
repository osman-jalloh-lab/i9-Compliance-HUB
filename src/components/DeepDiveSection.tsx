
"use client";

import { useState } from "react";

interface DeepDiveSectionProps {
    entityName: string;
    category: string;
}

export default function DeepDiveSection({ entityName, category }: DeepDiveSectionProps) {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeepDive = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/deep-dive", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ entityName, category }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch deep-dive data.");
            }

            setResult(data.response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section style={{ marginTop: '4rem', padding: '3rem', background: '#0f172a', borderRadius: '32px', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>AI Technical Deep-Dive</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Get real-time regulatory guidance and citations for {entityName}.</p>
                </div>
                <button
                    onClick={handleDeepDive}
                    disabled={isLoading}
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.4)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isLoading ? "Analyzing USCIS Archives..." : "🚀 Start Deep Dive"}
                </button>
            </div>

            {error && (
                <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '16px', color: '#f87171', fontSize: '0.9rem' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                    fontSize: '1.05rem',
                    color: '#e2e8f0'
                }}>
                    {result}
                </div>
            )}
        </section>
    );
}
