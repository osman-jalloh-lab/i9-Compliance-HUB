"use client";

import { useEffect, useState } from "react";

const FACTS = [
    "The Form I-9 was first introduced in 1986 following the IRCA act.",
    "You must retain I-9s for 3 years after hire or 1 year after termination, whichever is later.",
    "Reviewing I-9 documents via video link is only allowed for E-Verify employers in good standing.",
    "Form I-9 never expires for the employer, but the version used must be valid at the time of hire.",
    "Employers cannot specify which documents an employee must present from the Lists of Acceptable Documents."
];

export default function FunFactsCard() {
    const [factIndex, setFactIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFactIndex((prev) => (prev + 1) % FACTS.length);
        }, 8000); // Rotate every 8 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            background: '#D1FAE5',
            color: '#065F46',
            borderRadius: '24px',
            padding: '1.5rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>💡</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Did You Know?</span>
            </div>
            <div style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                lineHeight: '1.4',
                animation: 'fadeIn 0.5s ease-in-out'
            }}>
                "{FACTS[factIndex]}"
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
