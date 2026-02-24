using System;
using System.Collections.Generic;
using System.Linq;

namespace Bookshelf.Core
{
    public class UserRepository : IUserRepository
    {
        private readonly BookshelfContext _context;

        public UserRepository(BookshelfContext context)
        {
            _context = context;
        }

        public IEnumerable<UserDto> GetUsers(UserQueryOptions queryOptions)
        {
             return _context.Users
                .Skip(queryOptions.Page * 10)
                .Take(10)
                .Select(u => ToUserDto(u));
        }

        public bool HasMore(UserQueryOptions queryOptions)
        {
            return _context.Users
                .Skip((queryOptions.Page + 1) * 10)
                .Any();
        }

        public UserDto GetUser(string email)
        {
            return _context.Users
                .ToList()
                .Select(u => ToUserDto(u))
                .Single(u => u.Email.Equals(email));
        }

        public UserDto GetUser(int id)
        {
            return _context.Users
                .ToList()
                .Select(u => ToUserDto(u))
                .Single(u => u.Id == id);
        }

        public string GetPasswordHash(string email)
        {
            var user = _context.Users
                .Single(u => u.Email.Equals(email));

            return user.PasswordHash;
        }

        public int Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user.Id;
        }

        public bool UserExists(int id)
        {
            return _context.Users
                .Any(u => u.Id == id);
        }

        public bool UserExists(string email)
        {
            return _context.Users
                .Any(u => u.Email.Equals(email));
        }

        public void Update(UserDto user)
        {
            var currentUser = _context.Users
                .Single(x => x.Id == user.Id);

            currentUser.Email = user.Email;
            currentUser.IsAdmin = user.IsAdmin;
            currentUser.PasswordResetToken = user.PasswordResetToken;
            currentUser.PasswordResetExpiry = user.PasswordResetExpiry;

            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var user = _context.Users
                .Single(x => x.Id == id);

            _context.Users.Remove(user);
            _context.SaveChanges();
        }

        public void UpdatePasswordHash(int id, string passwordHash)
        {
            var user = _context.Users.Single(x => x.Id == id);
            user.PasswordHash = passwordHash;
            _context.SaveChanges();
        }

        public void SetPasswordResetFields(int id, Guid? resetToken, DateTime? expiryDate)
        {
            var user = _context.Users
                .Single(u => u.Id == id);
            
            user.PasswordResetToken = resetToken;
            user.PasswordResetExpiry = expiryDate;

            _context.SaveChanges();
        }

        private static UserDto ToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                PasswordResetToken = user.PasswordResetToken,
                PasswordResetExpiry = user.PasswordResetExpiry
            };
        }
    }
}