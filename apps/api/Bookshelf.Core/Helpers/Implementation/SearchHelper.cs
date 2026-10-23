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

        public SearchHelper(IQueryHelper queryHelper, ISearchMapper searchMapper, ISearchRunner searchRunner)
        {
            _queryHelper = queryHelper;
            _searchMapper = searchMapper;
            _searchRunner = searchRunner;
        }

        public async Task<IEnumerable<Book>> SearchBooks(SearchDto search)
        {
            var title = _queryHelper.Encode(search.Title);
            var author = _queryHelper.Encode(search.Author);
            var orderBy = _queryHelper.GetOrderBy(search.OrderBy);
            var url = _queryHelper.GetUrl(title, author, orderBy, ResultPoolSize);

            return await Search(url, search.MaxResults);
        }

        public async Task<IEnumerable<Book>> SearchBooksByTitle(SearchTitleDto search)
        {
            var title = _queryHelper.Encode(search.Title);
            var orderBy = _queryHelper.GetOrderBy(search.OrderBy);
            var url = _queryHelper.GetTitleUrl(title, orderBy, ResultPoolSize);

            return await Search(url, search.MaxResults);
        }

        public async Task<IEnumerable<Book>> SearchBooksByAuthor(SearchAuthorDto search)
        {
            var author = _queryHelper.Encode(search.Author);
            var orderBy = _queryHelper.GetOrderBy(search.OrderBy);
            var url = _queryHelper.GetAuthorUrl(author, orderBy, ResultPoolSize);

            return await Search(url, search.MaxResults);
        }

        private async Task<IEnumerable<Book>> Search(string url, int maxResults)
        {
            var results = await _searchRunner.PerformSearch(url);
            if(results?.Items == null || !results.Items.Any())
            {
                // Google Books intermittently returns no items for a query it matched
                // moments earlier, so try once more before reporting no results.
                results = await _searchRunner.PerformSearch(url);
            }

            return _searchMapper.MapBooks(results)
                .GroupBy(book => (book.Title?.ToLowerInvariant(), book.Author?.ToLowerInvariant()))
                .Select(editions => editions.First())
                .Take(maxResults)
                .ToList();
        }
    }
}
