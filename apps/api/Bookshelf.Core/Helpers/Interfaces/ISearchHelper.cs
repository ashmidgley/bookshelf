using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public interface ISearchHelper
    {
        Task<IEnumerable<Book>> SearchBooks(SearchDto search);
        Task<IEnumerable<Book>> SearchBooksByTitle(SearchTitleDto search);
        Task<IEnumerable<Book>> SearchBooksByAuthor(SearchAuthorDto search);
    }
}