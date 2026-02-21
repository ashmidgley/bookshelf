using NUnit.Framework;
using Bookshelf.Core;
using FakeItEasy;
using System.Threading.Tasks;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class SearchHelperShould
    {
        [Test]
        public async Task CallDependencies_OnCallToSearchBooks()
        {
            var search = new SearchDto
            {
                Title = "The Martian",
                Author = "Andy Weir",
                OrderBy = "Relevance",
                MaxResults = 1
            };

            var queryHelper = A.Fake<IQueryHelper>();
            var searchMapper = A.Fake<ISearchMapper>();
            var searchRunner = A.Fake<ISearchRunner>();
            var searchHelper = new SearchHelper(queryHelper, searchMapper, searchRunner);

            var result = await searchHelper.SearchBooks(search);

            A.CallTo(() => queryHelper.Encode(search.Title)).MustHaveHappened();
            A.CallTo(() => queryHelper.Encode(search.Author)).MustHaveHappened();
            A.CallTo(() => queryHelper.GetOrderBy(search.OrderBy)).MustHaveHappened();
            A.CallTo(() => searchRunner.PerformSearch(A<string>.Ignored)).MustHaveHappened();
            A.CallTo(() => searchMapper.MapBooks(A<GoogleBookSearchDto>.Ignored)).MustHaveHappened();
        }

        [Test]
        public async Task CallDependencies_OnCallToSearchBooksByTitle()
        {
            var search = new SearchTitleDto
            {
                Title = "The Martian",
                OrderBy = "Relevance",
                MaxResults = 1
            };

            var queryHelper = A.Fake<IQueryHelper>();
            var searchMapper = A.Fake<ISearchMapper>();
            var searchRunner = A.Fake<ISearchRunner>();
            var searchHelper = new SearchHelper(queryHelper, searchMapper, searchRunner);

            var result = await searchHelper.SearchBooksByTitle(search);

            A.CallTo(() => queryHelper.Encode(search.Title)).MustHaveHappened();
            A.CallTo(() => queryHelper.GetOrderBy(search.OrderBy)).MustHaveHappened();
            A.CallTo(() => searchRunner.PerformSearch(A<string>.Ignored)).MustHaveHappened();
            A.CallTo(() => searchMapper.MapBooks(A<GoogleBookSearchDto>.Ignored)).MustHaveHappened();
        }

        [Test]
        public async Task CallDependencies_OnCallToSearchBooksByAuthor()
        {
            var search = new SearchAuthorDto
            {
                Author = "Andy Weir",
                OrderBy = "Relevance",
                MaxResults = 1
            };

            var queryHelper = A.Fake<IQueryHelper>();
            var searchMapper = A.Fake<ISearchMapper>();
            var searchRunner = A.Fake<ISearchRunner>();
            var searchHelper = new SearchHelper(queryHelper, searchMapper, searchRunner);

            var result = await searchHelper.SearchBooksByAuthor(search);

            A.CallTo(() => queryHelper.Encode(search.Author)).MustHaveHappened();
            A.CallTo(() => queryHelper.GetOrderBy(search.OrderBy)).MustHaveHappened();
            A.CallTo(() => searchRunner.PerformSearch(A<string>.Ignored)).MustHaveHappened();
            A.CallTo(() => searchMapper.MapBooks(A<GoogleBookSearchDto>.Ignored)).MustHaveHappened();
        }
    }
}