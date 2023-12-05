import fetch from 'node-fetch';
import { sanitizeIngredients } from './sanitizeIngredients.js';
import { OPENAI_API_URL, getOpenAiApiKey } from '../config/openAiConfig.js';

export const getRecipeSuggestion = async (ingredientsArray) => {
  const sanitizedIngredients = sanitizeIngredients(ingredientsArray);
  const prompt = `Given these ingredients: ${sanitizedIngredients.join(', ')}, provide a detailed recipe suggestion. Be fun, like a TV host for a cooking show.`;

  console.log('Sending prompt to OpenAI:', prompt);

  const openAiApiKey = getOpenAiApiKey();
  if (!openAiApiKey) {
    throw new Error('OpenAI API key is not configured correctly.');
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 150
      })
    });

    const data = await response.json();

    console.log('OpenAI API response:', data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error('Recipe suggestion could not be generated.');
    }

    return data.choices[0].text.trim();
  } catch (error) {
    throw error;
  }
};
