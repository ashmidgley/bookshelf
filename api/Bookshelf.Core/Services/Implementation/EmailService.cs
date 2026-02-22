using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Bookshelf.Core
{
    public class EmailService : IEmailService
    {
        private readonly IEmailConfiguration _emailConfiguration;

        public EmailService(IEmailConfiguration emailConfiguration)
        {
            _emailConfiguration = emailConfiguration;
        }

        public void Send(EmailMessage emailMessage)
        {
            if (string.IsNullOrWhiteSpace(_emailConfiguration.SendGridApiKey))
            {
                throw new Exception("SendGrid API key missing.");
            }

            var payload = new
            {
                personalizations = new[]
                {
                    new
                    {
                        to = new[]
                        {
                            new
                            {
                                email = emailMessage.ToAddress.Address,
                                name = emailMessage.ToAddress.Name
                            }
                        }
                    }
                },
                from = new
                {
                    email = emailMessage.FromAddress.Address,
                    name = emailMessage.FromAddress.Name
                },
                subject = emailMessage.Subject,
                content = new[]
                {
                    new
                    {
                        type = "text/html",
                        value = emailMessage.Content
                    }
                }
            };

            using (var emailClient = new HttpClient())
            using (var request = new HttpRequestMessage(HttpMethod.Post, "https://api.sendgrid.com/v3/mail/send"))
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _emailConfiguration.SendGridApiKey);
                request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                var response = emailClient.SendAsync(request).GetAwaiter().GetResult();
                if (!response.IsSuccessStatusCode)
                {
                    var responseBody = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    throw new Exception($"SendGrid request failed with status code {(int)response.StatusCode}: {responseBody}");
                }
            }
        }
    }
}
