using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;

namespace Bookshelf.Core
{
    // Fallback book search against Open Library (https://openlibrary.org/developers/api),
    // used when Google Books is down or finds nothing. Open Library has no summaries in
    // its search results, so books found here come back without one.
    public class OpenLibraryHelper : IOpenLibraryHelper
    {
        private const string Fields = "title,author_name,number_of_pages_median,cover_i";

        private readonly IOpenLibraryService _service;
        private readonly IOpenLibraryConfiguration _config;
        private readonly IGoogleBooksConfiguration _googleConfig;

        public OpenLibraryHelper(IOpenLibraryService service, IOpenLibraryConfiguration config, IGoogleBooksConfiguration googleConfig)
        {
            _service = service;
            _config = config;
            _googleConfig = googleConfig;
        }

        public async Task<IEnumerable<Book>> Search(string title, string author, string orderBy, int limit)
        {
            try
            {
                var result = await _service.Search(GetUrl(title, author, orderBy, limit));
                return MapBooks(result);
            }
            catch(Exception ex) when (ex is HttpRequestException || ex is TaskCanceledException || ex is JsonException)
            {
                throw new SearchUnavailableException(ex);
            }
        }

        public string GetUrl(string title, string author, string orderBy, int limit)
        {
            var query = new List<string>();
            if(!string.IsNullOrWhiteSpace(title))
            {
                query.Add($"title={HttpUtility.UrlEncode(title)}");
            }
            if(!string.IsNullOrWhiteSpace(author))
            {
                query.Add($"author={HttpUtility.UrlEncode(author)}");
            }
            if(orderBy == "newest")
            {
                query.Add("sort=new");
            }
            query.Add($"limit={limit}");
            query.Add($"fields={Fields}");

            return $"{_config.Url}/search.json?{string.Join("&", query)}";
        }

        public IEnumerable<Book> MapBooks(OpenLibrarySearchDto search)
        {
            if(search?.Docs == null)
            {
                return new List<Book>();
            }

            // Coverless results are mostly study guides and summaries of the real book,
            // so rank books with a cover first (OrderBy is stable, keeping relevance order).
            return search.Docs
                .Where(doc => !string.IsNullOrWhiteSpace(doc.Title))
                .OrderBy(doc => doc.CoverId.HasValue ? 0 : 1)
                .Select(doc => new Book
                {
                    Title = doc.Title,
                    Author = doc.AuthorNames != null && doc.AuthorNames.Length > 0 ? doc.AuthorNames[0] : "Missing Author",
                    PageCount = doc.PageCount ?? 0,
                    ImageUrl = doc.CoverId.HasValue
                        ? $"{_config.CoverUrl}/b/id/{doc.CoverId.Value}-L.jpg"
                        : _googleConfig.DefaultCover
                })
                .ToList();
        }
    }
}
