using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Bookshelf.Core
{
    public class GoogleBookSearchDto
    {
        [JsonPropertyName("totalItems")]
        public int TotalItems { get; set; }
        [JsonPropertyName("items")]
        public IEnumerable<Item> Items { get; set; }
    }

    public class Item
    {
        [JsonPropertyName("id")]
        public string VolumeId { get; set; }
        [JsonPropertyName("volumeInfo")]
        public VolumeInfo VolumeInfo { get; set; }
    }

    public class VolumeInfo
    {
        [JsonPropertyName("title")]
        public string Title { get; set; }
        [JsonPropertyName("subtitle")]
        public string Subtitle { get; set; }
        [JsonPropertyName("authors")]
        public string[] Authors { get; set; }
        [JsonPropertyName("pageCount")]
        public int PageCount { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("imageLinks")]
        public ImageLink ImageLinks { get; set; }
    }

    public class ImageLink
    {
        [JsonPropertyName("thumbnail")]
        public string Thumbnail { get; set; }
    }
}