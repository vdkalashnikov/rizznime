export default function AnimeDetail({ anime }) {
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
              Synonyms : {anime.title_synonyms.join(',') || 'Unknown'}
            </p>
            <p>
            English Title : {anime.title_english || 'Unknown'}
          </p>
            <p>
             Ranked : #{anime.rank|| 'Unknown'} &bull; Popularity : #{anime.popularity || 'Unknown'}
            </p>
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
            <p>
              Duration: {anime.duration || 'Unknown'}
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