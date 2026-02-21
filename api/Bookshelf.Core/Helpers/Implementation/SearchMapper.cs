using System.Collections.Generic;
using System.Linq;

namespace Bookshelf.Core
{
    public class SearchMapper : ISearchMapper
    {
        private readonly IGoogleBooksConfiguration _config;

        public SearchMapper(IGoogleBooksConfiguration config)
        {
            _config = config;
        }

        public IEnumerable<Book> MapBooks(GoogleBookSearchDto search)
        {
            if(search.Items == null || search.Items.Count() == 0)
            {
                return new List<Book>();
            }

            var books = new List<Book>();
            foreach(var item in search.Items)
            {
                var book = MapBook(item.VolumeInfo);
                books.Add(book);
            }

            return books;
        }

        public Book MapBook(VolumeInfo volume)
        {
            var author = volume.Authors != null && volume.Authors.Length > 0 ? volume.Authors[0] : "Missing Author";
            var imageUrl = volume.ImageLinks?.Thumbnail?.Replace("http", "https") ?? _config.DefaultCover;

            return new Book
            {
                Title =  volume.Title,
                Author = author,
                PageCount = volume.PageCount,
                Summary = volume.Description,
                ImageUrl = imageUrl
            };
        }
    }
}