using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public interface ISearchService
    {
        Task<GoogleBookSearchDto> Search(string url);
    }
}