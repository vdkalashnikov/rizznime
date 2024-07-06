export default function Anime({ anime, onSelectedAnime }) {
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