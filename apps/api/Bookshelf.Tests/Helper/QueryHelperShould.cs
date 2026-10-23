using Bookshelf.Core;
using NUnit.Framework;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class QueryHelperShould
    {
        [TestCase("Andy Weir", ExpectedResult = "andy+weir")]
        public string Encode(string input)
        {
            var subject = new QueryHelper(null);
            return subject.Encode(input);
        }

        [TestCase("Newest", ExpectedResult = "newest")]
        [TestCase("newest", ExpectedResult = "newest")]
        [TestCase("Relevance", ExpectedResult = "relevance")]
        [TestCase("Rrelevance", ExpectedResult = "relevance")]
        [TestCase("adggadgd", ExpectedResult = "relevance")]
        [TestCase(null, ExpectedResult = "relevance")]
        public string ReturnOrderBy_OnCallToGetOrderBy(string input)
        {
            var subject = new QueryHelper(null);
            return subject.GetOrderBy(input);
        }

        private static QueryHelper CreateSubject()
        {
            var config = new GoogleBooksConfiguration { Url = "https://books.test/v1", Key = "abc" };
            return new QueryHelper(config);
        }

        [Test]
        public void SendTitleAsPlainTerms_OnCallToGetUrl()
        {
            var url = CreateSubject().GetUrl("dark+age", "pierce+brown", "relevance", 40);
            Assert.That(url, Is.EqualTo("https://books.test/v1/volumes?q=dark+age+inauthor:pierce+brown&orderBy=relevance&maxResults=40&printType=books&langRestrict=en&key=abc"));
        }

        [Test]
        public void SendTitleAsPlainTerms_OnCallToGetTitleUrl()
        {
            var url = CreateSubject().GetTitleUrl("dark+age", "newest", 40);
            Assert.That(url, Is.EqualTo("https://books.test/v1/volumes?q=dark+age&orderBy=newest&maxResults=40&printType=books&langRestrict=en&key=abc"));
        }

        [Test]
        public void ScopeToAuthor_OnCallToGetAuthorUrl()
        {
            var url = CreateSubject().GetAuthorUrl("pierce+brown", "relevance", 40);
            Assert.That(url, Is.EqualTo("https://books.test/v1/volumes?q=inauthor:pierce+brown&orderBy=relevance&maxResults=40&printType=books&langRestrict=en&key=abc"));
        }
    }
}