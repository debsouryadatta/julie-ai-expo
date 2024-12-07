import { SYSTEM_PROMPT } from "./prompt";
import { Message } from "./types";

// send text to Groq API
export const sendToGpt = async (messages: Message[], groqApiKey: string) => {
    console.log("messages", messages);
    // messages.unshift({ role: "system", content: SYSTEM_PROMPT })
    const modifiedMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages]
    console.log("modifiedMessages", modifiedMessages);
    
    const body = {
        model: "llama-3.3-70b-versatile",
        messages: modifiedMessages,
        temperature: 0.75, // Better balance between consistency and creativity
        max_tokens: 300,
        top_p: 0.9, // Add top_p to help with response quality
        frequency_penalty: 0.3, // Reduce repetition
        presence_penalty: 0.6, // Encourage more diverse responses
    };
    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${groqApiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.log("Error sending text to Groq API", error);
    }
};