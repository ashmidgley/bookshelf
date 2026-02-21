namespace Bookshelf.Core
{
    public interface IEmailService
    {
        void Send(EmailMessage emailMessage);
    }
}