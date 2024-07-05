import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Nav/Navbar';
import Search from './components/Nav/Search';
import NumResult from './components/Nav/NumResult';
import Main from './components/Main/Main';

const apiUrl = 'https://api.jikan.moe/v4/anime';

export default function App() {
  const [animes, setAnimes] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [query, setQuery] = useState('');
  const [summerAnimes, setSummerAnimes] = useState([]);
  
  const [topAiringAnime, setTopAiringAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([])
  

  useEffect(() => {
    async function fetchAllData() {
      await retryFetch(fetchSummerAnimes);
      await delay(2000);  // Jeda 2 detik sebelum fetch berikutnya
      await retryFetch(fetchTopAiringAnime);
      await delay(2000);  // Jeda 2 detik sebelum fetch berikutnya
      await retryFetch(fetchUpcomingAnime);
    }
    fetchAllData();
  }, []);
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function retryFetch(fetchFunction, retryCount = 5, retryDelay = 1000) {
    let attempt = 0;
    while (attempt < retryCount) {
      try {
        await fetchFunction();
        return;
      } catch (error) {
        console.error(`Error fetching data, attempt ${attempt + 1}:`, error);
        attempt++;
        if (attempt < retryCount) {
          const exponentialDelay = retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, exponentialDelay));
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

  
  async function fetchAllAnimeData() {
    const results = await Promise.allSettled([
      retryFetch(fetchSummerAnimes),
      retryFetch(fetchTopAiringAnime),
      retryFetch(fetchUpcomingAnime)
    ]);
  
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Fetch ${index + 1} succeeded`);
      } else {
        console.error(`Fetch ${index + 1} failed:`, result.reason);
      }
    });
  }
  
  useEffect(() => {
    fetchAllAnimeData();
  }, []);
  
  async function fetchSummerAnimes() {
    try {
      const response = await fetch('https://api.jikan.moe/v4/seasons/2024/summer');
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      if (data.data) {
        setSummerAnimes(data.data);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error fetching summer animes:', error);
    }
  }
  
  async function fetchTopAiringAnime() {
    try {
      const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing');
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      if (data.data) {
        setTopAiringAnime(data.data);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error fetching top airing anime:', error);
    }
  }
  
  async function fetchUpcomingAnime() {
    try {
      const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=upcoming');
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      if (data.data) {
        setUpcomingAnime(data.data);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error fetching upcoming anime:', error);
    }
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
    const modal = new bootstrap.Modal(document.getElementById('animeDetailModal'));
    modal.show();
  }

  function handleSelectedSTAnime(id) {
    const newAnime = summerAnimes.find((anime) => anime.mal_id === id) ||
                     topAiringAnime.find((anime) => anime.mal_id === id) ||
                     upcomingAnime.find((anime) => anime.mal_id === id)
    setSelectedAnime(newAnime);
    const modal = new bootstrap.Modal(document.getElementById('animeDetailModal'));
    modal.show();
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
          {selectedAnime && (
          <ModalBox >
            <AnimeDetail anime={selectedAnime} />
          </ModalBox>
        )}
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
        {selectedAnime && (
          <ModalBox >
            <AnimeDetail anime={selectedAnime} />
          </ModalBox>
        )}
      </Main>
    </>
  );
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
function ModalBox({ children }) {
  return (
    <div className="modal fade" id="animeDetailModal" tabIndex="-1" aria-labelledby="animeDetailModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="animeDetailModalLabel">Anime Details</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummerAnimeList({ animes, onSelectedAnime }) {
  if (!animes || animes.length === 0) {
    return <div id="loading"><div className="loading-wave">
    <div className="loading-bar"></div>
    <div className="loading-bar"></div>
    <div className="loading-bar"></div>
    <div className="loading-bar"></div>
  </div></div>
  }

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
    return <div id="loading"><div className="loading-wave">
    <div className="loading-bar"></div>
    <div className="loading-bar"></div>
    <div className="loading-bar"></div>
    <div className="loading-bar"></div>
  </div></div>
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
    return <div id="loading"><div className="loading-wave">
    <div className="loading-bar"></div>
    <div className="loading-bar"></div>
    <div className="loading-bar"></div>
    <div className="loading-bar"></div>
  </div></div>
  ;
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
            Themes: {anime.themes.map((theme) => theme.name).join(', ') || 'Unknown'}
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