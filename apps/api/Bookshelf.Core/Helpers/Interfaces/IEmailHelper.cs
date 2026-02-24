namespace Bookshelf.Core
{
    public interface IEmailHelper
    {
        void SendResetToken(string toAddress, string resetLink);
    }
}