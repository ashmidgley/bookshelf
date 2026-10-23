using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Bookshelf.Core
{
    public class OpenLibraryService : IOpenLibraryService
    {
        private readonly HttpClient _client;

        public OpenLibraryService(HttpClient client)
        {
            _client = client;
        }

        public async Task<OpenLibrarySearchDto> Search(string url)
        {
            var json = await _client.GetStringAsync(url);
            return JsonSerializer.Deserialize<OpenLibrarySearchDto>(json);
        }
    }
}
