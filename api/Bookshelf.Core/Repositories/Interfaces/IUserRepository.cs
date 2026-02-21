using System;
using System.Collections.Generic;

namespace Bookshelf.Core
{
    public interface IUserRepository
    {
        IEnumerable<UserDto> GetUsers(UserQueryOptions queryOptions);
        bool HasMore(UserQueryOptions queryOptions);
        UserDto GetUser(string email);
        UserDto GetUser(int id);
        string GetPasswordHash(string email);
        int Add(User user);
        void Update(UserDto user);
        void UpdatePasswordHash(int id, string passwordHash);
        void Delete(int id);
        bool UserExists(int id);
        bool UserExists(string email);
        void SetPasswordResetFields(int id, Guid? resetToken, DateTime? expiryDate);
    }
}