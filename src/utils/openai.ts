const OpenAI = require('openai-api');
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);
export default openai