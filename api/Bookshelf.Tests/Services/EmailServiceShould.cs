using Bookshelf.Core;
using FakeItEasy;
using NUnit.Framework;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class EmailServiceShould
    {
        [Test]
        [Explicit]
        public void SendEmail_OnCallToSend()
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
            A.CallTo(() => emailConfiguration.SmtpServer).Returns("");
            A.CallTo(() => emailConfiguration.SmtpPort).Returns(0);
            A.CallTo(() => emailConfiguration.SmtpUsername).Returns("");
            A.CallTo(() => emailConfiguration.SmtpPassword).Returns("");

            var service = new EmailService(emailConfiguration);
            service.Send(message);
            
            Assert.Pass();
        }
    }
}