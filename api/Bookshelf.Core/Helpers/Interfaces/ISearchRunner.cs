using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public interface ISearchRunner
    {
        Task<GoogleBookSearchDto> PerformSearch(string url);
    }
}