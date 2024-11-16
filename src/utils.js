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
