using System;
using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public class SearchRunner : ISearchRunner
    {
        private readonly ISearchService _searchService;

        public SearchRunner(ISearchService searchService)
        {
            _searchService = searchService;
        }

        public async Task<GoogleBookSearchDto> PerformSearch(string url)
        {
            try
            {
                var result = await _searchService.Search(url);
                return result;
            }
            catch(NullReferenceException)
            {
                // No books to deserialize from google books search.
                return new GoogleBookSearchDto();
            }
        }
    }
}