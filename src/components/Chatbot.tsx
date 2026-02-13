
"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";
import DictationButton from "./DictationButton";
import DOMPurify from "isomorphic-dompurify";

interface Message {
    role: "user" | "bot";
    text: string;
    chips?: string[];
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Hi, my name is Jarvis. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userMsg }),
            });
            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                { role: "bot", text: data.response, chips: data.actions }
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Sorry, I encountered an error. Please try again." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatMessage = (text: string) => {
        let formatted = text;

        // 1. Remove citations like [1], [2], [10] early
        formatted = formatted.replace(/\[\d+\]/g, "");

        // 2. Convert Bold: **text** -> <b>text</b>
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

        // 3. Convert Bold: *text* -> <b>text</b>
        formatted = formatted.replace(/\*(.*?)\*/g, "<b>$1</b>");

        // 4. Convert Headers: ####, ###, ## -> <strong> + <br/>
        // Order matters: long to short
        formatted = formatted.replace(/####\s*(.*)/g, "<strong>$1</strong><br/>");
        formatted = formatted.replace(/###\s*(.*)/g, "<strong>$1</strong><br/>");
        formatted = formatted.replace(/##\s*(.*)/g, "<strong>$1</strong><br/>");

        // 5. Convert Lists: * Item or - Item -> • Item
        formatted = formatted.replace(/^\s*[\*\-]\s+/gm, "• ");

        // 6. CRITICAL: Remove ANY remaining asterisks or hashes that escaped the above
        // This handles cases where the AI might return single stars or weirdly formatted headers
        formatted = formatted.replace(/[\*#]/g, "");

        // 7. Newlines to <br/>
        formatted = formatted.replace(/\n/g, "<br/>");

        return formatted;
    };

    const handleAudioError = (err: string) => {
        setMessages((prev) => [
            ...prev,
            { role: "bot", text: `⚠️ Voice Error: ${err}. Please check your connection.` }
        ]);
    };

    return (
        <>
            <button
                className={styles.toggleButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Chatbot"
            >
                💬
            </button>

            {isOpen && (
                <div className={styles.chatWindow} ref={chatRef}>
                    <div className={styles.header}>
                        <h3>Jarvis</h3>
                        <button onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <div className={styles.messages}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                                <div
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatMessage(msg.text)) }}
                                />
                                {msg.chips && (
                                    <div className={styles.chips}>
                                        {msg.chips.map((chip, i) => (
                                            <button key={i} className={styles.chip} onClick={() => setInput(chip)}>{chip}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && <div className={styles.message + " " + styles.bot}>Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className={styles.inputArea} onSubmit={handleSubmit}>
                        <DictationButton
                            onTranscript={(text: string) => setInput(prev => prev + (prev ? " " : "") + text)}
                            onError={handleAudioError}
                            className={styles.dictationButton}
                        />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about H-1B, I-9 actions..."
                            autoFocus
                        />
                        <button type="submit" disabled={isLoading}>Send</button>
                    </form>
                </div>
            )}
        </>
    );
}
