using System.Collections.Generic;

namespace Bookshelf.Core
{
    public interface ISearchMapper
    {
        IEnumerable<Book> MapBooks(GoogleBookSearchDto search);
        Book MapBook(VolumeInfo volume);
    }
}