
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { entityName, category } = await req.json();
        const apiKey = process.env.PERPLEXITY_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                error: "PERPLEXITY_API_KEY is not configured in the environment.",
                details: "To enable real-time regulatory deep-dives, please provide a Perplexity API key."
            }, { status: 401 });
        }

        const prompt = `Provide a detailed, professional regulatory summary for the following immigration category: "${entityName}" (${category}). 
        Focus on:
        1. Current work authorization rules (Standard and Extensions).
        2. I-9 compliance nuances and common pitfalls.
        3. Real-time updates from USCIS or DHS from the last 6 months.
        
        Cite official sources (USCIS.gov, DHS.gov, Federal Register) for all claims. Use markdown formatting.`;

        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: "You are an expert HR Immigration Compliance Assistant specializing in USCIS M-274 and Form I-9 rules." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1500,
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Perplexity API Error:", error);
            return NextResponse.json({ error: "AI service failed. Please try again later." }, { status: response.status });
        }

        const data = await response.json();
        const aiText = data.choices[0].message.content;

        return NextResponse.json({ response: aiText });

    } catch (error) {
        console.error("Deep Dive API Internal Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
