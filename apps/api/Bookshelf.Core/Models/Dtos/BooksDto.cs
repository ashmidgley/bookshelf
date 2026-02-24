using System.Collections.Generic;

namespace Bookshelf.Core
{
    public class BooksDto
    {
        public IEnumerable<BookDto> Books { get; set; }
        public bool HasMore { get; set; }
    }
}