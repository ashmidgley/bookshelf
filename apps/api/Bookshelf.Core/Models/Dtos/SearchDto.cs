namespace Bookshelf.Core
{
    public class SearchDto
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string OrderBy { get; set; }
        public int MaxResults { get; set; }
    }
}