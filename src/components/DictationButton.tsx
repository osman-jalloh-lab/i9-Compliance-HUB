
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface DictationButtonProps {
    onTranscript: (text: string) => void;
    onError?: (error: string) => void;
    className?: string;
}

export default function DictationButton({ onTranscript, onError, className }: DictationButtonProps) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const onTranscriptRef = useRef(onTranscript);
    const onErrorRef = useRef(onError);

    // Update refs
    useEffect(() => {
        onTranscriptRef.current = onTranscript;
        onErrorRef.current = onError;
    }, [onTranscript, onError]);

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = "en-US";

            recognitionInstance.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                if (onTranscriptRef.current) {
                    onTranscriptRef.current(transcript);
                }
                setIsListening(false);
            };

            recognitionInstance.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                if (onErrorRef.current) {
                    onErrorRef.current(event.error);
                }
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        }

        return () => {
            if (recognition) {
                recognition.abort();
            }
        };
        // Removed onTranscript from dependency to keep instance stable
    }, []);

    const toggleListening = useCallback(() => {
        if (!recognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
                setIsListening(true);
            } catch (err) {
                // Already started or error
                console.error(err);
                setIsListening(false);
            }
        }
    }, [recognition, isListening]);

    return (
        <button
            type="button"
            onClick={toggleListening}
            className={`${className} ${isListening ? "listeningPulse" : ""}`}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: isListening ? "var(--glaido-primary)" : "#f1f5f9",
                color: isListening ? "#fff" : "#64748b",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "1.2rem",
                flexShrink: 0
            }}
            title={isListening ? "Listening..." : "Start Voice Input"}
        >
            {isListening ? "🔴" : "🎤"}
        </button>
    );
}
