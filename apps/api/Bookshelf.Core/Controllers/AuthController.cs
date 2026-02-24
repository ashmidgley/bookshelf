using System;
using Microsoft.AspNetCore.Mvc;

namespace Bookshelf.Core
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IUserRepository _userRepository;
        private IUserHelper _userHelper;
        private LoginDtoValidator _loginDtoValidator;

        public AuthController(IUserRepository userRepository, IUserHelper userHelper, LoginDtoValidator loginDtoValidator)
        {
            _userRepository = userRepository;
            _userHelper = userHelper;
            _loginDtoValidator = loginDtoValidator;
        }

        [HttpPost]
        [Route("login")]
        public ActionResult<string> Login([FromBody]LoginDto login)
        {
            var validation = _loginDtoValidator.Validate(login);
            if (!validation.IsValid)
            {
                return BadRequest(validation.ToString());
            }

            if(!_userRepository.UserExists(login.Email))
            {
                return BadRequest("Incorrect email address. Please try again.");
            }

            if (!_userHelper.PasswordsMatch(login.Password, _userRepository.GetPasswordHash(login.Email)))
            {
                return BadRequest("Incorrect password. Please try again.");
            }

            var user = _userRepository.GetUser(login.Email);
            return _userHelper.BuildToken(user);
        }

        [HttpPost]
        [Route("register")]
        public ActionResult<string> Register(LoginDto login)
        {
            var validation = _loginDtoValidator.Validate(login);
            if (!validation.IsValid)
            {
                return BadRequest(validation.ToString());
            }

            if(_userRepository.UserExists(login.Email)) 
            {
                return BadRequest("Email already in use. Please try another.");
            }

            var newUser = new User
            {
                Email = login.Email,
                PasswordHash = _userHelper.HashPassword(login.Password),
            };

            var id = _userRepository.Add(newUser);
            _userHelper.Register(id);
            var user = _userRepository.GetUser(id);
            return _userHelper.BuildToken(user);
        }

        [HttpGet]
        [Route("reset-token-valid/{userId}/{token}")]
        public ActionResult<bool> ResetTokenValid(int userId, Guid token)
        {
            if(!_userRepository.UserExists(userId))
            {
                return BadRequest($"User with Id {userId} does not exist."); 
            }

            var user = _userRepository.GetUser(userId);
            return _userHelper.ValidResetToken(user, token);
        }

        [HttpPut]
        public ActionResult<UserDto> UpdatePasswordUsingToken(ResetTokenUpdateDto model)
        {
            if(!_userRepository.UserExists(model.UserId))
            {
               return BadRequest($"User with Id {model.UserId} does not exist."); 
            }

            var user = _userRepository.GetUser(model.UserId);
            if(!_userHelper.ValidResetToken(user, model.Token))
            {
                return BadRequest("Password reset token is not valid.");
            }

            var passwordHash = _userHelper.HashPassword(model.Password);
            _userRepository.UpdatePasswordHash(user.Id, passwordHash);
            _userRepository.SetPasswordResetFields(user.Id, null, null);
            return _userRepository.GetUser(user.Id);
        }
    }
}
