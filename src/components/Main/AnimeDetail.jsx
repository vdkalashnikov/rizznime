
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
          <p>Synonyms: {anime.title_synonyms.join(',') || 'Unknown'}</p>
          <p>English Title: {anime.title_english || 'Unknown'}</p>
          <p>
            Ranked: #{anime.rank || 'Unknown'} &bull; Popularity: #{anime.popularity || 'Unknown'}
          </p>
          <p>
            {anime.aired?.prop?.from?.year || 'Unknown year'} &bull; {anime.score || 'No score'}
          </p>
          <p>
            Genres: {anime.genres && anime.genres.length > 0 ? anime.genres.map((genre) => genre.name).join(', ') : 'Unknown'}
          </p>
          <p>Episodes: {anime.episodes || 'Unknown'}</p>
          <p>Themes: {anime.themes.map((theme) => theme.name).join(', ') || 'Unknown'}</p>
          <p>Duration: {anime.duration || 'Unknown'}</p>
        </div>
      </header>
      <section>
        <p><em>{anime.synopsis || 'No synopsis available'}</em></p>
      </section>
      {anime.characters && anime.characters.length > 0 && (
        <section>
          <h3>Characters and Voice Actors</h3>
          <ul>
            {anime.characters.map((char) => (
              <>
              <li key={char.character.mal_id}>
                {char.character.name.replace(',', '')} - {char.voice_actors.length > 0
                  ? char.voice_actors.find(va => va.language === 'Japanese')?.person.name.replace(',', '') || 'Unknown'
                  : 'No voice actor info'}
              </li>
              <div className="modal-img">
              <img style={{width : "40px"}} src={char.character.images.jpg.image_url} alt="" />
              
              {char.voice_actors.length > 0 && char.voice_actors !== 'Unknown' ? ( <>
                <h5>-</h5>
              <img style={{width : "40px"}} src={char.voice_actors.find(va => va.language === 'Japanese')?.person.images.jpg.image_url} alt="" /> </> ) : ''}
              </div>
              
              </>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}