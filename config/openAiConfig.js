export const OPENAI_API_URL = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

export function getOpenAiApiKey() {
  return process.env.OPENAI_API_KEY; // INPUT_REQUIRED {Insert the actual OpenAI API key here}
}
