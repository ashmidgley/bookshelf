using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public class SearchService : ISearchService
    {
        private readonly HttpClient _client = new HttpClient();

        public async Task<GoogleBookSearchDto> Search(string url)
        {
            var json = await _client.GetStringAsync(url);
            return JsonSerializer.Deserialize<GoogleBookSearchDto>(json);
        }
    }
}