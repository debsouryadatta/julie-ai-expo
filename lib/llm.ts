import { SYSTEM_PROMPT } from "./prompt";
import { Message } from "./types";

// send text to Groq API
export const sendToGpt = async (messages: Message[], groqApiKey: string) => {
    console.log("messages", messages);
    // messages.unshift({ role: "system", content: SYSTEM_PROMPT })
    const modifiedMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages]
    console.log("modifiedMessages", modifiedMessages);
    
    const body = {
        model: "llama3-8b-8192",
        messages: modifiedMessages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
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