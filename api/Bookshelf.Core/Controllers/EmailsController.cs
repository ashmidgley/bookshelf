using System;
using Microsoft.AspNetCore.Mvc;

namespace Bookshelf.Core
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailsController : ControllerBase
    {
        private readonly IEmailConfiguration _config;
        private readonly IUserRepository _userRepository;
        private readonly IEmailHelper _emailHelper;

        public EmailsController(IEmailConfiguration config, IUserRepository userRepository, IEmailHelper emailHelper)
        {
            _config = config;
            _userRepository = userRepository;
            _emailHelper = emailHelper;
        }

        [HttpPost]
        [Route("send-reset-token")]
        public ActionResult SendResetToken(PasswordResetDto model)
        {
            if(!_userRepository.UserExists(model.Email))
            {
                return BadRequest($"User with email {model.Email} does not exist.");
            }

            var user = _userRepository.GetUser(model.Email);
            var resetToken = Guid.NewGuid();
            var expiryDate = DateTime.Now.AddDays(1);
            _userRepository.SetPasswordResetFields(user.Id, resetToken, expiryDate);

            var resetLink = $"{_config.SiteUrl}/reset-password/{user.Id}/{resetToken}";
            _emailHelper.SendResetToken(model.Email, resetLink);

            return Ok();
        }
    }
}