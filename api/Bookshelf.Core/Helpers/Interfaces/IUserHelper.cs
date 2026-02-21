using System;
using Microsoft.AspNetCore.Http;

namespace Bookshelf.Core
{
    public interface IUserHelper
    {
        string BuildToken(UserDto user);
        string HashPassword(string password, byte[] salt = null);
        bool PasswordsMatch(string password, string passwordHash, byte[] salt = null);
        void Register(int userId);
        bool IsAdmin(HttpContext context);
        bool MatchingUsers(HttpContext context, int userId);
        void DeleteUser(int userId);
        bool ValidResetToken(UserDto user, Guid token);
        int GetUserId(HttpContext context);
    }
}