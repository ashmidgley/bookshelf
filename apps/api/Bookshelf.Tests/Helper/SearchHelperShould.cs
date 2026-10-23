using NUnit.Framework;
using Bookshelf.Core;
using FakeItEasy;
using System.Collections.Generic;
using System.Linq;
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

        private static GoogleBookSearchDto WithItems()
        {
            return new GoogleBookSearchDto { Items = new[] { new Item() } };
        }

        [Test]
        public async Task RequestFullPoolFromGoogle_RegardlessOfMaxResults()
        {
            var search = new SearchTitleDto { Title = "Dark Age", OrderBy = "Relevance", MaxResults = 1 };

            var queryHelper = A.Fake<IQueryHelper>();
            var searchMapper = A.Fake<ISearchMapper>();
            var searchRunner = A.Fake<ISearchRunner>();
            var searchHelper = new SearchHelper(queryHelper, searchMapper, searchRunner);

            await searchHelper.SearchBooksByTitle(search);

            A.CallTo(() => queryHelper.GetTitleUrl(A<string>.Ignored, A<string>.Ignored, SearchHelper.ResultPoolSize)).MustHaveHappened();
        }

        [Test]
        public async Task CollapseEditions_AndTrimToMaxResults()
        {
            var search = new SearchTitleDto { Title = "Dark Age", OrderBy = "Relevance", MaxResults = 2 };
            var books = new List<Book>
            {
                new Book { Title = "Dark Age", Author = "Pierce Brown", PageCount = 1 },
                new Book { Title = "Dark age", Author = "Pierce Brown", PageCount = 2 },
                new Book { Title = "Golden Son", Author = "Pierce Brown" },
                new Book { Title = "Morning Star", Author = "Pierce Brown" }
            };

            var queryHelper = A.Fake<IQueryHelper>();
            var searchMapper = A.Fake<ISearchMapper>();
            var searchRunner = A.Fake<ISearchRunner>();
            A.CallTo(() => searchRunner.PerformSearch(A<string>.Ignored)).Returns(WithItems());
            A.CallTo(() => searchMapper.MapBooks(A<GoogleBookSearchDto>.Ignored)).Returns(books);
            var searchHelper = new SearchHelper(queryHelper, searchMapper, searchRunner);

            var result = (await searchHelper.SearchBooksByTitle(search)).ToList();

            Assert.That(result.Select(b => b.Title), Is.EqualTo(new[] { "Dark Age", "Golden Son" }));
            Assert.That(result[0].PageCount, Is.EqualTo(1));
        }

        [Test]
        public async Task RetryOnce_WhenGoogleReturnsNoItems()
        {
            var search = new SearchTitleDto { Title = "Dark Age", OrderBy = "Relevance", MaxResults = 5 };
            var retried = WithItems();

            var queryHelper = A.Fake<IQueryHelper>();
            var searchMapper = A.Fake<ISearchMapper>();
            var searchRunner = A.Fake<ISearchRunner>();
            A.CallTo(() => searchRunner.PerformSearch(A<string>.Ignored))
                .ReturnsNextFromSequence(new GoogleBookSearchDto(), retried);
            var searchHelper = new SearchHelper(queryHelper, searchMapper, searchRunner);

            await searchHelper.SearchBooksByTitle(search);

            A.CallTo(() => searchRunner.PerformSearch(A<string>.Ignored)).MustHaveHappenedTwiceExactly();
            A.CallTo(() => searchMapper.MapBooks(retried)).MustHaveHappened();
        }

        [Test]
        public async Task NotRetry_WhenGoogleReturnsItems()
        {
            var search = new SearchTitleDto { Title = "Dark Age", OrderBy = "Relevance", MaxResults = 5 };

            var queryHelper = A.Fake<IQueryHelper>();
            var searchMapper = A.Fake<ISearchMapper>();
            var searchRunner = A.Fake<ISearchRunner>();
            A.CallTo(() => searchRunner.PerformSearch(A<string>.Ignored)).Returns(WithItems());
            var searchHelper = new SearchHelper(queryHelper, searchMapper, searchRunner);

            await searchHelper.SearchBooksByTitle(search);

            A.CallTo(() => searchRunner.PerformSearch(A<string>.Ignored)).MustHaveHappenedOnceExactly();
        }
    }
}
