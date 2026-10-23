using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public interface IOpenLibraryService
    {
        Task<OpenLibrarySearchDto> Search(string url);
    }
}
