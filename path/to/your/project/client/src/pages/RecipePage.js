import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';

const RecipePage = ({ isLoggedIn, socket }) => {
  const [recipe, setRecipe] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      socket.on('update-recipe', (recipeData) => {
        setRecipe(recipeData.recipe);
        setLoading(false);
      });

      socket.on('error', (error) => {
        setError(error.message);
        setLoading(false);
      });
    }

    return () => {
      if (isLoggedIn) {
        socket.off('update-recipe');
        socket.off('error');
      }
    };
  }, [isLoggedIn, socket]);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (ingredients.trim() === '') {
      setError('Please enter some ingredients.');
      return;
    }
    setError(null);
    setLoading(true);
    const ingredientsArray = ingredients.split(',').map(i => i.trim());
    socket.emit('request-recipe', ingredientsArray);
    setIngredients('');
  };

  return (
    <div className="container mt-5">
      <h2>Recipe Suggestions</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="ingredientsInput">Ingredients</label>
          <input type="text" className="form-control" id="ingredientsInput" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Enter ingredients separated by commas" />
          {error && <Alert variant='danger'>{error}</Alert>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Get Recipe</button>
      </form>
      {loading && <Spinner animation="border" />}
      {!loading && recipe && (
        <div className="mt-4">
          <h3>Recipe</h3>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
