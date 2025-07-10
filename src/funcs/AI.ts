import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CoreMessage, generateText } from "ai";

type Provider = 'openai' | 'google' | 'anthropic' | 'groq';

export async function getAIResponse(provider: Provider, apiKey: string, messages: CoreMessage[]) {
    let model;
    switch (provider) {
        case 'openai':
            const openai = createOpenAI({ apiKey });
            model = openai('gpt-4-turbo');
            break;
        case 'google':
            const google = createGoogleGenerativeAI({ apiKey });
            model = google('models/gemini-1.5-pro-latest');
            break;
        case 'anthropic':
            const anthropic = createAnthropic({ apiKey });
            model = anthropic('claude-3-opus-20240229');
            break;
        case 'groq':
            const groq = createGroq({ apiKey });
            model = groq('llama-3.3-70b-versatile');
            break;
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }

    return generateText({
        model,
        messages,
    });
}
