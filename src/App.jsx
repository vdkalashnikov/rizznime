import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Nav/Navbar";
import Search from "./components/Nav/Search";
import NumResult from "./components/Nav/NumResult";
import Main from "./components/Main/Main";
import ModalBox from "./components/Main/ModalBox";
import Box from "./components/Main/Box";
import AnimeDetail from "./components/Main/AnimeDetail";
import AnimeList from "./components/Main/AnimeList";
import FirstMain from "./components/Main/FirstMain";

const apiUrl = "https://api.jikan.moe/v4/anime";

export default function App() {
  const [animes, setAnimes] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [query, setQuery] = useState("");
  const [summerAnimes, setSummerAnimes] = useState([]);
  const [topAiringAnime, setTopAiringAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [mostPopularAnime, setMostPopularAnime] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      await retryFetch(() => fetchDataAnime(apiSummer, setSummerAnimes));
      await delay(1200);
      await retryFetch(() => fetchDataAnime(apiTop, setTopAiringAnime));
      await delay(1200);
      await retryFetch(() => fetchDataAnime(apiUpcoming, setUpcomingAnime));
      await delay(1200);
      await retryFetch(() => fetchDataAnime(apiPopular, setMostPopularAnime));
    }
    fetchAllData();
  }, []);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
          await new Promise((resolve) => setTimeout(resolve, exponentialDelay));
        }
      }
    }
    console.error("Failed to fetch data after multiple attempts");
  }

  async function fetchAnimes(searchQuery) {
    try {
      const response = await fetch(`${apiUrl}?q=${searchQuery}`);
      const data = await response.json();
      if (data.data) {
        const animePromises = data.data.map(async (anime) => {
          const characters = await fetchAnimeCharacters(anime.mal_id);
          return { ...anime, characters };
        });
        const animeWithCharacters = await Promise.all(animePromises);
        setAnimes(animeWithCharacters);
      } else {
        throw new Error("Invalid data structure");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchAllAnimeData() {
    const results = await Promise.allSettled([
      retryFetch(() => fetchDataAnime(apiSummer, setSummerAnimes)),
      retryFetch(() => fetchDataAnime(apiTop, setTopAiringAnime)),
      retryFetch(() => fetchDataAnime(apiUpcoming, setUpcomingAnime)),
      retryFetch(() => fetchDataAnime(apiPopular, setMostPopularAnime)),
    ]);

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`Fetch ${index + 1} succeeded`);
      } else {
        console.error(`Fetch ${index + 1} failed:`, result.reason);
      }
    });
  }

  useEffect(() => {
    fetchAllAnimeData();
  }, []);

  const apiSummer = 'https://api.jikan.moe/v4/seasons/2024/summer'
  const apiTop = 'https://api.jikan.moe/v4/top/anime?filter=airing'
  const apiUpcoming = 'https://api.jikan.moe/v4/top/anime?filter=upcoming'
  const apiPopular = 'https://api.jikan.moe/v4/top/anime?filter=bypopularity'

  async function fetchSummerAnimes() {
    try {
      const response = await fetch(
        "https://api.jikan.moe/v4/seasons/2024/summer"
      );
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      // if (data.data) {
      //   const animePromises = data.data.map(async (anime) => {
      //     const characters = await fetchAnimeCharacters(anime.mal_id);
      //     return { ...anime, characters };
      //   });
      //   const animeWithCharacters = await Promise.all(animePromises);
      //   setSummerAnimes(animeWithCharacters);
      // } else {
      //   throw new Error('Invalid data structure');
      // }
      setSummerAnimes(data.data);
    } catch (error) {
      console.error("Error fetching summer animes:", error);
    }
  }

  const fetchDataAnime = async (api, setData) => {
    try {
      const response = await fetch(api)
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`)
      }
      const data = await response.json()
      setData(data.data)
    } catch (err) {
      console.error('Error fetching: ', err)
    }
  }

  async function fetchTopAiringAnime() {
    try {
      const response = await fetch(
        "https://api.jikan.moe/v4/top/anime?filter=airing"
      );
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      setTopAiringAnime(data.data);
    } catch (error) {
      console.error("Error fetching top airing anime:", error);
    }
  }

  async function fetchUpcomingAnime() {
    try {
      const response = await fetch(
        "https://api.jikan.moe/v4/top/anime?filter=upcoming"
      );
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      setUpcomingAnime(data.data);
    } catch (error) {
      console.error("Error fetching upcoming anime:", error);
    }
  }

  async function fetchMostPopularAnime() {
    try {
      const response = await fetch(
        "https://api.jikan.moe/v4/top/anime?filter=bypopularity"
      );
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      setMostPopularAnime(data.data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching upcoming anime:", error);
    }
  }

  async function fetchAnimeCharacters(malId) {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${malId}/characters`
      );
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching characters for anime ${malId}:`, error);
      return null;
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

  useEffect(() => {
    if (!query.trim()) {
      setAnimes([]);
    }
  }, [query]);

  function handleSelectedAnime(id) {
    const newAnime = animes.find((anime) => anime.mal_id === id);
    setSelectedAnime(newAnime);
    const modal = new bootstrap.Modal(
      document.getElementById("animeDetailModal")
    );
    modal.show();
  }

  async function handleSelectedSTAnime(id) {
    const newAnime =
      summerAnimes.find((anime) => anime.mal_id === id) ||
      topAiringAnime.find((anime) => anime.mal_id === id) ||
      upcomingAnime.find((anime) => anime.mal_id === id) ||
      mostPopularAnime.find((anime) => anime.mal_id === id);
    const response = await fetchAnimeCharacters(id);
    console.log(response);
    if (response.length > 0) {
      const animeWithCharacters = { ...newAnime, characters: response };
      setSelectedAnime(animeWithCharacters);
      const modal = new bootstrap.Modal(
        document.getElementById("animeDetailModal")
      );
      modal.show();
    }
  }

  useEffect(() => console.log(selectedAnime), [selectedAnime]);

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} handleSearch={handleSearch}>
          <NumResult animes={animes} />
        </Search>
      </Navbar>
      {animes.length > 0 && (
        <FirstMain>
          <Box>
            <AnimeList
              title="Search Result"
              animes={animes}
              onSelectedAnime={handleSelectedAnime}
            />
          </Box>
          {selectedAnime && (
            <ModalBox>
              <AnimeDetail anime={selectedAnime} />
            </ModalBox>
          )}
        </FirstMain>
      )}
      <Main>
        <Box>
          <AnimeList
            title="Summer Anime"
            animes={summerAnimes}
            onSelectedAnime={handleSelectedSTAnime}
          />
        </Box>
        <Box>
          <AnimeList
            title="Top Airing Anime"
            animes={topAiringAnime}
            onSelectedAnime={handleSelectedSTAnime}
          />
        </Box>
        <Box>
          <AnimeList
            title="Upcoming Anime"
            animes={upcomingAnime}
            onSelectedAnime={handleSelectedSTAnime}
          />
        </Box>
        <Box>
          <AnimeList
            title="Most Popular Anime"
            animes={mostPopularAnime}
            onSelectedAnime={handleSelectedSTAnime}
          />
        </Box>
        {selectedAnime && (
          <ModalBox>
            <AnimeDetail anime={selectedAnime} />
          </ModalBox>
        )}
      </Main>
    </>
  );
}

// function SummerAnimeList({ animes, onSelectedAnime }) {
//   if (!animes || animes.length === 0) {
//     return <div id="loading"><div className="loading-wave">
//     <div className="loading-bar"></div>
//     <div className="loading-bar"></div>
//     <div className="loading-bar"></div>
//     <div className="loading-bar"></div>
//   </div></div>
//   }

//   return (
//     <div className="summer-anime-list">
//       <h2>Summer Anime 2024</h2>
//       <ul className="list list-anime">
//         {animes.map((anime) => (
//           <Anime key={anime.mal_id} anime={anime} onSelectedAnime={onSelectedAnime} />
//         ))}
//       </ul>
//     </div>
//   );
// }
