using System.Web;

namespace Bookshelf.Core
{
    public class QueryHelper : IQueryHelper
    {
        // Google Books' intitle: operator returns no results when combined with any other
        // term, so titles are sent as plain search words. inauthor: works, but only unquoted.
        private const string Filters = "printType=books&langRestrict=en";

        private readonly IGoogleBooksConfiguration _config;

        public QueryHelper(IGoogleBooksConfiguration config)
        {
            _config = config;
        }

        public string Encode(string input)
        {
            return HttpUtility.UrlEncode(input.ToLower());
        }

        public string GetOrderBy(string input)
        {
            if(input != null && input.ToLower().Equals("newest"))
            {
                return "newest";
            }

            return "relevance";
        }

        public string GetUrl(string title, string author, string orderBy, int maxResults)
        {
            return $"{_config.Url}/volumes?q={title}+inauthor:{author}&orderBy={orderBy}&maxResults={maxResults}&{Filters}&key={_config.Key}";
        }

        public string GetTitleUrl(string title, string orderBy, int maxResults)
        {
            return $"{_config.Url}/volumes?q={title}&orderBy={orderBy}&maxResults={maxResults}&{Filters}&key={_config.Key}";
        }

        public string GetAuthorUrl(string author, string orderBy, int maxResults)
        {
            return $"{_config.Url}/volumes?q=inauthor:{author}&orderBy={orderBy}&maxResults={maxResults}&{Filters}&key={_config.Key}";
        }
    }
}