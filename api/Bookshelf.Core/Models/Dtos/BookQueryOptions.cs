namespace Bookshelf.Core
{
    public class BookQueryOptions
    {
        public string Search { get; set; }
        public int? Category { get; set; }
        public int? Rating { get; set; }
        public int Page { get; set; }
        public int? EntriesPerPage { get; set; }
    }
}