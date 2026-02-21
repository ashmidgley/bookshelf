using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace Bookshelf.Core
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserHelper _userHelper;
        private readonly CategoryValidator _validator;

        public CategoriesController(ICategoryRepository categoryRepository, IUserRepository userRepository, IUserHelper userHelper,
            CategoryValidator validator)
        {
            _categoryRepository = categoryRepository;
            _userRepository = userRepository;
            _userHelper = userHelper;
            _validator = validator;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("{id}")]
        public ActionResult<Category> GetCategory(int id)
        {
            if(!_categoryRepository.CategoryExists(id))
            {
                return BadRequest($"Category with Id {id} does not exist.");
            }

            return _categoryRepository.GetCategory(id);
        }

        [HttpGet]
        [Route("user")]
        public ActionResult<IEnumerable<Category>> GetCurrentUserCategories()
        {
            var userId = _userHelper.GetUserId(HttpContext);
            if(!_userRepository.UserExists(userId))
            {
                return BadRequest($"User with Id {userId} does not exist.");
            }

            return _categoryRepository.GetUserCategories(userId).ToList();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("user/{userId}")]
        public ActionResult<IEnumerable<Category>> GetUserCategories(int userId)
        {
            if(!_userRepository.UserExists(userId))
            {
                return BadRequest($"User with Id {userId} does not exist.");
            }

            return _categoryRepository.GetUserCategories(userId).ToList();
        }

        [HttpPost]
        public ActionResult<Category> AddCategory([FromBody] Category category)
        {
            var validation = _validator.Validate(category);
            if (!validation.IsValid)
            {
                return BadRequest(validation.ToString());
            }
            
            category.UserId = _userHelper.GetUserId(HttpContext);
            var id = _categoryRepository.Add(category);
            return _categoryRepository.GetCategory(id);
        }

        [HttpPut]
        public ActionResult<Category> UpdateCategory([FromBody] Category category)
        {
            var validation = _validator.Validate(category);
            if (!validation.IsValid)
            {
                return BadRequest(validation.ToString());
            }

            if(!_userHelper.MatchingUsers(HttpContext, category.UserId))
            {
                return Unauthorized();
            }

            if(!_categoryRepository.CategoryExists(category.Id))
            {
                return BadRequest($"Category with Id {category.Id} does not exist.");
            }

            _categoryRepository.Update(category);
            return _categoryRepository.GetCategory(category.Id);
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult<Category> DeleteCategory(int id)
        {
            if(!_categoryRepository.CategoryExists(id))
            {
                return BadRequest($"Category with Id {id} does not exist.");
            }

            var category = _categoryRepository.GetCategory(id);
            if(!_userHelper.MatchingUsers(HttpContext, category.UserId))
            {
                return Unauthorized();
            }

            _categoryRepository.Delete(category.Id);
            return category;
        }
    }
}