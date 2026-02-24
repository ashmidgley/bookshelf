using System;

namespace Bookshelf.Core
{
    public class BookDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public int RatingId { get; set; }
        public string ImageUrl { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public DateTime FinishedOn { get; set; }
        public int Year { get; set; }
        public int PageCount { get; set; }
        public string Summary { get; set; }
    }
}