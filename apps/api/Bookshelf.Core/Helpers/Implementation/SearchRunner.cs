using System;
using System.Net.Http;
using System.Text.Json;
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
            catch(Exception ex) when (ex is HttpRequestException || ex is TaskCanceledException || ex is JsonException)
            {
                // Google Books is unavailable, throttling, or returned an unparseable
                // response (after retries are exhausted). Surface it as a distinct failure
                // so the client can tell "search is down" apart from "no matches".
                throw new SearchUnavailableException(ex);
            }
        }
    }
}