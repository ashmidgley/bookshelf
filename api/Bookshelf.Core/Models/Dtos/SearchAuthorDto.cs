namespace Bookshelf.Core
{
    public class SearchAuthorDto
    {
        public string Author { get; set; }
        public string OrderBy { get; set; }
        public int MaxResults { get; set; }
    }
}