using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Bookshelf.Core
{
    public class OpenLibrarySearchDto
    {
        [JsonPropertyName("numFound")]
        public int NumFound { get; set; }
        [JsonPropertyName("docs")]
        public IEnumerable<OpenLibraryDoc> Docs { get; set; }
    }

    public class OpenLibraryDoc
    {
        [JsonPropertyName("title")]
        public string Title { get; set; }
        [JsonPropertyName("author_name")]
        public string[] AuthorNames { get; set; }
        [JsonPropertyName("number_of_pages_median")]
        public int? PageCount { get; set; }
        [JsonPropertyName("cover_i")]
        public long? CoverId { get; set; }
    }
}
