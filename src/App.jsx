import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [clickedPokemonIds, setClickedPokemonIds] = useState(new Set());

  useEffect(() => {
    const fetchFamousPokemon = async () => {
      try {
        const famousPokemonNames = [
          "pikachu",
          "pichu",
          "plusle",
          "minun", // Similar Electric
          "venonat",
          "butterfree", // Similar Bug/Psychic
          "ekans",
          "arbok", // Similar Poison
          "growlithe",
          "arcanine", // Similar Fire
          "meowth",
          "persian", // Similar Normal
          "doduo",
          "dodrio", // Similar Normal/Flying
          "squirtle",
          "charmander",
          "bulbasaur", // Starters (for variety)
        ];

        // Ensure we only fetch 16, even if the array has more.
        const pokemonToFetch = famousPokemonNames.slice(0, 16);

        const pokemonData = await Promise.all(
          pokemonToFetch.map(async (name) => {
            try {
              const response = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${name}`
              );
              return response.data;
            } catch (innerError) {
              console.error(`Error fetching ${name}:`, innerError);
              return null;
            }
          })
        );

        const filteredPokemonData = pokemonData.filter(
          (pokemon) => pokemon !== null
        );
        setPokemons(filteredPokemonData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamousPokemon();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handlePokemonClick = (pokemonId) => {
    if (clickedPokemonIds.has(pokemonId)) {
      if (score > maxScore) {
        setMaxScore(score);
      }
      setScore(0);
      setClickedPokemonIds(new Set());
      shufflePokemons();
    } else {
      setClickedPokemonIds(new Set(clickedPokemonIds).add(pokemonId));
      setScore(score + 1);
      shufflePokemons();
    }
  };

  const shufflePokemons = () => {
    const shuffledPokemons = [...pokemons];
    for (let i = shuffledPokemons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPokemons[i], shuffledPokemons[j]] = [
        shuffledPokemons[j],
        shuffledPokemons[i],
      ];
    }
    setPokemons(shuffledPokemons);
  };

  return (
    <div>
      <div id="score-board">
        <p>Score: {score}</p>
        <p>Max Score: {maxScore}</p>
      </div>
      <div id="main-component">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} style={{ margin: "10px", textAlign: "center" }}>
            <h2>{pokemon.name}</h2>
            <img
              className="pokimon-images"
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              onClick={() => handlePokemonClick(pokemon.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
