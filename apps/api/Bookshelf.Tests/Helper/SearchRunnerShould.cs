using Bookshelf.Core;
using FakeItEasy;
using NUnit.Framework;
using System;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class SearchRunnerShould
    {
        [Test]
        public void DoesNotThrow_WhenSearchServiceThrowsNullReferenceException()
        {
            var url = "http://testing.com/api";

            var searchService = A.Fake<ISearchService>();
            A.CallTo(() => searchService.Search(url)).ThrowsAsync(new NullReferenceException());
            var subject = new SearchRunner(searchService);

            Assert.DoesNotThrowAsync(() => subject.PerformSearch(url));
        }
    }
}