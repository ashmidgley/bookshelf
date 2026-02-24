namespace Bookshelf.Core
{
    public class EmailConfiguration : IEmailConfiguration
    {
        public string SendGridApiKey { get; set; }
        public string SenderName { get; set; }
        public string SenderAddress { get; set; }
        public string EmailTemplate { get; set; }
        public string SiteUrl { get; set; }
    }
}
