namespace Bookshelf.Core
{
    public class SearchTitleDto
    {
        public string Title { get; set; }
        public string OrderBy { get; set; }
        public int MaxResults { get; set; }
    }
}