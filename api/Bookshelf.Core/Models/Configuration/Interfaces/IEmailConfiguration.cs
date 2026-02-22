namespace Bookshelf.Core
{
    public interface IEmailConfiguration
    {
        string SendGridApiKey { get; set; }
        string SenderName { get; set; }
        string SenderAddress { get; set; }
        string EmailTemplate { get; set; }
        string SiteUrl { get; set; }
    }
}
