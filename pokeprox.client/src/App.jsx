import { useState } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';

function App() {
    const [pokeName, setPokeName] = useState('');
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);

    const [pokeName2, setPokeName2] = useState('');
    const [pokemon2, setPokemon2] = useState(null);
    const [error2, setError2] = useState(null);

    const [story, setStory] = useState('');
    const [storyLoading, setStoryLoading] = useState(false);
    const [storyError, setStoryError] = useState('');

    async function fetchPokemon(e) {
        e.preventDefault();
        setError(null);
        setPokemon2(null);
        setPokeName2('');
        const response = await fetch(`/pokemon/${pokeName}`);
        if (response.ok) {
            const data = await response.json();
            setPokemon(data);
        } else {
            const data = await response.text();
            setError(data);
        }
    }

    async function fetchPokemon2(e) {
        e.preventDefault();
        setError2(null);
        const response = await fetch(`/pokemon/${pokeName2}`);
        if (response.ok) {
            const data = await response.json();
            setPokemon2(data);
        } else {
            const data = await response.text();
            setError2(data);
        }
    }

    async function handleGenerateStory() {
        setStory('');
        setStoryError('');
        setStoryLoading(true);
        try {
            const response = await fetch('/story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pokemon1: pokemon,
                    pokemon2: pokemon2
                })
            });
            if (response.ok) {
                const data = await response.json();
                setStory(data.story);
            } else {
                const errorText = await response.text();
                setStoryError(errorText);
            }
        } catch (error) {
            setStoryError('Failed to generate story.');
        }
        setStoryLoading(false);
    }

    function renderAttributes(pokemon) {
        if (!pokemon) return null;
        return (
            <ul className="pokemon-attributes">
                <li><strong>Base Experience:</strong> {pokemon.base_experience}</li>
                <li><strong>Height:</strong> {pokemon.height}</li>
                <li><strong>Weight:</strong> {pokemon.weight}</li>
                <li>
                    <strong>Abilities:</strong> {pokemon.abilities?.join(', ')}
                </li>
                <li>
                    <strong>Types:</strong> {pokemon.types?.join(', ')}
                </li>
                {pokemon.stats?.map(stat => (
                    <li key={stat.name}>
                        <strong>{stat.name.replace('-', ' ')}:</strong> {stat.base_stat}
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className="app-container">
            {!pokemon && (
                <form className="pokeName" onSubmit={fetchPokemon}>
                    <input
                        type="text"
                        placeholder="Enter Pokemon Name"
                        value={pokeName}
                        onChange={e => setPokeName(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            )}
            {error && (
                <div style={{ color: 'red', marginTop: '1em' }}>
                    {error}
                </div>
            )}
            {pokemon && (
                <div className="compare-row">
                    <div className="compare-col">
                        <form className="pokeName" onSubmit={fetchPokemon}>
                            <input
                                type="text"
                                placeholder="Enter Pokemon Name"
                                value={pokeName}
                                onChange={e => setPokeName(e.target.value)}
                            />
                            <button type="submit">Search</button>
                        </form>
                        {error && (
                            <div style={{ color: 'red', marginTop: '1em' }}>
                                {error}
                            </div>
                        )}
                        <div className="pokemon-card">
                            <h2>{pokemon.name}</h2>
                            <p>Number: {pokemon.id}</p>
                            <img src={pokemon.image1} alt={pokemon.name} />
                            {renderAttributes(pokemon)}
                        </div>
                    </div>
                    <div className="compare-col">
                        <form className="pokeName" onSubmit={fetchPokemon2}>
                            <input
                                type="text"
                                placeholder="Compare with another"
                                value={pokeName2}
                                onChange={e => setPokeName2(e.target.value)}
                            />
                            <button type="submit">Compare</button>
                        </form>
                        {error2 && (
                            <div style={{ color: 'red', marginTop: '1em' }}>
                                {error2}
                            </div>
                        )}
                        {pokemon2 && (
                            <div className="pokemon-card pokemon-card--red">
                                <h2>{pokemon2.name}</h2>
                                <p>Number: {pokemon2.id}</p>
                                <img src={pokemon2.image1} alt={pokemon2.name} />
                                {renderAttributes(pokemon2)}
                            </div>
                        )}
                    </div>

                </div>
            )}
            {pokemon && pokemon2 && (
                <div style={{ marginTop: '2em', textAlign: 'center' }}>
                    <button className="generate-story-btn" onClick={handleGenerateStory} disabled={storyLoading}>
                        {storyLoading ? 'Generating...' : 'Generate Story'}
                    </button>
                    {story && (
                        <div className="story-container">
                            <ReactMarkdown>{story}</ReactMarkdown>
                        </div>
                    )}
                    {storyError && (
                        <div style={{ color: 'red', marginTop: '1em' }}>
                            {storyError}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;