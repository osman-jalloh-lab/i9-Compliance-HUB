
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "../../landing.css";
import PlaybookClient from "@/components/PlaybookClient";

export default async function PlaybookPage() {
    const scenarios = await prisma.playbookScenario.findMany({
        orderBy: { scenarioTitle: 'asc' }
    });

    return (
        <div className="landingBody" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />

            <main style={{ padding: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '4rem' }}>
                    <div className="badgeHeader" style={{ color: 'var(--glaido-primary)' }}>Compliance Playbook</div>
                    <h1 className="mainHeadline" style={{ fontSize: '3.5rem', color: '#0f172a' }}>I-9 Scenario <span style={{ color: 'var(--glaido-primary)' }}>FAQ</span></h1>
                    <p className="subHeadline" style={{ color: '#64748b' }}>A "Real-life HR" list of scenarios built from 8 CFR Part 274a and official USCIS guidance.</p>
                </header>

                <PlaybookClient initialScenarios={scenarios.map((s: any) => ({ ...s, createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString() }))} />
            </main>
        </div>
    );
}
