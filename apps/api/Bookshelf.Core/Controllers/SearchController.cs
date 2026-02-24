using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bookshelf.Core
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchHelper _searchHelper;

        public SearchController(ISearchHelper searchHelper)
        {
            _searchHelper = searchHelper;
        }

        [HttpPost]
        public async Task<IEnumerable<Book>> SearchBooks([FromBody] SearchDto search)
        {
            return await _searchHelper.SearchBooks(search);
        }

        [HttpPost]
        [Route("title")]
        public async Task<IEnumerable<Book>> SearchBooksByTitle([FromBody] SearchTitleDto search)
        {
            return await _searchHelper.SearchBooksByTitle(search);
        }

        [HttpPost]
        [Route("author")]
        public async Task<IEnumerable<Book>> SearchBooksByAuthor([FromBody] SearchAuthorDto search)
        {
            return await _searchHelper.SearchBooksByAuthor(search);
        }
    }
}