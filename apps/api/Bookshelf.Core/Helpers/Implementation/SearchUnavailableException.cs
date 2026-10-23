using System;

namespace Bookshelf.Core
{
    public class SearchUnavailableException : Exception
    {
        public SearchUnavailableException(Exception innerException)
            : base("Google Books is unavailable.", innerException)
        {
        }
    }
}
