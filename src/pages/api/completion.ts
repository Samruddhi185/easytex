import {NextApiRequest, NextApiResponse} from 'next';
import openai from "@/utils/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {prompt} = req.body;

  if (req.method !== 'POST') {
    return res.status(400).json({error: 'Invalid request'});
  }

  console.log(prompt);

  const response = await openai.completions.createChatCompletion({
    prompt: prompt,
    model: 'gpt-3.5-turbo-instruct',
    temperature: 0.6,
    max_tokens: 100,
    n: 1,
  });

  return res.status(200).json({
    data: response.data
  });
}
