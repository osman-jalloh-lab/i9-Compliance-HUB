import Link from "next/link";
import Navbar from "@/components/Navbar";
import "../../landing.css";

export default function SOPPage() {
    return (
        <div className="landingBody" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />

            <main style={{ padding: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ marginBottom: '4rem' }}>
                    <div className="badgeHeader" style={{ color: 'var(--glaido-primary)' }}>Standard Operating Procedures</div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>I-9 Reporting & Compliance <span style={{ color: 'var(--glaido-primary)' }}>SOPs</span></h1>
                    <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: '1.6' }}>
                        Internal guidelines for employment eligibility verification and regulatory record-keeping based on USCIS M-274 handbook.
                    </p>
                </header>

                <div style={{ display: 'grid', gap: '4rem' }}>
                    {/* Section 1: Initial Verification */}
                    <section className="glowCard" style={{ background: '#fff' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>1. Initial Verification (Section 2)</h2>
                        <div style={{ display: 'grid', gap: '1.5rem', color: '#475569', lineHeight: '1.6' }}>
                            <p><strong>Timeline:</strong> Documents must be examined and Section 2 completed within <strong>3 business days</strong> of the employee's first day of work.</p>
                            <p><strong>Physical Examination:</strong> Employers or their authorized representative must physically examine the original documents (unless using an E-Verify remote examination alternative).</p>
                            <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #4F46E5' }}>
                                <strong>DHS Pro-Tip:</strong> You cannot tell an employee which document(s) they must present. You must provide the official List of Acceptable Documents.
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Reverification */}
                    <section className="glowCard" style={{ background: '#fff' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>2. Reverification (Section 3)</h2>
                        <div style={{ display: 'grid', gap: '1.5rem', color: '#475569', lineHeight: '1.6' }}>
                            <p><strong>When to Reverify:</strong> Reverify when an employee's employment authorization or employment authorization document expires.</p>
                            <div style={{ marginBottom: '1rem' }}><strong>What NOT to Reverify:</strong> Do not reverify:
                                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                                    <li>U.S. Citizens</li>
                                    <li>Non-citizen nationals</li>
                                    <li>LPRs who presented an I-551 (Green Card)</li>
                                    <li>List B Identity documents</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Receipt Rules */}
                    <section className="glowCard" style={{ borderLeft: '8px solid #D97706', background: '#fff' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#D97706', marginBottom: '1.5rem' }}>3. The "Receipt Rule"</h2>
                        <div style={{ display: 'grid', gap: '1.5rem', color: '#475569', lineHeight: '1.6' }}>
                            <p>Employees may present a "receipt" in lieu of an original document in three specific cases:</p>
                            <ol style={{ marginLeft: '1.5rem' }}>
                                <li><strong>Replacement:</strong> A receipt for a lost, stolen, or damaged document (Valid for 90 days).</li>
                                <li><strong>I-94 Arrival-Departure Record:</strong> Containing an unexpired temporary I-551 stamp and photograph.</li>
                                <li><strong>Refugee Admission:</strong> Departure portion of Form I-94 with refugee admission stamp.</li>
                            </ol>
                            <div style={{ background: '#fffbeb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                <strong>Warning:</strong> A receipt for an <em>extension</em> of an expiring document is NOT acceptable under the 90-day receipt rule (except for specific auto-extension categories).
                            </div>
                        </div>
                    </section>
                </div>

                <footer style={{ marginTop: '6rem', padding: '4rem 0', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Source: USCIS M-274 Handbook for Employers. Last Updated: February 2026.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274" target="_blank" className="buttonPrimary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
                            Read Official M-274 Handbook ↗
                        </a>
                    </div>
                </footer>
            </main>
        </div>
    );
}
