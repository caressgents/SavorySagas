import express from 'express';
import fetch from 'node-fetch';
import { OPENAI_API_URL, getOpenAiApiKey } from '../config/openAiConfig.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { sanitizeIngredients } from '../utils/sanitizeIngredients.js';

const router = express.Router();

router.post('/generate-recipe', requireAuth, async (req, res) => {
  const ingredients = req.body.ingredients;
  
  if (!ingredients || ingredients.length === 0) {
    return res.status(400).send('No ingredients provided.');
  }

  const sanitizedIngredients = sanitizeIngredients(ingredients);
  const prompt = `Given these ingredients: ${sanitizedIngredients.join(', ')}, provide a detailed recipe suggestion. Be fun, like you're tv host for a cooking show.`;
  
  const openAiApiKey = getOpenAiApiKey();
  if (!openAiApiKey) {
    return res.status(500).send('OpenAI API key missing or not configured.');
  }
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL_NAME,
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.91
      })
    });

    const data = await response.json();

    if (response.status !== 200 || !data.choices || data.choices.length === 0) {
      const errorMessage = 'An error occurred fetching recipe suggestions: ' + (data.error?.message || 'No suggestions could be generated.');
      console.error('Error from OpenAI:', data);
      return res.status(response.status).send(errorMessage);
    }

    res.send({ recipe: data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).send('An error occurred while generating the recipe.');
  }
});

export default router;
