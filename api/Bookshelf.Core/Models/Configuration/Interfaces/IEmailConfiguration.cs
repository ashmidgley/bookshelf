namespace Bookshelf.Core
{
    public interface IEmailConfiguration
    {
        string SmtpServer { get; }
        int SmtpPort { get; }
        string SmtpUsername { get; set; }
        string SmtpPassword { get; set; }
        string SenderName { get; set; }
        string SenderAddress { get; set; }
        string EmailTemplate { get; set; }
        string SiteUrl { get; set; }
    }
}