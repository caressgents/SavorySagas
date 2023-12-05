export const sanitizeIngredients = (ingredients) => {
  return ingredients.map(ingredient => ingredient.replace(/[^a-zA-Z0-9, ]/g, '').trim());
};