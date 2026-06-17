
"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./I9ScenarioBuilder.module.css";

type RepresentativeStatus = "citizen" | "lpr" | "foreign";

type DocumentRuleItem = {
  docCode: string;
  docName: string;
  listType: string;
  reason: string | null;
  acceptable: boolean;
};

type WorkAuthorizationPayload = {
  canWork: boolean;
  requiresSponsorship: boolean;
  maxDuration?: string | null;
  restrictions?: string | null;
  documentTypes: string;
  reverificationRequired: boolean;
  eadAutoExtensionEligible: boolean;
  autoExtensionAuthority?: string | null;
  autoExtensionEffectiveDate?: string | null;
};

type ScenarioResponse = {
  name: string;
  category: string;
  workAuthorization: WorkAuthorizationPayload;
  documentRules: DocumentRuleItem[];
};

const statusCards: Array<{ key: RepresentativeStatus; emoji: string; title: string; subtitle: string }> = [
  { key: "citizen", emoji: "🇺🇸", title: "U.S. Citizen", subtitle: "Born or naturalized in the U.S." },
  { key: "lpr", emoji: "🪪", title: "Permanent Resident (LPR)", subtitle: "Green Card holder." },
  { key: "foreign", emoji: "✈️", title: "Foreign National", subtitle: "Visa holders and EAD categories." },
];

export default function I9ScenarioBuilder() {
  const [status, setStatus] = useState<RepresentativeStatus | null>(null);
  const [scenario, setScenario] = useState<ScenarioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!status) {
      setScenario(null);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    setScenario(null);

    fetch(`/api/i9-scenario?slug=${status}`)
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.error || "Unable to load guidance.");
        }
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setScenario(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message ?? "Failed to load I-9 guidance.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status]);

  const groupedRules = useMemo(() => {
    const groups: Record<string, DocumentRuleItem[]> = {};
    scenario?.documentRules.forEach((rule) => {
      groups[rule.listType] = groups[rule.listType] || [];
      groups[rule.listType].push(rule);
    });
    Object.values(groups).forEach((items) => {
      items.sort((a, b) => a.docName.localeCompare(b.docName));
    });
    return groups;
  }, [scenario]);

  const documentTypes = useMemo<string[]>(() => {
    if (!scenario?.workAuthorization?.documentTypes) return [];
    try {
      return JSON.parse(scenario.workAuthorization.documentTypes) as string[];
    } catch {
      return [];
    }
  }, [scenario]);

  const reset = () => {
    setStatus(null);
    setScenario(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>I-9 Scenario Builder</h2>
        <p>Interactive document guidance powered by seeded I-9 rules and status-specific work authorization data.</p>
      </div>

      <div className={styles.content}>
        {!status && (
          <div className={styles.step}>
            <h3>Step 1: Select Employee Status</h3>
            <div className={styles.grid}>
              {statusCards.map((card) => (
                <button key={card.key} className={styles.statusCard} onClick={() => setStatus(card.key)}>
                  <span className={styles.icon}>{card.emoji}</span>
                  <strong>{card.title}</strong>
                  <span>{card.subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {status && (
          <div className={styles.step}>
            <button className={styles.backButton} onClick={reset}>← Back to Selection</button>
            <h3>Step 2: Recommended Documentation</h3>

            {loading && (
              <div className={styles.loadingPanel}>
                <p>Loading status guidance...</p>
              </div>
            )}

            {error && (
              <div className={styles.errorPanel}>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && scenario && (
              <div className={styles.resultGrid}>
                <div className={styles.listSection}>
                  <h4 className={styles.listA}>Initial Acceptable I-9 Documents</h4>
                  {groupedRules["A"]?.length ? (
                    <>
                      <h5>List A</h5>
                      <ul className={styles.docList}>
                        {groupedRules["A"].map((rule) => (
                          <li key={rule.docCode}>{rule.docName}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className={styles.note}>No List A guidance available for this status.</p>
                  )}

                  <p className={styles.orLabel}>— OR —</p>

                  <div>
                    <div>
                      <h5>List B</h5>
                      <ul className={styles.docList}>
                        {groupedRules["B"]?.map((rule) => (
                          <li key={rule.docCode}>{rule.docName}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <h5>List C</h5>
                      <ul className={styles.docList}>
                        {groupedRules["C"]?.map((rule) => (
                          <li key={rule.docCode}>{rule.docName}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={styles.guidanceSection}>
                  <h4>Key Compliance Notes</h4>

                  <div className={styles.tipBox}>
                    <strong>Work Authorization</strong>
                    <p>{scenario.workAuthorization.canWork ? "This status is authorized to work in the U.S." : "This status requires current employment authorization documents before the employee may work."}</p>
                  </div>

                  <div className={styles.tipBox}>
                    <strong>Reverification</strong>
                    <p>{scenario.workAuthorization.reverificationRequired ? "Reverification is required when authorization expires." : "Reverification is not required for this status."}</p>
                  </div>

                  {scenario.workAuthorization.eadAutoExtensionEligible && (
                    <div className={styles.tipBox}>
                      <strong>Automatic EAD extension</strong>
                      <p>{scenario.workAuthorization.autoExtensionAuthority ? scenario.workAuthorization.autoExtensionAuthority : "This category may be eligible for automatic extension when a timely EAD renewal is filed."}</p>
                    </div>
                  )}

                  {documentTypes.length > 0 && (
                    <div className={styles.tipBox}>
                      <strong>Seeded Document Types</strong>
                      <div className={styles.tagList}>
                        {documentTypes.map((doc) => (
                          <span key={doc} className={styles.tag}>{doc.toUpperCase()}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.tipBox}>
                    <strong>Important</strong>
                    <p>Employers must accept any reasonable and genuine combination of List A, or List B + List C documents. Do not demand a specific document.</p>
                  </div>

                  <div className={styles.links}>
                    <a href="https://www.uscis.gov/i-9-central/form-i-9-acceptable-documents" target="_blank" rel="noopener noreferrer">View Official I-9 documents list ↗</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
