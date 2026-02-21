using System.Text.Json.Serialization;

namespace Bookshelf.Core
{
    public class DataFetcherDto
    {
        [JsonPropertyName("title")]
        public string Title { get; set; }
        [JsonPropertyName("author")]
        public string Author { get; set; }
        [JsonPropertyName("pageCount")]
        public int PageCount { get; set; }
        [JsonPropertyName("imageUrl")]
        public string ImageUrl { get; set; }
        [JsonPropertyName("summary")]
        public string Summary { get; set; }
    }
}