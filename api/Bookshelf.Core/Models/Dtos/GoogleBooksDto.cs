using System.Text.Json.Serialization;

namespace Bookshelf.Core
{
    public class GoogleBooksDto
    {
        [JsonPropertyName("pageCount")]
        public int PageCount { get; set; }
        [JsonPropertyName("imageUrl")]
        public string ImageUrl { get; set; }
        [JsonPropertyName("summary")]
        public string Summary { get; set; }
    }
}