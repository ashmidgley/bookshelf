using System;
using System.Net;
using Bookshelf.Core;
using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class AuthControllerShould
    {
        [Test]
        public void ReturnToken_WhenAuthorizedUser_CallsLogin()
        {
            var login = new LoginDto
            {
                Email = "test@gmail.com",
                Password = "test"
            };

            var token = "test";

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(login.Email)).Returns(true);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.PasswordsMatch(login.Password, A<string>.Ignored, null)).Returns(true);
            A.CallTo(() => userHelper.BuildToken(A<UserDto>.Ignored)).Returns(token);

            var loginDtoValidator = new LoginDtoValidator();

            var controller = new AuthController(userRepository, userHelper, loginDtoValidator);

            var response = controller.Login(login);

            Assert.AreEqual(token, response.Value);
        }

        [Test]
        public void ReturnError_WhenUnauthorizedEmail_OnCallToLogin()
        {
            var login = new LoginDto
            {
                Email = "test@gmail.com",
                Password = "test"
            };

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(login.Email)).Returns(false);

            var loginDtoValidator = new LoginDtoValidator();

            var controller = new AuthController(userRepository, null, loginDtoValidator);

            var response = controller.Login(login);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Incorrect email address. Please try again.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnError_WhenPasswordDoesNotMatch_OnCallToLogin()
        {
            var login = new LoginDto
            {
                Email = "test@gmail.com",
                Password = "test"
            };

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(login.Email)).Returns(true);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.PasswordsMatch(login.Password, A<string>.Ignored, null)).Returns(false);

            var loginDtoValidator = new LoginDtoValidator();

            var controller = new AuthController(userRepository, userHelper, loginDtoValidator);

            var response = controller.Login(login);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Incorrect password. Please try again.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnToken_WhenCorrectRegisterModel_OnCallToRegister()
        {
            var register = new LoginDto
            {
                Email = "test@gmail.com",
                Password = "test"
            };

            var token = "test";

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(A<string>.Ignored)).Returns(false);
            
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.BuildToken(A<UserDto>.Ignored)).Returns(token);

            var loginDtoValidator = new LoginDtoValidator();

            var controller = new AuthController(userRepository, userHelper, loginDtoValidator);

            var response = controller.Register(register);

            A.CallTo(() => userRepository.Add(A<User>.Ignored)).MustHaveHappened();
            A.CallTo(() => userHelper.Register(A<int>.Ignored)).MustHaveHappened();
            Assert.AreEqual(token, response.Value);
        }

        [Test]
        public void ReturnError_WhenUsernameAlreadyExists_OnCallToRegister()
        {
            var register = new LoginDto
            {
                Email = "test@gmail.com",
                Password = "test"
            };

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(A<string>.Ignored)).Returns(true);

            var loginDtoValidator = new LoginDtoValidator();

            var controller = new AuthController(userRepository, null, loginDtoValidator);

            var response = controller.Register(register);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual("Email already in use. Please try another.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnTrue_WhenValidToken_OnCallToResetTokenValid()
        {
            var userId = 1;
            var token = Guid.NewGuid();
            
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);
            
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.ValidResetToken(A<UserDto>.Ignored, token)).Returns(true);

            var controller = new AuthController(userRepository, userHelper, null);

            var response = controller.ResetTokenValid(userId, token);

            Assert.IsTrue(response.Value);
        }

        [Test]
        public void ReturnBadRequest_WhenInvalidUser_OnCallToResetTokenValid()
        {
            var userId = 1;
            var token = Guid.NewGuid();
            
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(false);

            var controller = new AuthController(userRepository, null, null);

            var response = controller.ResetTokenValid(userId, token);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {userId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnFalse_WhenInvalidToken_OnCallToResetTokenValid()
        {
            var userId = 1;
            var token = Guid.NewGuid();
            
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);
            
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.ValidResetToken(A<UserDto>.Ignored, token)).Returns(false);

            var controller = new AuthController(userRepository, userHelper, null);

            var response = controller.ResetTokenValid(userId, token);

            Assert.IsFalse(response.Value);
        }

        [Test]
        public void ReturnUserDto_WhenResetTokenValid_OnCallToUpdatePasswordUsingToken()
        {
            var model = new ResetTokenUpdateDto 
            {
                UserId = 1,
                Token = Guid.NewGuid(),
                Password = "test"
            };
            
            var user = new UserDto
            {
                Id = 1
            };

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(model.UserId)).Returns(true);
            A.CallTo(() => userRepository.GetUser(model.UserId)).Returns(user);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.ValidResetToken(user, model.Token)).Returns(true);

            var controller = new AuthController(userRepository, userHelper, null);

            var response = controller.UpdatePasswordUsingToken(model);

            A.CallTo(() => userRepository.UpdatePasswordHash(model.UserId, A<string>.Ignored)).MustHaveHappened();
            A.CallTo(() => userRepository.SetPasswordResetFields(model.UserId, null, null)).MustHaveHappened();
            Assert.AreEqual(model.UserId, response.Value.Id);
        }

        [Test]
        public void ReturnBadRequest_WhenUserNotPresent_OnCallToUpdatePasswordUsingToken()
        {
            var model = new ResetTokenUpdateDto 
            {
                UserId = 1,
                Token = Guid.NewGuid(),
                Password = "test"
            };

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(model.UserId)).Returns(false);

            var controller = new AuthController(userRepository, null, null);

            var response = controller.UpdatePasswordUsingToken(model);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {model.UserId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnBadRequest_WhenTokenInvalid_OnCallToUpdatePasswordUsingToken()
        {
            var model = new ResetTokenUpdateDto 
            {
                UserId = 1,
                Token = Guid.NewGuid(),
                Password = "test"
            };

            var user = new UserDto
            {
                Id = 1
            };

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(model.UserId)).Returns(true);
            A.CallTo(() => userRepository.GetUser(model.UserId)).Returns(user);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.ValidResetToken(user, model.Token)).Returns(false);

            var controller = new AuthController(userRepository, userHelper, null);

            var response = controller.UpdatePasswordUsingToken(model);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual("Password reset token is not valid.", ((BadRequestObjectResult)response.Result).Value);
        }
    }
}