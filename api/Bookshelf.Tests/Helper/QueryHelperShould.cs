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
    }
}