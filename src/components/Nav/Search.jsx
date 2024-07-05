export default function Search({ query, setQuery, handleSearch, children }) {
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