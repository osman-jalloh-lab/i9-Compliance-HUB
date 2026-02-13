"use client";

import { useEffect, useState } from "react";

export default function LiveFeedCard() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            try {
                const res = await fetch("/api/feed");
                const data = await res.json();
                if (data.news && Array.isArray(data.news)) {
                    setNews(data.news);
                }
            } catch (err) {
                console.error("Failed to load news", err);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    return (
        <div style={{
            background: '#1E293B',
            color: '#fff',
            borderRadius: '24px',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: '#EF4444',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: '800',
                letterSpacing: '1px'
            }}>
                URGENT
            </div>

            <div style={{
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#94A3B8',
                marginBottom: '1rem',
                fontWeight: '700'
            }}>
                USCIS LIVE FEED
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <div style={{ color: '#94A3B8', fontSize: '0.9rem', fontStyle: 'italic' }}>Fetching latest updates...</div>
                ) : (
                    news.map((item, idx) => (
                        <div key={idx} style={{
                            paddingBottom: '1rem',
                            borderBottom: idx === news.length - 1 ? 'none' : '1px solid #334155'
                        }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.25rem' }}>{item.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.4' }}>{item.summary}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.5rem' }}>{item.date}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
