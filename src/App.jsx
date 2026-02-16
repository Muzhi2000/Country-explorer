import { useEffect, useState } from "react";

export default function CountriesExplorer() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");

  useEffect(() => {
    async function fetchCountries() {
     
      if (search && search.trim().length < 2) {
        setCountries([]);
        return;
      }

      setLoading(true);
      setError(null);

   
      function getApiUrl() {
        if (search.trim().length >= 2) {
          return `https://restcountries.com/v3.1/name/${search}`;
        }
        if (region !== "all") {
          return `https://restcountries.com/v3.1/region/${region}`;
        }
        return "https://restcountries.com/v3.1/all";
      }

      try {
        const res = await fetch(getApiUrl());

       
        if (res.status === 404) {
          setCountries([]);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch countries");
        }

        const data = await res.json();
        setCountries(data);
      } catch (err) {
        setError(err.message);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, [search, region]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🌍 Countries Explorer</h1>

      <input
        type="text"
        placeholder="Search country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="all">All</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Oceania">Oceania</option>
      </select>

      {loading && <p>Loading countries...</p>}

      {error && (
        <div>
          <p style={{ color: "red" }}>Error: {error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!loading && countries.length === 0 && !error && (
        <p>No results found.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {countries.map((country) => (
          <li
            key={country.cca3}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <img
              src={country.flags?.png}
              alt={country.name?.common}
              width="60"
            />
            <h3>{country.name?.common}</h3>
            <p>Region: {country.region}</p>
            <p>
              Population: {country.population?.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}


