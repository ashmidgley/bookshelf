using System.Collections.Generic;
using System.Linq;
using Bookshelf.Core;
using FakeItEasy;
using NUnit.Framework;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class SearchMapperShould
    {
        [Test]
        public void ReturnEmptyList_WhenSearchItemsEmpty()
        {
            var search = new GoogleBookSearchDto
            {
                Items = new List<Item>()
            };

            var subject = new SearchMapper(null);
            var result = subject.MapBooks(search);

            Assert.AreEqual(0, result.Count());
        }

        [Test]
        public void ReturnEmptyList_WhenSearchItemsNull()
        {
            var search = new GoogleBookSearchDto();

            var subject = new SearchMapper(null);
            var result = subject.MapBooks(search);

            Assert.AreEqual(0, result.Count());
        }

        [Test]
        public void ReturnMissingAuthor_WhenAuthorsNull_OnCallToMapBook()
        {
            var volume = new VolumeInfo();

            var config = A.Fake<IGoogleBooksConfiguration>();
            var subject = new SearchMapper(config);

            var result = subject.MapBook(volume);

            Assert.AreEqual("Missing Author", result.Author);
        }

        [Test]
        public void ReturnMissingAuthor_WhenAuthorsEmpty_OnCallToMapBook()
        {
            var volume = new VolumeInfo
            {
                Authors = new string[0]
            };

            var config = A.Fake<IGoogleBooksConfiguration>();
            var subject = new SearchMapper(config);

            var result = subject.MapBook(volume);

            Assert.AreEqual("Missing Author", result.Author);
        }

        [Test]
        public void ReturnDefaultCover_WhenImageLinksNull_OnCallToMapBook()
        {
            var volume = new VolumeInfo();

            var defaultCover = "default.png";
            var config = A.Fake<IGoogleBooksConfiguration>();
            A.CallTo(() => config.DefaultCover).Returns(defaultCover);
            var subject = new SearchMapper(config);

            var result = subject.MapBook(volume);

            Assert.AreEqual(defaultCover, result.ImageUrl);
        }

        [Test]
        public void ReturnDefaultCover_WhenThumbnailNull_OnCallToMapBook()
        {
            var volume = new VolumeInfo
            {
                ImageLinks = new ImageLink()
            };

            var defaultCover = "default.png";
            var config = A.Fake<IGoogleBooksConfiguration>();
            A.CallTo(() => config.DefaultCover).Returns(defaultCover);
            var subject = new SearchMapper(config);

            var result = subject.MapBook(volume);

            Assert.AreEqual(defaultCover, result.ImageUrl);
        }

        [Test]
        public void ReturnThumbnail_WhenThumbnailValid_OnCallToMapBook()
        {
            var thumbnail = "thumbnail.png";
            var volume = new VolumeInfo
            {
                ImageLinks = new ImageLink
                {
                    Thumbnail = thumbnail
                }
            };

            var defaultCover = "default.png";
            var config = A.Fake<IGoogleBooksConfiguration>();
            A.CallTo(() => config.DefaultCover).Returns(defaultCover);
            var subject = new SearchMapper(config);

            var result = subject.MapBook(volume);

            Assert.AreEqual(thumbnail, result.ImageUrl);
        }
    }
}