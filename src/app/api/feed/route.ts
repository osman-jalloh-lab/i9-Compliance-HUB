import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.PERPLEXITY_API_KEY;

        if (!apiKey) {
            // Return mock data if no API key is set, so the UI still looks good for testing
            return NextResponse.json({
                news: [
                    { title: "DHS Announces EAD Auto-Extensions", date: "2024-04-08", summary: "Certain renewal applicants are now eligible for an automatic extension of up to 540 days." },
                    { title: "New Form I-9 Mandatory", date: "2023-11-01", summary: "Employers must use the 08/01/23 edition of Form I-9. The remote verification pilot program has ended." },
                    { title: "H-1B Cap Registration Period", date: "2024-03-01", summary: "Initial registration period for FY 2025 H-1B cap opens soon." }
                ]
            });
        }

        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: "You are a news aggregator for USCIS and I-9 compliance updates. Return a JSON object with a 'news' array containing exactly 3 items. Each item must have 'title', 'date', and a short 'summary'." },
                    { role: "user", content: "What are the latest critical USCIS I-9 compliance updates and EAD news from the last 6 months?" }
                ],
                max_tokens: 500,
                temperature: 0.1,
                // Force JSON format if the model supports it, otherwise hope for the best or parse
                // For 'sonar' models, we often just ask for JSON in the prompt.
            })
        });

        if (!response.ok) {
            throw new Error(`Perplexity API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Attempt to parse JSON from the response text
        // Sometimes the model wraps it in ```json ... ```
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json(parsed);
        } else {
            // Fallback if not valid JSON
            return NextResponse.json({
                news: [{ title: "Latest Updates", date: new Date().toISOString().split('T')[0], summary: content.substring(0, 100) + "..." }]
            });
        }

    } catch (error) {
        console.error("Feed API Error:", error);
        return NextResponse.json({
            news: [
                { title: "System Update", date: "Today", summary: "Unable to load live feed. displaying cached updates." },
                { title: "USCIS Standard Protocol", date: "Ongoing", summary: "Always verify documents within 3 business days of hire." }
            ]
        });
    }
}
