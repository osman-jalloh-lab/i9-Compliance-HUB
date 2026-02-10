
"use client";

import { useState } from "react";
import styles from "./Playbook.module.css";

interface Scenario {
    id: string;
    category: string;
    scenarioTitle: string;
    question: string;
    answer: string;
    recordNote: string;
    source?: string | null;
    sourceUrl?: string | null;
}

interface PlaybookClientProps {
    initialScenarios: Scenario[];
}

export default function PlaybookClient({ initialScenarios }: PlaybookClientProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = ["All", ...Array.from(new Set(initialScenarios.map(s => s.category)))];

    const filteredScenarios = initialScenarios.filter(s => {
        const matchesSearch = s.scenarioTitle.toLowerCase().includes(search.toLowerCase()) ||
            s.question.toLowerCase().includes(search.toLowerCase()) ||
            s.answer.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Search scenarios, questions, or rules..."
                    className={styles.searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className={styles.categories}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.grid}>
                {filteredScenarios.map(scenario => (
                    <div key={scenario.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.badge}>{scenario.category}</span>
                            <h3 className={styles.title}>{scenario.scenarioTitle}</h3>
                        </div>
                        <div className={styles.body}>
                            <div className={styles.qGroup}>
                                <label>QUESTION</label>
                                <p className={styles.question}>{scenario.question}</p>
                            </div>
                            <div className={styles.aGroup}>
                                <label>OFFICIAL GUIDANCE</label>
                                <p className={styles.answer}>{scenario.answer}</p>
                            </div>
                            <div className={styles.noteGroup}>
                                <label>DOCUMENTATION PATTERN (FOR AUDIT)</label>
                                <code className={styles.note}>{scenario.recordNote}</code>
                            </div>

                            {scenario.source && (
                                <div className={styles.sourceGroup}>
                                    <label>REGULATORY SOURCE</label>
                                    <div className={styles.sourceValue}>
                                        {scenario.source}
                                        {scenario.sourceUrl && (
                                            <a href={scenario.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                                                OPEN HANDBOOK ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {filteredScenarios.length === 0 && (
                    <div className={styles.noResults}>
                        No scenarios found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
