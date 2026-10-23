using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bookshelf.Core
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        public const string UnavailableMessage = "Book search is temporarily unavailable. Please try again in a moment.";

        private readonly ISearchHelper _searchHelper;

        public SearchController(ISearchHelper searchHelper)
        {
            _searchHelper = searchHelper;
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Book>>> SearchBooks([FromBody] SearchDto search)
        {
            return await Search(() => _searchHelper.SearchBooks(search));
        }

        [HttpPost]
        [Route("title")]
        public async Task<ActionResult<IEnumerable<Book>>> SearchBooksByTitle([FromBody] SearchTitleDto search)
        {
            return await Search(() => _searchHelper.SearchBooksByTitle(search));
        }

        [HttpPost]
        [Route("author")]
        public async Task<ActionResult<IEnumerable<Book>>> SearchBooksByAuthor([FromBody] SearchAuthorDto search)
        {
            return await Search(() => _searchHelper.SearchBooksByAuthor(search));
        }

        private async Task<ActionResult<IEnumerable<Book>>> Search(Func<Task<IEnumerable<Book>>> search)
        {
            try
            {
                return Ok(await search());
            }
            catch(SearchUnavailableException)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, UnavailableMessage);
            }
        }
    }
}
