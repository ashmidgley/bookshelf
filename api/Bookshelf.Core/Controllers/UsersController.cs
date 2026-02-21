using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bookshelf.Core
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserHelper _userHelper;
        private readonly UserDtoValidator _userDtoValidator;

        public UsersController(IUserRepository userRepository, IUserHelper userHelper, UserDtoValidator userDtoValidator)
        {
            _userRepository = userRepository;
            _userHelper = userHelper;
            _userDtoValidator = userDtoValidator;
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<UserDto> GetUser(int id)
        {
            if(!_userHelper.MatchingUsers(HttpContext, id) && !_userHelper.IsAdmin(HttpContext))
            {
                return Unauthorized();
            }

            if(!_userRepository.UserExists(id))
            {
                return BadRequest($"User with Id {id} does not exist.");
            }

            return _userRepository.GetUser(id);
        }

        [HttpPost]
        public ActionResult<UsersDto> GetUsers([FromBody] UserQueryOptions queryOptions)
        {
            if(!_userHelper.IsAdmin(HttpContext))
            {
                return Unauthorized();
            }
            
            return new UsersDto
            {
                Users = _userRepository.GetUsers(queryOptions),
                HasMore = _userRepository.HasMore(queryOptions)
            };
        }

        [HttpPut]
        public ActionResult<UserDto> UpdateUser(UserDto user)
        {
            var validation = _userDtoValidator.Validate(user);
            if (!validation.IsValid)
            {
                return BadRequest(validation.ToString());
            }

            if(!_userHelper.IsAdmin(HttpContext))
            {
                return Unauthorized();
            }

            if(!_userRepository.UserExists(user.Id))
            {
                return BadRequest($"User with Id {user.Id} does not exist.");
            }

            _userRepository.Update(user);
            return _userRepository.GetUser(user.Id);
        }

        [HttpPut]
        [Route("email")]
        public ActionResult<UserDto> UpdateEmail(UserUpdateDto user)
        {
            var userId = _userHelper.GetUserId(HttpContext);
            if(!_userHelper.MatchingUsers(HttpContext, userId))
            {
               return Unauthorized(); 
            }
            
            if(_userRepository.UserExists(user.Email))
            {
                return BadRequest($"Email {user.Email} is already in use.");
            }

            var currentUser = _userRepository.GetUser(userId);
            currentUser.Email = user.Email;
            _userRepository.Update(currentUser);
            return _userRepository.GetUser(userId);
        }
        
        [HttpPut]
        [Route("password")]
        public ActionResult<UserDto> UpdatePassword(UserUpdateDto user)
        {
            var userId = _userHelper.GetUserId(HttpContext);
            if(!_userHelper.MatchingUsers(HttpContext, userId))
            {
               return Unauthorized(); 
            }

            var passwordHash = _userHelper.HashPassword(user.Password);
            _userRepository.UpdatePasswordHash(userId, passwordHash);
            return _userRepository.GetUser(userId);
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult<UserDto> DeleteUser(int id)
        {
            if(!_userRepository.UserExists(id))
            {
                return BadRequest($"User with Id {id} does not exist.");
            }
            
            if(!_userHelper.IsAdmin(HttpContext) && !_userHelper.MatchingUsers(HttpContext, id))
            {
                return Unauthorized();
            }

            var user = _userRepository.GetUser(id);
            _userHelper.DeleteUser(id);
            return user;
        }
    }
}
