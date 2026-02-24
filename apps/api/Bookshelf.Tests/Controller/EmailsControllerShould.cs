using System;
using System.Net;
using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

namespace Bookshelf.Core
{
    [TestFixture]
    public class EmailsControllerShould
    {
        [Test]
        public void ReturnOkResult_WhenValidUser_CallsSendResetToken()
        {
            var model = new PasswordResetDto
            {
                Email = "testing@bookshelf.com"
            };

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(model.Email)).Returns(true);

            var config = A.Fake<IEmailConfiguration>();
            var emailHelper = A.Fake<IEmailHelper>();

            var emailsController = new EmailsController(config, userRepository, emailHelper);

            var response = emailsController.SendResetToken(model);

            A.CallTo(() => userRepository.SetPasswordResetFields(A<int>.Ignored, A<Guid?>.Ignored, A<DateTime?>.Ignored)).MustHaveHappened();
            A.CallTo(() => emailHelper.SendResetToken(model.Email, A<string>.Ignored)).MustHaveHappened();
            Assert.AreEqual((int)HttpStatusCode.OK, ((OkResult)response).StatusCode);
        }

        [Test]
        public void ReturnBadRequest_WhenInvalidEmail_OnCallToSendResetToken()
        {
            var model = new PasswordResetDto
            {
                Email = "testing@bookshelf.com"
            };

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(model.Email)).Returns(false);

            var emailsController = new EmailsController(null, userRepository, null);

            var response = emailsController.SendResetToken(model);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response).StatusCode);
            Assert.AreEqual($"User with email {model.Email} does not exist.", ((BadRequestObjectResult)response).Value);
        }
    }
}