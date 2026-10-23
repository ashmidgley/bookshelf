using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public class SearchHelper : ISearchHelper
    {
        // Google Books returns many editions of the same book, so fetch its maximum page
        // and de-duplicate before trimming to the number of results the user asked for.
        public const int ResultPoolSize = 40;

        private readonly IQueryHelper _queryHelper;
        private readonly ISearchMapper _searchMapper;
        private readonly ISearchRunner _searchRunner;
        private readonly IOpenLibraryHelper _openLibrary;

        public SearchHelper(IQueryHelper queryHelper, ISearchMapper searchMapper, ISearchRunner searchRunner, IOpenLibraryHelper openLibrary)
        {
            _queryHelper = queryHelper;
            _searchMapper = searchMapper;
            _searchRunner = searchRunner;
            _openLibrary = openLibrary;
        }

        public async Task<IEnumerable<Book>> SearchBooks(SearchDto search)
        {
            var title = _queryHelper.Encode(search.Title);
            var author = _queryHelper.Encode(search.Author);
            var orderBy = _queryHelper.GetOrderBy(search.OrderBy);
            var url = _queryHelper.GetUrl(title, author, orderBy, ResultPoolSize);

            return await Search(url, () => _openLibrary.Search(search.Title, search.Author, orderBy, ResultPoolSize), search.MaxResults);
        }

        public async Task<IEnumerable<Book>> SearchBooksByTitle(SearchTitleDto search)
        {
            var title = _queryHelper.Encode(search.Title);
            var orderBy = _queryHelper.GetOrderBy(search.OrderBy);
            var url = _queryHelper.GetTitleUrl(title, orderBy, ResultPoolSize);

            return await Search(url, () => _openLibrary.Search(search.Title, null, orderBy, ResultPoolSize), search.MaxResults);
        }

        public async Task<IEnumerable<Book>> SearchBooksByAuthor(SearchAuthorDto search)
        {
            var author = _queryHelper.Encode(search.Author);
            var orderBy = _queryHelper.GetOrderBy(search.OrderBy);
            var url = _queryHelper.GetAuthorUrl(author, orderBy, ResultPoolSize);

            return await Search(url, () => _openLibrary.Search(null, search.Author, orderBy, ResultPoolSize), search.MaxResults);
        }

        private async Task<IEnumerable<Book>> Search(string url, Func<Task<IEnumerable<Book>>> fallback, int maxResults)
        {
            IEnumerable<Book> books = new List<Book>();
            var googleUnavailable = false;
            try
            {
                books = await SearchGoogle(url);
            }
            catch(SearchUnavailableException)
            {
                googleUnavailable = true;
            }

            if(!books.Any())
            {
                // Google Books has outages that outlast its retries, and sometimes misses
                // books entirely, so fall back to Open Library. Only report search as
                // unavailable when both are down.
                try
                {
                    books = await fallback();
                }
                catch(SearchUnavailableException) when (!googleUnavailable)
                {
                    // Google answered with no matches; keep that answer.
                }
            }

            return books
                .GroupBy(book => (book.Title?.ToLowerInvariant(), book.Author?.ToLowerInvariant()))
                .Select(editions => editions.First())
                .Take(maxResults)
                .ToList();
        }

        private async Task<IEnumerable<Book>> SearchGoogle(string url)
        {
            var results = await _searchRunner.PerformSearch(url);
            if(results?.Items == null || !results.Items.Any())
            {
                // Google Books intermittently returns no items for a query it matched
                // moments earlier, so try once more before reporting no results.
                results = await _searchRunner.PerformSearch(url);
            }

            return _searchMapper.MapBooks(results);
        }
    }
}
