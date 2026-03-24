import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            // Return mock data if no API key is set, so the UI still looks good for testing
            return NextResponse.json({
                news: [
                    { title: "DHS Announces EAD Auto-Extensions", date: "2024-04-08", summary: "Certain renewal applicants are now eligible for an automatic extension of up to 540 days.", url: "https://www.uscis.gov/newsroom/alerts/uscis-increases-automatic-extension-period-of-employment-authorization-documents-for-certain" },
                    { title: "New Form I-9 Mandatory", date: "2023-11-01", summary: "Employers must use the 08/01/23 edition of Form I-9. The remote verification pilot program has ended.", url: "https://www.uscis.gov/i-9-central/form-i-9-related-news/new-form-i-9-now-available" },
                    { title: "H-1B Cap Registration Period", date: "2024-03-01", summary: "Initial registration period for FY 2025 H-1B cap opens soon.", url: "https://www.uscis.gov/newsroom/alerts/uscis-announces-strengthened-integrity-measures-for-h-1b-program" }
                ]
            });
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 500,
                system: "You are a news aggregator for USCIS and I-9 compliance updates. Return only a raw JSON object with a 'news' array containing exactly 3 items. Each item must have 'title', 'date', 'summary', and 'url'. No explanation, just JSON.",
                messages: [
                    { role: "user", content: "What are the latest critical USCIS I-9 compliance updates and EAD news from the last 6 months?" }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.content[0].text;

        // Attempt to parse JSON from the response text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json(parsed);
        } else {
            // Fallback if not valid JSON
            return NextResponse.json({
                news: [{ title: "Latest Updates", date: new Date().toISOString().split('T')[0], summary: content.substring(0, 100) + "...", url: "https://www.uscis.gov/newsroom" }]
            });
        }

    } catch (error) {
        console.error("Feed API Error:", error);
        return NextResponse.json({
            news: [
                { title: "System Update", date: "Today", summary: "Unable to load live feed. displaying cached updates.", url: "https://www.uscis.gov/newsroom" },
                { title: "USCIS Standard Protocol", date: "Ongoing", summary: "Always verify documents within 3 business days of hire.", url: "https://www.uscis.gov/i-9-central" }
            ]
        });
    }
}
