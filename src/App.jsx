import { useState, useEffect } from 'react';
import './App.css';

const apiUrl = 'https://api.jikan.moe/v4/anime';

export default function App() {
  const [animes, setAnimes] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [query, setQuery] = useState('');
  const [summerAnimes, setSummerAnimes] = useState([]);
  const [selectedSTAnime, setSelectedSTAnime] = useState(null);
  const [topAiringAnime, setTopAiringAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([])
  

  useEffect(() => {
    retryFetch(fetchSummerAnimes);
    setTimeout(() => retryFetch(fetchTopAiringAnime), 1000);
    setTimeout(() => retryFetch(fetchUpcomingAnime), 2000);
  }, []);

  async function retryFetch(fetchFunction, retryCount = 10, retryDelay = 1000) {
    let attempt = 0;
    while (attempt < retryCount) {
      try {
        await fetchFunction();
        return;
      } catch (error) {
        console.error(`Error fetching data, attempt ${attempt + 1}:`, error);
        attempt++;
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
    console.error('Failed to fetch data after multiple attempts');
  }


  async function fetchAnimes(searchQuery) {
    try {
      const response = await fetch(`${apiUrl}?q=${searchQuery}`);
      const data = await response.json();
      setAnimes(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchSummerAnimes() {
    try {
      const response = await fetch('https://api.jikan.moe/v4/seasons/2024/summer');
      const data = await response.json();
      setSummerAnimes(data.data);
    } catch (error) {
      console.error('Error fetching summer animes:', error);
    }
  }

  async function fetchTopAiringAnime() {
    const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing');
    const data = await response.json();
    console.log("Fetched top airing anime:", data.data); // Debug log
    setTopAiringAnime(data.data);
  }

  async function fetchUpcomingAnime() {
    const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=upcoming');
    const data = await response.json();
    console.log("Fetched top upcoming anime:", data.data); // Debug log
    setUpcomingAnime(data.data);
  }

  function handleSearch(e) {
    e.preventDefault(); // Mencegah submit form default
    if (query.trim()) {
      fetchAnimes(query);
    } else {
      setAnimes([]);
    }
  }

  function handleSelectedAnime(id) {
    const newAnime = animes.find((anime) => anime.mal_id === id);
    setSelectedAnime(newAnime);
  }

  function handleSelectedSTAnime(id) {
    const newAnime = summerAnimes.find((anime) => anime.mal_id === id) ||
                     topAiringAnime.find((anime) => anime.mal_id === id) ||
                     upcomingAnime.find((anime) => anime.mal_id === id)
    setSelectedSTAnime(newAnime);
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} handleSearch={handleSearch}>
          <NumResult animes={animes} />
        </Search>
      </Navbar>
      {animes.length > 0 && (
        <Main>
          <Box>
            <AnimeList animes={animes} onSelectedAnime={handleSelectedAnime} />
          </Box>
          <Box>
            {selectedAnime && <AnimeDetail anime={selectedAnime} />}
          </Box>
        </Main>
      )}
      <Main>
        <Box>
          <SummerAnimeList animes={summerAnimes} onSelectedAnime={handleSelectedSTAnime} />
        </Box>
        <Box>
          <TopAiringAnimeList animes={topAiringAnime} onSelectedAnime={handleSelectedSTAnime} />
        </Box>
        <Box>
          <UpcomingAnimeList animes={upcomingAnime} onSelectedAnime={handleSelectedSTAnime} />
        </Box>
        <Box>
          {selectedSTAnime && <AnimeDetail anime={selectedSTAnime} />}
        </Box>
        
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍥</span>
      <h1>RizzNime</h1>
      <span role="img">🍥</span>
    </div>
  );
}

function Search({ query, setQuery, handleSearch, children }) {
  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          className="search"
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {children}
    </div>
  );
}

function NumResult({ animes }) {
  return (
    <p className="search-results">
      Found <strong>{animes.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function SummerAnimeList({ animes, onSelectedAnime }) {
  return (
    <div className="summer-anime-list">
      <h2>Summer Anime 2024</h2>
      <ul className="list list-anime">
        {animes.map((anime) => (
          <Anime key={anime.mal_id} anime={anime} onSelectedAnime={onSelectedAnime} />
        ))}
      </ul>
    </div>
  );
}

function TopAiringAnimeList({ animes, onSelectedAnime }) {
  if (!animes || animes.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="top-airing-anime-list">
      <h2>Top Airing Anime</h2>
      <ul className="list list-anime">
        {animes.map((anime) => (
          <Anime key={anime.mal_id} anime={anime} onSelectedAnime={onSelectedAnime} />
        ))}
      </ul>
    </div>
  );
}

function UpcomingAnimeList({animes, onSelectedAnime}){
  if (!animes || animes.length === 0){
    return <p>Loading...</p>;
  }

  return (
    <div className='upcoming-anime-list'>
      <h2>Top Upcoming Anime</h2>
      <ul className='list list-anime'>
        {animes.map((anime) => (
        <Anime key={anime.mal_id} anime={anime} onSelectedAnime={onSelectedAnime} />
        ))}
      </ul>
    </div>
  )
}

function AnimeList({ animes, onSelectedAnime }) {
  return (
    <div className="anime-list">
      <h2>Hasil Pencarian</h2>
      <ul className="list list-anime">
        {animes?.map((anime) => (
          <Anime key={anime.mal_id} anime={anime} onSelectedAnime={onSelectedAnime} />
        ))}
      </ul>
    </div>
  );
}

function Anime({ anime, onSelectedAnime }) {
  return (
    <li onClick={() => onSelectedAnime(anime.mal_id)}>
      <img src={anime.images?.jpg?.image_url} alt={`${anime.title} cover`} />
      <h3>{anime.title}</h3>
      <div>
        <p>
          <span>{anime.aired?.prop?.from?.year || 'Unknown'}</span>
        </p>
      </div>
    </li>
  );
}

function AnimeDetail({ anime }) {
  if (!anime) return null;

  const imageUrl = anime.images?.jpg?.image_url;

  return (
    <div className="details">
      <header>
        {imageUrl ? (
          <img src={imageUrl} alt={`${anime.title} cover`} />
        ) : (
          <p>No image available</p>
        )}
        <div className="details-overview">
          <h2>{anime.title}</h2>
          <p>
            {anime.aired?.prop?.from?.year || 'Unknown year'} &bull; {anime.score || 'No score'}
          </p>
          <p>
            Genres: {anime.genres && anime.genres.length > 0 ? anime.genres.map((genre) => genre.name).join(', ') : 'Unknown'}
          </p>
          <p>
            Episodes: {anime.episodes || 'Unknown'}
          </p>
          <p>
            Themes: {anime.themes && anime.themes.length > 0 ? anime.themes.map((theme) => theme.name).join(', ') : 'Unknown'}
          </p>
        </div>
      </header>
      <section>
        <p>
          <em>{anime.synopsis || 'No synopsis available'}</em>
        </p>
      </section>
    </div>
  );
}