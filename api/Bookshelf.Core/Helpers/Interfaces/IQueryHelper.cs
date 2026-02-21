namespace Bookshelf.Core
{
    public interface IQueryHelper
    {
        string Encode(string input);
        string GetOrderBy(string input);
        string GetUrl(string title, string author, string orderBy, int maxResults);
        string GetTitleUrl(string title, string orderBy, int maxResults);
        string GetAuthorUrl(string author, string orderBy, int maxResults);
    }
}