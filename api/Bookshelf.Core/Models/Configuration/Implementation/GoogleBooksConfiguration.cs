namespace Bookshelf.Core
{
    public class GoogleBooksConfiguration : IGoogleBooksConfiguration
    {
        public string Key { get; set; }
        public string Url { get; set; }
        public string DefaultCover { get; set; }
    }
}