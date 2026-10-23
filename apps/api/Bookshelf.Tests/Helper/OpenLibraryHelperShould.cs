using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Bookshelf.Core;
using FakeItEasy;
using NUnit.Framework;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class OpenLibraryHelperShould
    {
        private static OpenLibraryHelper Subject(IOpenLibraryService service = null)
        {
            var config = new OpenLibraryConfiguration
            {
                Url = "https://openlibrary.org",
                CoverUrl = "https://covers.openlibrary.org"
            };
            var googleConfig = new GoogleBooksConfiguration { DefaultCover = "default.png" };
            return new OpenLibraryHelper(service ?? A.Fake<IOpenLibraryService>(), config, googleConfig);
        }

        [Test]
        public void BuildTitleUrl()
        {
            var url = Subject().GetUrl("Project Hail Mary", null, "relevance", 40);

            Assert.AreEqual("https://openlibrary.org/search.json?title=Project+Hail+Mary&limit=40&fields=title,author_name,number_of_pages_median,cover_i", url);
        }

        [Test]
        public void BuildAuthorUrl_SortedByNewest()
        {
            var url = Subject().GetUrl(null, "Andy Weir", "newest", 10);

            Assert.AreEqual("https://openlibrary.org/search.json?author=Andy+Weir&sort=new&limit=10&fields=title,author_name,number_of_pages_median,cover_i", url);
        }

        [Test]
        public void MapDocsToBooks()
        {
            var search = new OpenLibrarySearchDto
            {
                Docs = new List<OpenLibraryDoc>
                {
                    new OpenLibraryDoc { Title = "Dune", AuthorNames = new[] { "Frank Herbert" }, PageCount = 604, CoverId = 12345 },
                    new OpenLibraryDoc { Title = "Untitled draft" },
                    new OpenLibraryDoc { Title = null }
                }
            };

            var result = Subject().MapBooks(search).ToList();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual("Frank Herbert", result[0].Author);
            Assert.AreEqual(604, result[0].PageCount);
            Assert.AreEqual("https://covers.openlibrary.org/b/id/12345-L.jpg", result[0].ImageUrl);
            Assert.AreEqual("Missing Author", result[1].Author);
            Assert.AreEqual(0, result[1].PageCount);
            Assert.AreEqual("default.png", result[1].ImageUrl);
        }

        [Test]
        public void RankBooksWithCoversFirst()
        {
            var search = new OpenLibrarySearchDto
            {
                Docs = new List<OpenLibraryDoc>
                {
                    new OpenLibraryDoc { Title = "Summary of Dune" },
                    new OpenLibraryDoc { Title = "Dune", CoverId = 1 },
                    new OpenLibraryDoc { Title = "Dune Messiah", CoverId = 2 }
                }
            };

            var result = Subject().MapBooks(search).Select(b => b.Title);

            Assert.That(result, Is.EqualTo(new[] { "Dune", "Dune Messiah", "Summary of Dune" }));
        }

        [Test]
        public void ReturnEmptyList_WhenDocsNull()
        {
            Assert.IsEmpty(Subject().MapBooks(new OpenLibrarySearchDto()));
        }

        [Test]
        public void ThrowUnavailable_WhenRequestFails()
        {
            var service = A.Fake<IOpenLibraryService>();
            A.CallTo(() => service.Search(A<string>.Ignored)).Throws(new HttpRequestException());

            Assert.ThrowsAsync<SearchUnavailableException>(() => Subject(service).Search("Dune", null, "relevance", 10));
        }
    }
}
