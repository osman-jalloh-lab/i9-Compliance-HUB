
"use client";

import { useState } from "react";
import styles from "./I9ScenarioBuilder.module.css";

type Status = "citizen" | "lpr" | "foreign" | null;

export default function I9ScenarioBuilder() {
    const [status, setStatus] = useState<Status>(null);
    const [step, setStep] = useState(1);

    const handleStatusSelect = (s: Status) => {
        setStatus(s);
        setStep(2);
    };

    const reset = () => {
        setStatus(null);
        setStep(1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>I-9 Scenario Builder</h2>
                <p>Interactive document verification guide based on employee status.</p>
            </div>

            <div className={styles.content}>
                {step === 1 && (
                    <div className={styles.step}>
                        <h3>Step 1: Select Employee Status</h3>
                        <div className={styles.grid}>
                            <button className={styles.statusCard} onClick={() => handleStatusSelect("citizen")}>
                                <span className={styles.icon}>🇺🇸</span>
                                <strong>U.S. Citizen</strong>
                                <span>Born or naturalized in the U.S.</span>
                            </button>
                            <button className={styles.statusCard} onClick={() => handleStatusSelect("lpr")}>
                                <span className={styles.icon}>🪪</span>
                                <strong>Perm. Resident (LPR)</strong>
                                <span>Green Card holders.</span>
                            </button>
                            <button className={styles.statusCard} onClick={() => handleStatusSelect("foreign")}>
                                <span className={styles.icon}>✈️</span>
                                <strong>Foreign National</strong>
                                <span>EAD holders, Visas (H-1B, L-1, etc.)</span>
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && status && (
                    <div className={styles.step}>
                        <button className={styles.backButton} onClick={reset}>← Back to Selection</button>
                        <h3>Step 2: Recommended Documentation</h3>

                        <div className={styles.resultGrid}>
                            <div className={styles.listSection}>
                                <h4 className={styles.listA}>List A (Identity & Work Auth)</h4>
                                <ul className={styles.docList}>
                                    {status === "citizen" && <li>U.S. Passport or Passport Card</li>}
                                    {status === "lpr" && <li>Permanent Resident Card (Form I-551)</li>}
                                    {status === "foreign" && (
                                        <>
                                            <li>EAD Card (Form I-766)</li>
                                            <li>Foreign Passport + Form I-94 (Visa holders)</li>
                                        </>
                                    )}
                                </ul>
                                <p className={styles.orLabel}>— OR —</p>
                                <h4 className={styles.listBC}>List B + List C</h4>
                                <ul className={styles.docList}>
                                    <li><strong>List B:</strong> Driver's License or State ID</li>
                                    <li><strong>List C:</strong>
                                        {status === "citizen" ? " Social Security Card or Birth Certificate" :
                                            status === "lpr" ? " Social Security Card (Unrestricted)" :
                                                " Restricted SSN Card + DHS Authorization"}
                                    </li>
                                </ul>
                            </div>

                            <div className={styles.guidanceSection}>
                                <h4>Compliance Tips</h4>
                                <div className={styles.tipBox}>
                                    <strong>Receipt Rule:</strong>
                                    <p>HR can accept a receipt for a <em>lost, stolen, or damaged</em> document for 90 days.</p>
                                </div>
                                {status === "foreign" && (
                                    <div className={styles.tipBox}>
                                        <strong>Auto-Extension:</strong>
                                        <p>Certain EAD categories (C08, C09, C26) may be eligible for a 540-day automatic extension.</p>
                                    </div>
                                )}
                                <div className={styles.links}>
                                    <a href="https://www.uscis.gov/i-9-central/form-i-9-acceptable-documents" target="_blank">View Official List A/B/C ↗</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
