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
          "minun",
          "magnemite",
          "magneton",
          "voltorb",
          "electrode",
          "venonat",
          "butterfree",
          "beedrill",
          "paras",
          "parasect",
          "weedle",
          "kakuna",
          "koffing",
          "weezing",
          "gastly",
          "growlithe",
          "arcanine",
          "charmander",
          "charmeleon",
          "charizard",
          "vulpix",
          "ninetales",
          "flareon",
          "meowth",
          "persian",
          "squirtle",
          "wartortle",
          "blastoise",
          "bulbasaur",
          "ivysaur",
          "venusaur",
        ];

        const pokemonToFetch = famousPokemonNames.slice(0, 25);

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
    <div className="container">
      <div className="instructions">
        <h1>Welcome to the Pokémon Memory Challenge!</h1>
        <p>
          Test your memory by clicking on the Pokémon as many times as you can
          without clicking the same one twice. <br />
          Each successful click earns you a point, and your high score will be
          tracked. <br /> Good luck!
        </p>
      </div>
      <div id="score-board">
        <p>Score: {score}</p>
        <p>Max Score: {maxScore}</p>
      </div>
      <div className="game-content">
        {" "}
        {/* Use the grid layout container */}
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            {" "}
            {/* Use the card class */}
            <h2>{pokemon.name}</h2>
            <img
              className="pokemon-image" // Corrected class name
              src={pokemon.sprites?.front_default || "placeholder_image.png"} // Added conditional rendering and placeholder
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
