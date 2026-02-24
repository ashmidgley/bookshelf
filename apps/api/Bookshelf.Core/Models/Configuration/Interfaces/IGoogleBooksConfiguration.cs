namespace Bookshelf.Core
{
    public interface IGoogleBooksConfiguration
    {
        string Key { get; set; }
        string Url { get; set; }
        string DefaultCover { get; set; }
    }
}