using NUnit.Framework;
using Bookshelf.Core;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using FakeItEasy;
using Microsoft.AspNetCore.Http;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class RatingsControllerShould
    {
        [Test]
        public void ReturnGetRating_WhenRatingExists_OnCallToGetRating()
        {
            var id = 1;
            var ratingRepository = A.Fake<IRatingRepository>();
            A.CallTo(() => ratingRepository.RatingExists(id)).Returns(true);
            var controller = new RatingsController(ratingRepository, null, null, null);

            var response = controller.GetRating(id);
            
            A.CallTo(() => ratingRepository.GetRating(id)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenRatingDoesNotExist_OnCallToGetRating()
        {
            var id = 1;
            var ratingRepository = A.Fake<IRatingRepository>();
            A.CallTo(() => ratingRepository.RatingExists(id)).Returns(false);
            var controller = new RatingsController(ratingRepository, null, null, null);

            var response = controller.GetRating(id);
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Rating with Id {id} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnGetUserRatings_WhenUserExists_OnCallToGetCurrentUserRatings()
        {
            var userId = 1;
            var ratingRepository = A.Fake<IRatingRepository>();
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.GetUserId(A<HttpContext>.Ignored)).Returns(userId);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);

            var controller = new RatingsController(ratingRepository, userRepository, userHelper, null);
            var response = controller.GetCurrentUserRatings();
            
            A.CallTo(() => ratingRepository.GetUserRatings(userId)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenUserDoesNotExist_OnCallToGetCurrentUserRatings()
        {
            var userId = 1;
            var ratingRepository = A.Fake<IRatingRepository>();
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.GetUserId(A<HttpContext>.Ignored)).Returns(userId);
            
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(false);

            var controller = new RatingsController(ratingRepository, userRepository, userHelper, null);
            var response = controller.GetCurrentUserRatings();
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {userId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnGetUserRatings_WhenUserExists_OnCallToGetUserRatings()
        {
            var userId = 1;
            var ratingRepository = A.Fake<IRatingRepository>();
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);
            var controller = new RatingsController(ratingRepository, userRepository, null, null);

            var response = controller.GetUserRatings(userId);
            
            A.CallTo(() => ratingRepository.GetUserRatings(userId)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenUserDoesNotExist_OnCallToGetUserRatings()
        {
            var userId = 1;
            var ratingRepository = A.Fake<IRatingRepository>();
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(false);
            var controller = new RatingsController(ratingRepository, userRepository, null, null);

            var response = controller.GetUserRatings(userId);
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {userId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

         [Test]
        public void ReturnRating_OnCallToAddRating()
        {
            var newRating = new Rating
            {
                Description = "Test",
                Code = "Test"
            };

            var result = new Rating
            {
                UserId = newRating.UserId
            };

            var userHelper = A.Fake<IUserHelper>();
            var ratingRepository = A.Fake<IRatingRepository>();
            A.CallTo(() => ratingRepository.GetRating(A<int>.Ignored)).Returns(result);

            var validator = new RatingValidator();
            var controller = new RatingsController(ratingRepository, null, userHelper, validator);

            var response = controller.AddRating(newRating);

            A.CallTo(() => ratingRepository.Add(newRating)).MustHaveHappened();
            Assert.AreEqual(result.UserId, response.Value.UserId);
        }

        [Test]
        public void ReturnRating_WhenValidUser_CallsUpdateRating()
        {
            var updatedRating = new Rating
            {
                Id = 1,
                UserId = 1,
                Description = "Test",
                Code = "Test"
            };

            var result = new Rating
            {
                Id = updatedRating.Id
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, updatedRating.UserId)).Returns(true);

            var ratingRepository = A.Fake<IRatingRepository>();
            A.CallTo(() => ratingRepository.RatingExists(updatedRating.Id)).Returns(true);
            A.CallTo(() => ratingRepository.GetRating(updatedRating.Id)).Returns(result);
           
            var validator = new RatingValidator();

            var controller = new RatingsController(ratingRepository, null, userHelper, validator);

            var response = controller.UpdateRating(updatedRating);

            A.CallTo(() => ratingRepository.Update(updatedRating)).MustHaveHappened();
            Assert.AreEqual(result.Id, response.Value.Id);
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsUpdateRating()
        {
            var updatedRating = new Rating
            {
                Id = 1,
                UserId = 1,
                Description = "Test",
                Code = "Test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, updatedRating.UserId)).Returns(false);

            var validator = new RatingValidator();

            var controller = new RatingsController(null, null, userHelper, validator);

            var response = controller.UpdateRating(updatedRating);

            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }

        [Test]
        public void ReturnBadRequest_WhenRatingDoesNotExist_OnCallToUpdateRating()
        {
            var updatedRating = new Rating
            {
                Id = 1,
                UserId = 1,
                Description = "Test",
                Code = "Test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, updatedRating.UserId)).Returns(true);
           
            var ratingRepository = A.Fake<IRatingRepository>();
            A.CallTo(() => ratingRepository.RatingExists(updatedRating.Id)).Returns(false);
           
            var validator = new RatingValidator();

            var controller = new RatingsController(ratingRepository, null, userHelper, validator);

            var response = controller.UpdateRating(updatedRating);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Rating with Id {updatedRating.Id} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnRating_WhenValidUser_CallsDeleteRating()
        {
            var id = 1;
            
            var result = new Rating
            {
                Id = id,
                UserId = 1
            };

            var ratingRepository = A.Fake<IRatingRepository>();
            A.CallTo(() => ratingRepository.RatingExists(id)).Returns(true);
            A.CallTo(() => ratingRepository.GetRating(id)).Returns(result);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, result.UserId)).Returns(true);

            var controller = new RatingsController(ratingRepository, null, userHelper, null);

            var response = controller.DeleteRating(id);
            
            A.CallTo(() => ratingRepository.Delete(id)).MustHaveHappened();
            Assert.AreEqual(result.Id, response.Value.Id);
        }

        [Test]
        public void ReturnBadRequest_WhenRatingDoesNotExist_OnCallToDeleteRating()
        {
            var id = 1;

            var ratingRepository = A.Fake<IRatingRepository>();
            A.CallTo(() => ratingRepository.RatingExists(id)).Returns(false);

            var controller = new RatingsController(ratingRepository, null, null, null);

            var response = controller.DeleteRating(id);
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Rating with Id {id} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsDeleteRating()
        {
            var id = 1;
            
            var result = new Rating
            {
                Id = id,
                UserId = 1
            };

            var ratingRepository = A.Fake<IRatingRepository>();
            A.CallTo(() => ratingRepository.RatingExists(id)).Returns(true);
            A.CallTo(() => ratingRepository.GetRating(id)).Returns(result);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, result.UserId)).Returns(false);

            var controller = new RatingsController(ratingRepository, null, userHelper, null);

            var response = controller.DeleteRating(id);
            
            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }
    }
}