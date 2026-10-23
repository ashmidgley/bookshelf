namespace Bookshelf.Core
{
    public interface IOpenLibraryConfiguration
    {
        string Url { get; set; }
        string CoverUrl { get; set; }
        string UserAgent { get; set; }
    }
}
