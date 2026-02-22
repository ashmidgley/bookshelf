using System;
using Bookshelf.Core;
using FakeItEasy;
using NUnit.Framework;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class EmailServiceShould
    {
        [Test]
        public void ThrowException_WhenApiKeyMissing_OnCallToSend()
        {
            var recipient = new EmailAddress
            {
                Name = "",
                Address = ""
            };

            var sender = new EmailAddress
            {
                Name = "",
                Address = ""
            };

            var message = new EmailMessage
            {
                ToAddress = recipient,
                FromAddress = sender,
                Subject = "",
                Content = ""
            };

            var emailConfiguration = A.Fake<IEmailConfiguration>();
            A.CallTo(() => emailConfiguration.SendGridApiKey).Returns("");

            var service = new EmailService(emailConfiguration);

            Assert.Throws<Exception>(() => service.Send(message));
        }
    }
}
