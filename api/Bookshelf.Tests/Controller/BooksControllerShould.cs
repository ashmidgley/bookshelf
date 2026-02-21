using NUnit.Framework;
using Bookshelf.Core;
using System;
using FakeItEasy;
using Microsoft.AspNetCore.Http;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class BooksControllerShould
    {
        [Test]
        public void ReturnGetBook_WhenBookExists_OnCallToGetBook()
        {
            var bookId = 1;
            var bookRepository = A.Fake<IBookRepository>();
            A.CallTo(() => bookRepository.BookExists(bookId)).Returns(true);
            var controller = new BooksController(bookRepository, null, null, null, null);
            
            var response = controller.GetBook(bookId);
            
            A.CallTo(() => bookRepository.GetBook(bookId)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenBookDoesNotExist_OnCallToGetBook()
        {
            var bookId = 1;
            var bookRepository = A.Fake<IBookRepository>();
            A.CallTo(() => bookRepository.BookExists(bookId)).Returns(false);
            var controller = new BooksController(bookRepository, null, null, null, null);
            
            var response = controller.GetBook(bookId);
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Book with Id {bookId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnGetUserBooks_WhenUserExists_OnCallToGetCurrentUserBooks()
        {
            var userId = 1;
            var queryOptions = new BookQueryOptions
            {
                Page = 0
            };

            var bookRepository = A.Fake<IBookRepository>();
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.GetUserId(A<HttpContext>.Ignored)).Returns(userId);
            
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(A<int>.Ignored)).Returns(true);
            
            var controller = new BooksController(bookRepository, userRepository, userHelper, null, null);
            var response = controller.GetCurrentUserBooks(queryOptions);
            
            A.CallTo(() => bookRepository.GetUserBooks(userId, queryOptions)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenUserDoesNotExist_OnCallToGetCurrentUserBooks()
        {
            var userId = 1;
            var bookRepository = A.Fake<IBookRepository>();
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.GetUserId(A<HttpContext>.Ignored)).Returns(userId);
            
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(false);
           
            var controller = new BooksController(bookRepository, userRepository, userHelper, null, null);
            var response = controller.GetCurrentUserBooks(null);
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {userId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnGetUserBooks_WhenUserExists_OnCallToGetUserBooks()
        {
            var userId = 1;
            var queryOptions = new BookQueryOptions
            {
                Page = 0
            };

            var bookRepository = A.Fake<IBookRepository>();
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);
            var controller = new BooksController(bookRepository, userRepository, null, null, null);
            
            var response = controller.GetUserBooks(userId, queryOptions);
            
            A.CallTo(() => bookRepository.GetUserBooks(userId, queryOptions)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenUserDoesNotExist_OnCallToGetUserBooks()
        {
            var userId = 1;
            var bookRepository = A.Fake<IBookRepository>();
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(false);
            var controller = new BooksController(bookRepository, userRepository, null, null, null);
            
            var response = controller.GetUserBooks(userId, null);
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {userId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnBookDto_OnCallToAddBook()
        {
            var newBook = new Book
            {
                CategoryId = 2,
                RatingId = 1,
                ImageUrl = "test.png",
                Title = "Test",
                Author = "Test",
                FinishedOn = DateTime.Now,
                PageCount = 0
            };

            var result = new BookDto
            {
                UserId = newBook.UserId
            };

            var userHelper = A.Fake<IUserHelper>();
            var bookRepository = A.Fake<IBookRepository>();
            A.CallTo(() => bookRepository.GetBook(A<int>.Ignored)).Returns(result);

            var newBookValidator = new NewBookValidator();
            var controller = new BooksController(bookRepository, null, userHelper, newBookValidator, null);

            var response = controller.AddBook(newBook);

            A.CallTo(() => bookRepository.Add(newBook)).MustHaveHappened();
            Assert.AreEqual(result.UserId, response.Value.UserId);
        }

        [Test]
        public void ReturnBookDto_WhenValidUser_CallsUpdateBook()
        {
            var updatedBook = new BookDto
            {
                Id = 1,
                UserId = 1,
                CategoryId = 2,
                RatingId = 1,
                Title = "Test",
                Author = "Test",
                FinishedOn = DateTime.Now,
                ImageUrl = "test.png",
                Year = 2019,
                PageCount = 111
            };

            var result = new BookDto
            {
                Id = updatedBook.Id
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, updatedBook.UserId)).Returns(true);

            var bookRepository = A.Fake<IBookRepository>();
            A.CallTo(() => bookRepository.BookExists(updatedBook.Id)).Returns(true);
            A.CallTo(() => bookRepository.GetBook(updatedBook.Id)).Returns(result);
           
            var updatedBookValidator = new UpdatedBookValidator();

            var controller = new BooksController(bookRepository, null, userHelper, null, updatedBookValidator);

            var response = controller.UpdateBook(updatedBook);

            A.CallTo(() => bookRepository.Update(A<BookDto>.Ignored)).MustHaveHappened();
            Assert.AreEqual(result.Id, response.Value.Id);
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsUpdateBook()
        {
            var updatedBook = new BookDto
            {
                Id = 1,
                UserId = 1,
                CategoryId = 2,
                RatingId = 1,
                Title = "Test",
                Author = "Test",
                FinishedOn = DateTime.Now,
                ImageUrl = "test.png",
                Year = 2019,
                PageCount = 111,
                Summary = "test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, updatedBook.UserId)).Returns(false);

            var updatedBookValidator = new UpdatedBookValidator();

            var controller = new BooksController(null, null, userHelper, null, updatedBookValidator);

            var response = controller.UpdateBook(updatedBook);

            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }

        [Test]
        public void ReturnBadRequest_WhenBookDoesNotExist_OnCallToUpdateBook()
        {
            var updatedBook = new BookDto
            {
                Id = 1,
                UserId = 1,
                CategoryId = 2,
                RatingId = 1,
                Title = "Test",
                Author = "Test",
                FinishedOn = DateTime.Now,
                ImageUrl = "test.png",
                Year = 2019,
                PageCount = 111,
                Summary = "test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, updatedBook.UserId)).Returns(true);

            var bookRepository = A.Fake<IBookRepository>();
            A.CallTo(() => bookRepository.BookExists(updatedBook.Id)).Returns(false);
           
            var updatedBookValidator = new UpdatedBookValidator();

            var controller = new BooksController(bookRepository, null, userHelper, null, updatedBookValidator);

            var response = controller.UpdateBook(updatedBook);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Book with Id {updatedBook.Id} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnBookDto_WhenValidUser_CallsDeleteBook()
        {
            var id = 1;
            
            var result = new BookDto
            {
                Id = id,
                UserId = 1
            };

            var bookRepository = A.Fake<IBookRepository>();
            A.CallTo(() => bookRepository.BookExists(id)).Returns(true);
            A.CallTo(() => bookRepository.GetBook(id)).Returns(result);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, result.UserId)).Returns(true);

            var controller = new BooksController(bookRepository, null, userHelper,null, null);

            var response = controller.DeleteBook(id);
            
            A.CallTo(() => bookRepository.Delete(id)).MustHaveHappened();
            Assert.AreEqual(result.Id, response.Value.Id);
        }

        [Test]
        public void ReturnBadRequest_WhenBookDoesNotExist_OnCallToDeleteBook()
        {
            var id = 1;

            var bookRepository = A.Fake<IBookRepository>();
            A.CallTo(() => bookRepository.BookExists(id)).Returns(false);

            var controller = new BooksController(bookRepository, null, null, null, null);

            var response = controller.DeleteBook(id);
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Book with Id {id} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsDeleteBook()
        {
            var id = 1;
            
            var result = new BookDto
            {
                Id = id,
                UserId = 1
            };

            var bookRepository = A.Fake<IBookRepository>();
            A.CallTo(() => bookRepository.BookExists(id)).Returns(true);
            A.CallTo(() => bookRepository.GetBook(id)).Returns(result);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, result.UserId)).Returns(false);

            var controller = new BooksController(bookRepository, null, userHelper, null, null);

            var response = controller.DeleteBook(id);
            
            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }
    }
}