using System;

namespace Bookshelf.Core
{
    public class EmailHelper : IEmailHelper
    {
        private IEmailConfiguration _emailConfiguration;
        private IEmailService _emailService;

        public EmailHelper(IEmailConfiguration emailConfiguration, IEmailService emailService)
        {
            _emailConfiguration = emailConfiguration;
            _emailService = emailService;
        }

        public void SendResetToken(string toAddress, string resetLink)
        {
            var recipient = new EmailAddress
            {
                Name = toAddress,
                Address = toAddress
            };

            var sender = new EmailAddress
            {
                Name = _emailConfiguration.SenderName,
                Address = _emailConfiguration.SenderAddress
            };

            var replacementKey = "{{resetToken}}";
            if(!_emailConfiguration.EmailTemplate.Contains(replacementKey))
            {
                throw new Exception("Email template missing replacement key.");
            }
            
            var emailMessage = new EmailMessage
            {
                ToAddress = recipient,
                FromAddress = sender,
                Subject = "Password Reset Request",
                Content = _emailConfiguration.EmailTemplate.Replace(replacementKey, resetLink)
            };

            _emailService.Send(emailMessage);
        }
    }
}