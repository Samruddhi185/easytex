import { OpenAI } from 'openai';
const openai = new OpenAI(
    {
        apiKey: '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',
        // dangerouslyAllowBrowser: true
    }
);

export default openai