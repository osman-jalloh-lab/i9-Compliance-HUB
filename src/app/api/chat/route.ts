
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { query } = await req.json();
        const lowerQuery = query.toLowerCase();

        // 1. Entity Extraction (Simple Mock for Local DB)
        let entity = null;
        if (lowerQuery.includes("h-1b") || lowerQuery.includes("h1b")) entity = "h1b";
        else if (lowerQuery.includes("f-1") || lowerQuery.includes("opt")) entity = "f1-opt";
        else if (lowerQuery.includes("tn")) entity = "tn";
        else if (lowerQuery.includes("ead")) entity = "ead-c09";

        // 2. Local Retrieval
        let responseText = "";
        let actions: string[] = [];

        if (entity) {
            const data = await prisma.visaOrStatus.findFirst({
                where: { slug: { contains: entity } },
                include: { workAuthorization: true, i9Actions: true }
            });

            if (data) {
                const canWork = data.workAuthorization?.canWork ? "✅ Yes" : "❌ No";
                responseText = `**${data.name}**\n\n**Can Work:** ${canWork}\n\n${data.description || "No additional details available."}`;

                if (data.workAuthorization?.documentTypes) {
                    try {
                        const docs = JSON.parse(data.workAuthorization.documentTypes);
                        if (Array.isArray(docs) && docs.length > 0) {
                            responseText += `\n\n**Acceptable I-9 Documents:** ${docs.join(", ")}`;
                        }
                    } catch (e) {
                        console.error("Failed to parse documentTypes:", e);
                    }
                }

                if (data.i9Actions.length > 0) {
                    actions = ["View Full Details", "See I-9 Actions"];
                }

                // Return immediately if local data found
                return NextResponse.json({ response: responseText, actions });
            }
        }

        // 3. AI Fallback (Perplexity)
        const apiKey = process.env.PERPLEXITY_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ response: "I'm currently unable to access my AI knowledge base. Please check your API key configuration." });
        }

        const aiResponse = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: "You are an expert HR Immigration Compliance Assistant. Answer strictly based on USCIS M-274 and official DHS regulations. Be concise and professional." },
                    { role: "user", content: query }
                ],
                max_tokens: 1000,
                temperature: 0.2
            })
        });

        if (!aiResponse.ok) {
            console.error("Perplexity API Error:", await aiResponse.text());
            return NextResponse.json({ response: "I encountered an error connecting to my knowledge base. Please try again later." });
        }

        const data = await aiResponse.json();
        const aiText = data.choices[0].message.content;

        return NextResponse.json({ response: aiText, actions: [] });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
