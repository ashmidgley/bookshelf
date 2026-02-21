namespace Bookshelf.Core
{
    public interface IJwtConfiguration
    {
        string Key { get; set; }
        string Issuer { get; set; }
    }
}