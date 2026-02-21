namespace Bookshelf.Core
{
    public class EmailConfiguration : IEmailConfiguration
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string SenderName { get; set; }
        public string SenderAddress { get; set; }
        public string EmailTemplate { get; set; }
        public string SiteUrl { get; set; }
    }
}