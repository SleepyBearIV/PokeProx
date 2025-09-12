import { useState } from 'react';
import './App.css';

function App() {
    const [pokeName, setPokeName] = useState('');
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);



    async function fetchPokemon(e) {
        e.preventDefault(); //no reload
        const response = await fetch(`/pokemon/${pokeName}`);
        if (response.ok) {
            const data = await response.json();
            setPokemon(data);
        }
        else {
            const data = await response.text();
            setError(data);
        }
    }

    return (
        <div>
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
            {pokemon && (
                <div>
                    <h2>{pokemon.name}</h2>
                    <p>Number: {pokemon.id}</p>
                    <img src={pokemon.image1} />
                    <img src={pokemon.image2} />
                </div>
            )}
        </div>
    );
}

export default App;