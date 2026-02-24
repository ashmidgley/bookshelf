using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace Bookshelf.Core
{
    public class UserHelper : IUserHelper
    {
        private IJwtConfiguration _config;
        private IUserRepository _userRepository;
        private IBookRepository _bookRepository;
        private ICategoryRepository _categoryRepository;
        private IRatingRepository _ratingRepository;
        private readonly List<Category> _defaultCategories = new List<Category>
        {
            new Category
            {
                Description = "Fiction",
                Code = "🧟"
            },
            new Category
            {
                Description = "Non-fiction",
                Code = "🧠"
            }
        };
        private readonly List<Rating> _defaultRatings = new List<Rating>
        {
            new Rating
            {
                Description = "Bronze",
                Code = "🥉"
            },
            new Rating
            {
                Description = "Silver",
                Code = "🥈"
            },
            new Rating
            {
                Description = "Gold",
                Code = "🥇"
            }
        };
        
        public UserHelper(IJwtConfiguration config, IUserRepository userRepository, IBookRepository bookRepository,
            ICategoryRepository categoryRepository, IRatingRepository ratingRepository)
        {
            _config = config;
            _userRepository = userRepository;
            _bookRepository = bookRepository;
            _categoryRepository = categoryRepository;
            _ratingRepository = ratingRepository;
        }

        public string BuildToken(UserDto user)
        {
            var claims = new[]
            {
                new Claim("Id", user.Id.ToString()),
                new Claim("Email", user.Email),
                new Claim("IsAdmin", user.IsAdmin.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(_config.Issuer, _config.Issuer, claims, expires: DateTime.Now.AddDays(2), signingCredentials: creds);
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string HashPassword(string password, byte[] salt = null)
        {
            if(salt == null)
            {
                new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);
            }

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000);
            var hash = pbkdf2.GetBytes(20);

            var hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);

            return Convert.ToBase64String(hashBytes);
        }

        public bool PasswordsMatch(string password, string passwordHash, byte[] salt = null)
        {
            var hashBytes = Convert.FromBase64String(passwordHash);
            if(salt == null) 
            {
                salt = new byte[16];
                Array.Copy(hashBytes, 0, salt, 0, 16);
            }

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000);
            var hash = pbkdf2.GetBytes(20);

            for(int i = 0; i < 20; i++)
            {
                if(hashBytes[i + 16] != hash[i])
                {
                    return false;
                }
            }
            return true;
        }
        
        public void Register(int userId)
        {
            foreach(var category in _defaultCategories)
            {
                category.UserId = userId;
                _categoryRepository.Add(category);
            }

            foreach(var rating in _defaultRatings)
            {
                rating.UserId = userId;
                _ratingRepository.Add(rating);
            }
        }

        public bool IsAdmin(HttpContext context)
        {
            var currentUser = context.User;
            return bool.Parse(currentUser.Claims.FirstOrDefault(c => c.Type.Equals("IsAdmin")).Value);
        }

        public bool MatchingUsers(HttpContext context, int userId)
        {
            var currentUser = context.User;
            return int.Parse(currentUser.Claims.FirstOrDefault(c => c.Type.Equals("Id")).Value) == userId;
        }

        public void DeleteUser(int userId)
        {
            _userRepository.Delete(userId);
            _ratingRepository.DeleteUserRatings(userId);
            _categoryRepository.DeleteUserCategories(userId);
            _bookRepository.DeleteUserBooks(userId);
        }

        public bool ValidResetToken(UserDto user, Guid token)
        {
            if(!user.PasswordResetToken.HasValue || user.PasswordResetToken.Value != token)
            {
                return false;
            }

            if(!user.PasswordResetExpiry.HasValue || user.PasswordResetExpiry.Value < DateTime.Now)
            {
                return false;
            }

            return true;
        }

        public int GetUserId(HttpContext context)
        {
            var currentUser = context.User;
            return int.Parse(currentUser.Claims.FirstOrDefault(c => c.Type.Equals("Id")).Value);
        }
    }
}