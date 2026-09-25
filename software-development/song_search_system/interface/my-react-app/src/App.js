import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    setResults([]);

    try {
      const response = await fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();

        const formattedResults = data.response?.docs?.map((song) => {
          const fields = Object.keys(song)
            .filter((key) => key !== '_version_' && key !== 'vector' && key !== 'id')
            .reduce((acc, key) => {
              acc[key] = String(song[key]); 
              return acc;
            }, {});

          return fields;
        }) || [];

        setResults(formattedResults);
      } else {
        setResults([{ error: response.statusText }]);
      }
    } catch (error) {
      setResults([{ error: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Song Search System</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query"
        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
      />

      <button
        onClick={handleSearch}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
        {results.length > 0 && (
          <>
            <h3>Results:</h3>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '10px',
                  marginBottom: '10px',
                }}
              >
                {result.error && (
                  <p style={{ color: 'red' }}>{result.error}</p>
                )}
                {!result.error &&
                  Object.keys(result).map((fieldKey, fieldIndex) => (
                    <p key={fieldIndex}>
                      <strong>{fieldKey}:</strong>{' '}
                      {result[fieldKey]
                        .split('\n') // Split by \n
                        .map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                    </p>
                  ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
