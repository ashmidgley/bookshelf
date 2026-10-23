using System.Collections.Generic;
using System.Threading.Tasks;
using Bookshelf.Core;
using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class SearchControllerShould
    {
        [Test]
        public void CallSearchHelper_OnCallToSearchBooks()
        {
            var search = new SearchDto
            {
                Title = "title",
                Author = "author",
                OrderBy = "Newest",
                MaxResults = 5
            };

            var searchHelper = A.Fake<ISearchHelper>();
            var controller = new SearchController(searchHelper);
            var result = controller.SearchBooks(search);
            A.CallTo(() => searchHelper.SearchBooks(search)).MustHaveHappened();
        }

        [Test]
        public void CallSearchHelper_OnCallToSearchBooksByTitle()
        {
            var search = new SearchTitleDto
            {
                Title = "title",
                OrderBy = "Newest",
                MaxResults = 5
            };

            var searchHelper = A.Fake<ISearchHelper>();
            var controller = new SearchController(searchHelper);
            var result = controller.SearchBooksByTitle(search);
            A.CallTo(() => searchHelper.SearchBooksByTitle(search)).MustHaveHappened();
        }

        [Test]
        public void CallSearchHelper_OnCallToSearchBooksByAuthor()
        {
            var search = new SearchAuthorDto
            {
                Author = "author",
                OrderBy = "Newest",
                MaxResults = 5
            };

            var searchHelper = A.Fake<ISearchHelper>();
            var controller = new SearchController(searchHelper);
            var result = controller.SearchBooksByAuthor(search);
            A.CallTo(() => searchHelper.SearchBooksByAuthor(search)).MustHaveHappened();
        }

        [Test]
        public async Task Return503_WhenSearchIsUnavailable()
        {
            var search = new SearchTitleDto { Title = "title", OrderBy = "Newest", MaxResults = 5 };

            var searchHelper = A.Fake<ISearchHelper>();
            A.CallTo(() => searchHelper.SearchBooksByTitle(search))
                .ThrowsAsync(new SearchUnavailableException(new System.Net.Http.HttpRequestException()));
            var controller = new SearchController(searchHelper);

            var result = await controller.SearchBooksByTitle(search);

            var objectResult = result.Result as ObjectResult;
            Assert.That(objectResult, Is.Not.Null);
            Assert.That(objectResult.StatusCode, Is.EqualTo(503));
            Assert.That(objectResult.Value, Is.EqualTo(SearchController.UnavailableMessage));
        }

        [Test]
        public async Task ReturnBooks_WhenSearchSucceeds()
        {
            var search = new SearchTitleDto { Title = "title", OrderBy = "Newest", MaxResults = 5 };
            var books = new List<Book> { new Book { Title = "Dark Age", Author = "Pierce Brown" } };

            var searchHelper = A.Fake<ISearchHelper>();
            A.CallTo(() => searchHelper.SearchBooksByTitle(search)).Returns(books);
            var controller = new SearchController(searchHelper);

            var result = await controller.SearchBooksByTitle(search);

            Assert.That((result.Result as OkObjectResult)?.Value, Is.SameAs(books));
        }
    }
}
