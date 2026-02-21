using NUnit.Framework;
using Bookshelf.Core;
using FakeItEasy;
using System;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class EmailHelperShould
    {
        [Test]
        public void SendEmail_OnCallToSendResetToken()
        {
            var emailConfiguration = A.Fake<IEmailConfiguration>();
            A.CallTo(() => emailConfiguration.SenderName).Returns("Mr. Test");
            A.CallTo(() => emailConfiguration.SenderAddress).Returns("test@test.com");
            A.CallTo(() => emailConfiguration.EmailTemplate).Returns("<div>Hi there, Here it is: {{resetToken}}. From Mr. Test</div>");

            var emailService = A.Fake<IEmailService>();
            var emailHelper = new EmailHelper(emailConfiguration, emailService);

            emailHelper.SendResetToken("test@test.com", "http://localhost:3000");

            A.CallTo(() => emailService.Send(A<EmailMessage>.Ignored)).MustHaveHappened();
        }

        [Test]
        public void ThrowException_WhenTemplateMissingReplacementKey()
        {
            var emailConfiguration = A.Fake<IEmailConfiguration>();
            A.CallTo(() => emailConfiguration.SenderName).Returns("Mr. Test");
            A.CallTo(() => emailConfiguration.SenderAddress).Returns("test@test.com");
            A.CallTo(() => emailConfiguration.EmailTemplate).Returns("<div>Hi there, uh oh we forgot the key! From Mr. Test</div>");

            var emailHelper = new EmailHelper(emailConfiguration, null);

            Assert.Throws<Exception>(() => emailHelper.SendResetToken("test@test.com", "http://localhost:3000"));
        }
    }
}