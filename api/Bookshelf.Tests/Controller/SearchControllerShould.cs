using Bookshelf.Core;
using FakeItEasy;
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
    }
}