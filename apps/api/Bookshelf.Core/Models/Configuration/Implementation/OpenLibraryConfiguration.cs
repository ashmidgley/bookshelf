namespace Bookshelf.Core
{
    public class OpenLibraryConfiguration : IOpenLibraryConfiguration
    {
        public string Url { get; set; }
        public string CoverUrl { get; set; }
        public string UserAgent { get; set; }
    }
}
