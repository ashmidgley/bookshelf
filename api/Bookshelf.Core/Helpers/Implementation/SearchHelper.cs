using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public class SearchHelper : ISearchHelper
    {
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
            var url = _queryHelper.GetUrl(title, author, orderBy, search.MaxResults);

            var results = await _searchRunner.PerformSearch(url);
            return _searchMapper.MapBooks(results);
        }

        public async Task<IEnumerable<Book>> SearchBooksByTitle(SearchTitleDto search)
        {
            var title = _queryHelper.Encode(search.Title);
            var orderBy = _queryHelper.GetOrderBy(search.OrderBy);
            var url = _queryHelper.GetTitleUrl(title, orderBy, search.MaxResults);

            var results = await _searchRunner.PerformSearch(url);
            return _searchMapper.MapBooks(results);
        }

        public async Task<IEnumerable<Book>> SearchBooksByAuthor(SearchAuthorDto search)
        {
            var author = _queryHelper.Encode(search.Author);
            var orderBy = _queryHelper.GetOrderBy(search.OrderBy);
            var url = _queryHelper.GetAuthorUrl(author, orderBy, search.MaxResults);

            var result = await _searchRunner.PerformSearch(url);
            return _searchMapper.MapBooks(result);
        }
    }
}