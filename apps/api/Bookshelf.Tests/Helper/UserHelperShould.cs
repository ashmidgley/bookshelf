using NUnit.Framework;
using Bookshelf.Core;
using FakeItEasy;
using System;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Collections.Generic;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class UserHelperShould
    {
        [TestCase("password", "1vEjmwXiHmO98JoEdYcDaQ==", ExpectedResult = "1vEjmwXiHmO98JoEdYcDaY9cJUmKiqXkRihgnJ88NZO7QlTK")]
        public string ReturnHashedPassword_OnCallToHashPassword(string input, string saltString)
        {
            var salt = Convert.FromBase64String(saltString);
            var userHelper = new UserHelper(null, null, null, null, null);

            return userHelper.HashPassword(input, salt);
        }

        [TestCase("password", "1vEjmwXiHmO98JoEdYcDaY9cJUmKiqXkRihgnJ88NZO7QlTK", "1vEjmwXiHmO98JoEdYcDaQ==", ExpectedResult = true)]
        [TestCase("password123", "1vEjmwXiHmO98JoEdYcDaY9cJUmKiqXkRihgnJ88NZO7QlTK", "1vEjmwXiHmO98JoEdYcDaQ==", ExpectedResult = false)]
        public bool CheckBool_OnCallToPasswordsMatch(string password, string passwordHash, string saltString)
        {
            var salt = Convert.FromBase64String(saltString);
            var userHelper = new UserHelper(null, null, null, null, null);

            return userHelper.PasswordsMatch(password, passwordHash, salt);
        }

        [Test]
        public void RegisterUserWithDefaultValues_OnCallToRegister()
        {
            var categoryRepository = A.Fake<ICategoryRepository>();
            var ratingRepository = A.Fake<IRatingRepository>();

            var userHelper = new UserHelper(null, null, null, categoryRepository, ratingRepository);

            userHelper.Register(1);
            
            A.CallTo(() => categoryRepository.Add(A<Category>.Ignored)).MustHaveHappenedTwiceExactly();
            A.CallTo(() => ratingRepository.Add(A<Rating>.Ignored)).MustHaveHappened(3, Times.Exactly);
        }

        [TestCase("true", ExpectedResult = true)]
        [TestCase("false", ExpectedResult = false)]
        public bool ReturnBool_OnCallToIsAdmin(string isAdmin)
        {
            var claims = new List<Claim>
            {
                new Claim("IsAdmin", isAdmin)
            };

            var context = A.Fake<HttpContext>();
            context.User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(claims));

            var userHelper = new UserHelper(null, null, null, null, null);

            return userHelper.IsAdmin(context);
        }

        [TestCase("1", ExpectedResult = true)]
        [TestCase("2", ExpectedResult = false)]
        public bool ReturnBool_OnCallToMatchingUsers(string id)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", id)
            };

            var context = A.Fake<HttpContext>();
            context.User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(claims));

            var userHelper = new UserHelper(null, null, null, null, null);

            return userHelper.MatchingUsers(context, 1);
        }

        [Test]
        public void CallRepositoryMethods_OnCallToDeleteUser()
        {
            var userId = 1;
            var userRepository = A.Fake<IUserRepository>();
            var ratingRepository = A.Fake<IRatingRepository>();
            var categoryRepository = A.Fake<ICategoryRepository>();
            var bookRepository = A.Fake<IBookRepository>();
            var userHelper = new UserHelper(null, userRepository, bookRepository, categoryRepository, ratingRepository);

            userHelper.DeleteUser(userId);

            A.CallTo(() => userRepository.Delete(userId)).MustHaveHappened();
            A.CallTo(() => ratingRepository.DeleteUserRatings(userId)).MustHaveHappened();
            A.CallTo(() => categoryRepository.DeleteUserCategories(userId)).MustHaveHappened();
            A.CallTo(() => bookRepository.DeleteUserBooks(userId)).MustHaveHappened();
        }

        [Test]
        public void ReturnTrue_WhenValidToken_OnCallToValidResetToken()
        {
            var token = new Guid("411a5eae-f119-47be-8d1e-16e3258ecacb");
            var user = new UserDto
            {
                PasswordResetToken = token,
                PasswordResetExpiry = DateTime.Now.AddDays(1)
            };

            var userHelper = new UserHelper(null, null, null, null, null);

            Assert.IsTrue(userHelper.ValidResetToken(user, token));
        }

        [Test]
        public void ReturnFalse_WhenInvalidToken_OnCallToValidResetToken()
        {
            var token = new Guid("411a5eae-f119-47be-8d1e-16e3258ecacb");
            var user = new UserDto
            {
                PasswordResetToken = Guid.NewGuid(),
                PasswordResetExpiry = DateTime.Now.AddDays(1)
            };

            var userHelper = new UserHelper(null, null, null, null, null);

            Assert.IsFalse(userHelper.ValidResetToken(user, token));
        }

        [Test]
        public void ReturnFalse_WhenTokenNull_OnCallToValidResetToken()
        {
            var token = new Guid("411a5eae-f119-47be-8d1e-16e3258ecacb");
            var user = new UserDto
            {
                PasswordResetExpiry = DateTime.Now.AddDays(1)
            };

            var userHelper = new UserHelper(null, null, null, null, null);

            Assert.IsFalse(userHelper.ValidResetToken(user, token));
        }

        [Test]
        public void ReturnFalse_WhenInvalidPasswordResetExpiry_OnCallToValidResetToken()
        {
            var token = new Guid("411a5eae-f119-47be-8d1e-16e3258ecacb");
            var user = new UserDto
            {
                PasswordResetToken = token,
                PasswordResetExpiry = DateTime.Now.AddDays(-1)
            };

            var userHelper = new UserHelper(null, null, null, null, null);

            Assert.IsFalse(userHelper.ValidResetToken(user, token));
        }

        [Test]
        public void ReturnFalse_WhenPasswordResetExpiryNull_OnCallToValidResetToken()
        {
            var token = new Guid("411a5eae-f119-47be-8d1e-16e3258ecacb");
            var user = new UserDto
            {
                PasswordResetToken = token
            };

            var userHelper = new UserHelper(null, null, null, null, null);

            Assert.IsFalse(userHelper.ValidResetToken(user, token));
        }

        [Test]
        public void ReturnUserId_OnCallToGetUserId()
        {
            var id = "1";
            var claims = new List<Claim>
            {
                new Claim("Id", id)
            };

            var context = A.Fake<HttpContext>();
            context.User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(claims));

            var userHelper = new UserHelper(null, null, null, null, null);
            var result = userHelper.GetUserId(context);

            Assert.AreEqual(int.Parse(id), result);
        }
    }
}