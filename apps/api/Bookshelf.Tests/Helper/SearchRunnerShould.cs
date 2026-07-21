using Bookshelf.Core;
using FakeItEasy;
using NUnit.Framework;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

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

        [TestCaseSource(nameof(UpstreamFailures))]
        public void DegradesToEmptyResult_WhenSearchServiceFails(Exception upstreamFailure)
        {
            var url = "http://testing.com/api";

            var searchService = A.Fake<ISearchService>();
            A.CallTo(() => searchService.Search(url)).ThrowsAsync(upstreamFailure);
            var subject = new SearchRunner(searchService);

            GoogleBookSearchDto result = null;
            Assert.DoesNotThrowAsync(async () => result = await subject.PerformSearch(url));
            Assert.That(result, Is.Not.Null);
        }

        // A flaky Google Books response (e.g. 503 backendFailed after retries are
        // exhausted), a timeout, or an unparseable body must not surface as a 500.
        private static readonly Exception[] UpstreamFailures =
        {
            new HttpRequestException("Response status code does not indicate success: 503 (Service Unavailable)."),
            new TaskCanceledException(),
            new JsonException()
        };
    }
}