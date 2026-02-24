using System.Net;
using Bookshelf.Core;
using FakeItEasy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class UsersControllerShould
    {
        [Test]
        public void ReturnGetUser_WhenMatchingUser_CallsGetUser()
        {
            var userId = 1;
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, userId)).Returns(true);
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(false);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);

            var usersController = new UsersController(userRepository, userHelper, null);

            var response = usersController.GetUser(userId);

            A.CallTo(() => userRepository.GetUser(userId)).MustHaveHappened();
        }

        [Test]
        public void ReturnGetUser_WhenAdmin_CallsGetUser()
        {
            var userId = 1;
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, userId)).Returns(false);
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(true);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);

            var usersController = new UsersController(userRepository, userHelper, null);

            var response = usersController.GetUser(userId);

            A.CallTo(() => userRepository.GetUser(userId)).MustHaveHappened();
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsGetUser()
        {
            var userId = 1;
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, userId)).Returns(false);
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(false);

            var userRepository = A.Fake<IUserRepository>();

            var usersController = new UsersController(userRepository, userHelper, null);

            var response = usersController.GetUser(userId);

            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }

        [Test]
        public void ReturnBadRequest_WhenUserDoesNotExist_OnCallToGetUser()
        {
            var userId = 1;
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, userId)).Returns(false);
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(true);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(false);

            var usersController = new UsersController(userRepository, userHelper, null);

            var response = usersController.GetUser(userId);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {userId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnGetUsers_WhenAdmin_CallsGetUsers()
        {
            var queryOptions = new UserQueryOptions
            {
                Page = 1
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(true);

            var userRepository = A.Fake<IUserRepository>();
            var usersController = new UsersController(userRepository, userHelper, null);

            var response = usersController.GetUsers(queryOptions);

            A.CallTo(() => userRepository.GetUsers(queryOptions)).MustHaveHappenedOnceExactly();
            A.CallTo(() => userRepository.HasMore(queryOptions)).MustHaveHappenedOnceExactly();
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsGetUsers()
        {
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(false);

            var userRepository = A.Fake<IUserRepository>();

            var usersController = new UsersController(userRepository, userHelper, null);

            var response = usersController.GetUsers(null);

            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }

        [Test]
        public void ReturnsUserDto_WhenValidUser_CallsUpdateUser()
        {
            var updatedUser = new UserDto
            {
                Id = 1,
                Email = "test",
                IsAdmin = true
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(true);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(updatedUser.Id)).Returns(true);
            A.CallTo(() => userRepository.GetUser(updatedUser.Id)).Returns(updatedUser);

            var userDtoValidator = new UserDtoValidator();

            var userController = new UsersController(userRepository, userHelper, userDtoValidator);

            var response = userController.UpdateUser(updatedUser);

            A.CallTo(() => userRepository.Update(updatedUser)).MustHaveHappened();
            Assert.AreEqual(updatedUser, response.Value);
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsUpdateUser()
        {
            var updatedUser = new UserDto
            {
                Id = 1,
                Email = "test",
                IsAdmin = true
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(false);

            var userDtoValidator = new UserDtoValidator();

            var userController = new UsersController(null, userHelper, userDtoValidator);

            var response = userController.UpdateUser(updatedUser);

            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }

        [Test]
        public void ReturnsBadRequest_WhenUserDoesNotExist_OnCallToUpdateUser()
        {
            var updatedUser = new UserDto
            {
                Id = 1,
                Email = "test",
                IsAdmin = true
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(true);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(updatedUser.Id)).Returns(false);

            var userDtoValidator = new UserDtoValidator();

            var userController = new UsersController(userRepository, userHelper, userDtoValidator);

            var response = userController.UpdateUser(updatedUser);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {updatedUser.Id} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void CallGetUser_WhenValidUser_CallsUpdateEmail()
        {
            var userId = 1;
            var updatedUser = new UserUpdateDto
            {
                Email = "test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.GetUserId(A<HttpContext>.Ignored)).Returns(userId);
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, userId)).Returns(true);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(updatedUser.Email)).Returns(false);

            var userController = new UsersController(userRepository, userHelper, null);

            var response = userController.UpdateEmail(updatedUser);

            A.CallTo(() => userRepository.Update(A<UserDto>.Ignored)).MustHaveHappened();
            A.CallTo(() => userRepository.GetUser(userId)).MustHaveHappenedTwiceExactly();
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsUpdateEmail()
        {
            var updatedUser = new UserUpdateDto
            {
                Email = "test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, A<int>.Ignored)).Returns(false);

            var userController = new UsersController(null, userHelper, null);

            var response = userController.UpdateEmail(updatedUser);

            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }

        [Test]
        public void ReturnBadRequest_WhenExistingEmail_OnCallToUpdateEmail()
        {
            var updatedUser = new UserUpdateDto
            {
                Email = "existing@bookshelf.com"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, A<int>.Ignored)).Returns(true);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(updatedUser.Email)).Returns(true);

            var userController = new UsersController(userRepository, userHelper, null);

            var response = userController.UpdateEmail(updatedUser);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Email {updatedUser.Email} is already in use.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void CallGetUser_WhenValidUser_CallsUpdatePassword()
        {
            var userId = 1;
            var updatedUser = new UserUpdateDto
            {
                Password = "test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.GetUserId(A<HttpContext>.Ignored)).Returns(userId);
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, userId)).Returns(true);

            var userRepository = A.Fake<IUserRepository>();

            var userController = new UsersController(userRepository, userHelper, null);

            var response = userController.UpdatePassword(updatedUser);

            A.CallTo(() => userRepository.UpdatePasswordHash(userId, A<string>.Ignored)).MustHaveHappened();
            A.CallTo(() => userRepository.GetUser(userId)).MustHaveHappened();
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsUpdatePassword()
        {
            var updatedUser = new UserUpdateDto
            {
                Password = "test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, A<int>.Ignored)).Returns(false);

            var userController = new UsersController(null, userHelper, null);

            var response = userController.UpdatePassword(updatedUser);

            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }

        [Test]
        public void CallGetUser_WhenAdmin_CallsDeleteUser()
        {
            var userId = 1;

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(true);
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, userId)).Returns(false);

            var userController = new UsersController(userRepository, userHelper, null);

            var response = userController.DeleteUser(userId);

            A.CallTo(() => userHelper.DeleteUser(userId)).MustHaveHappened();
            A.CallTo(() => userRepository.GetUser(userId)).MustHaveHappened();
        }

        [Test]
        public void CallGetUser_WhenMatchingUser_CallsDeleteUser()
        {
            var userId = 1;

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(false);
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, userId)).Returns(true);

            var userController = new UsersController(userRepository, userHelper, null);

            var response = userController.DeleteUser(userId);

            A.CallTo(() => userHelper.DeleteUser(userId)).MustHaveHappened();
            A.CallTo(() => userRepository.GetUser(userId)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenUserDoesNotExist_OnCallToDeleteUser()
        {
            var userId = 1;

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(false);

            var userController = new UsersController(userRepository, null, null);

            var response = userController.DeleteUser(userId);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {userId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsDeleteUser()
        {
            var userId = 1;

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.IsAdmin(A<HttpContext>.Ignored)).Returns(false);
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, userId)).Returns(false);

            var userController = new UsersController(userRepository, userHelper, null);

            var response = userController.DeleteUser(userId);

            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }
    }
}