import Anime from "./Anime"
export default function AnimeList({ title ,animes, onSelectedAnime }) {

    if (!animes || animes.length === 0){
      return <div id="loading"><div className="loading-wave">
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
    </div></div>
    }
    return (
      <div className="anime-list">
        <h2>{title}</h2>
        <ul className="list list-anime">
          {animes?.map((anime, index) => (
            <Anime key={index} anime={anime} onSelectedAnime={onSelectedAnime} />
          ))}
        </ul>
      </div>
    )
  }