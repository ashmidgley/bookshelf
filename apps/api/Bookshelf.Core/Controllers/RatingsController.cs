using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace Bookshelf.Core
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RatingsController : ControllerBase
    {
        private readonly IRatingRepository _ratingRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserHelper _userHelper;
        private readonly RatingValidator _validator;

        public RatingsController(IRatingRepository ratingRepository, IUserRepository userRepository, IUserHelper userHelper,
            RatingValidator validator)
        {
            _ratingRepository = ratingRepository;
            _userRepository = userRepository;
            _userHelper = userHelper;
            _validator = validator;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("{id}")]
        public ActionResult<Rating> GetRating(int id)
        {
            if(!_ratingRepository.RatingExists(id))
            {
                return BadRequest($"Rating with Id {id} does not exist.");
            }

            return _ratingRepository.GetRating(id);
        }

        [HttpGet]
        [Route("user")]
        public ActionResult<IEnumerable<Rating>> GetCurrentUserRatings()
        {
            var userId = _userHelper.GetUserId(HttpContext);
            if(!_userRepository.UserExists(userId))
            {
                return BadRequest($"User with Id {userId} does not exist.");
            }

            return _ratingRepository.GetUserRatings(userId).ToList();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("user/{userId}")]
        public ActionResult<IEnumerable<Rating>> GetUserRatings(int userId)
        {
            if(!_userRepository.UserExists(userId))
            {
                return BadRequest($"User with Id {userId} does not exist.");
            }

            return _ratingRepository.GetUserRatings(userId).ToList();
        }

        [HttpPost]
        public ActionResult<Rating> AddRating([FromBody] Rating rating)
        {
            var validation = _validator.Validate(rating);
            if (!validation.IsValid)
            {
                return BadRequest(validation.ToString());
            }

            rating.UserId = _userHelper.GetUserId(HttpContext);
            var id = _ratingRepository.Add(rating);
            return _ratingRepository.GetRating(id);
        }

        [HttpPut]
        public ActionResult<Rating> UpdateRating([FromBody] Rating rating)
        {
            var validation = _validator.Validate(rating);
            if (!validation.IsValid)
            {
                return BadRequest(validation.ToString());
            }

            if(!_userHelper.MatchingUsers(HttpContext, rating.UserId))
            {
                return Unauthorized();
            }

            if(!_ratingRepository.RatingExists(rating.Id))
            {
                return BadRequest($"Rating with Id {rating.Id} does not exist.");
            }

            _ratingRepository.Update(rating);
            return _ratingRepository.GetRating(rating.Id);
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult<Rating> DeleteRating(int id)
        {
            if(!_ratingRepository.RatingExists(id))
            {
                return BadRequest($"Rating with Id {id} does not exist.");
            }
            
            var rating = _ratingRepository.GetRating(id);
            if(!_userHelper.MatchingUsers(HttpContext, rating.UserId))
            {
                return Unauthorized();
            }

            _ratingRepository.Delete(id);
            return rating;
        }
    }
}