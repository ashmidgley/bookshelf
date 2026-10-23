using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public interface IOpenLibraryHelper
    {
        Task<IEnumerable<Book>> Search(string title, string author, string orderBy, int limit);
        string GetUrl(string title, string author, string orderBy, int limit);
        IEnumerable<Book> MapBooks(OpenLibrarySearchDto search);
    }
}
