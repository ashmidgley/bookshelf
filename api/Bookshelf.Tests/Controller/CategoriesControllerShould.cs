using NUnit.Framework;
using Bookshelf.Core;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using FakeItEasy;
using Microsoft.AspNetCore.Http;

namespace Bookshelf.Tests
{
    [TestFixture]
    public class CategoriesControllerShould
    {
        [Test]
        public void ReturnGetCategory_WhenCategoryExists_OnCallToGetCategory()
        {
            var id = 1;
            var categoryRepository = A.Fake<ICategoryRepository>();
            A.CallTo(() => categoryRepository.CategoryExists(id)).Returns(true);
            var controller = new CategoriesController(categoryRepository, null, null, null);

            var response = controller.GetCategory(id);

            A.CallTo(() => categoryRepository.GetCategory(id)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenCategoryDoesNotExist_OnCallToGetCategory()
        {
            var id = 1;
            var categoryRepository = A.Fake<ICategoryRepository>();
            A.CallTo(() => categoryRepository.CategoryExists(id)).Returns(false);
            var controller = new CategoriesController(categoryRepository, null, null, null);

            var response = controller.GetCategory(id);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Category with Id {id} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnGetUserCategories_WhenUserExists_OnCallToGetCurrentUserCategories()
        {
            var userId = 1;

            var categoryRepository = A.Fake<ICategoryRepository>();
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.GetUserId(A<HttpContext>.Ignored)).Returns(userId);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);

            var controller = new CategoriesController(categoryRepository, userRepository, userHelper, null);
            var response = controller.GetCurrentUserCategories();
            
            A.CallTo(() => categoryRepository.GetUserCategories(userId)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenUserDoesNotExist_OnCallToGetCurrentUserCategories()
        {
            var userId = 1;

            var categoryRepository = A.Fake<ICategoryRepository>();
            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.GetUserId(A<HttpContext>.Ignored)).Returns(userId);

            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(false);

            var controller = new CategoriesController(categoryRepository, userRepository, userHelper, null);
            var response = controller.GetCurrentUserCategories();
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {userId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnGetUserCategories_WhenUserExists_OnCallToGetUserCategories()
        {
            var userId = 1;
            var categoryRepository = A.Fake<ICategoryRepository>();
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(true);
            var controller = new CategoriesController(categoryRepository, userRepository, null, null);

            var response = controller.GetUserCategories(userId);
            
            A.CallTo(() => categoryRepository.GetUserCategories(userId)).MustHaveHappened();
        }

        [Test]
        public void ReturnBadRequest_WhenUserDoesNotExist_OnCallToGetUserCategories()
        {
            var userId = 1;
            var categoryRepository = A.Fake<ICategoryRepository>();
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.UserExists(userId)).Returns(false);
            var controller = new CategoriesController(categoryRepository, userRepository, null, null);

            var response = controller.GetUserCategories(userId);
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"User with Id {userId} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnCategory_OnCallToAddCategory()
        {
            var newCategory = new Category
            {
                Description = "Test",
                Code = "test"
            };

            var result = new Category
            {
                UserId = newCategory.UserId
            };

            var userHelper = A.Fake<IUserHelper>();
            var categoryRepository = A.Fake<ICategoryRepository>();
            A.CallTo(() => categoryRepository.GetCategory(A<int>.Ignored)).Returns(result);

            var validator = new CategoryValidator();
            var controller = new CategoriesController(categoryRepository, null, userHelper, validator);

            var response = controller.AddCategory(newCategory);

            A.CallTo(() => categoryRepository.Add(newCategory)).MustHaveHappened();
            Assert.AreEqual(result.UserId, response.Value.UserId);
        }

        [Test]
        public void ReturnCategory_WhenValidUser_CallsUpdateCategory()
        {
            var updatedCategory = new Category
            {
                Id = 1,
                UserId = 1,
                Description = "Test",
                Code = "test"
            };

            var result = new Category
            {
                Id = updatedCategory.Id
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, updatedCategory.UserId)).Returns(true);

            var categoryRepository = A.Fake<ICategoryRepository>();
            A.CallTo(() => categoryRepository.CategoryExists(updatedCategory.Id)).Returns(true);
            A.CallTo(() => categoryRepository.GetCategory(updatedCategory.Id)).Returns(result);
           
            var validator = new CategoryValidator();

            var controller = new CategoriesController(categoryRepository, null, userHelper, validator);

            var response = controller.UpdateCategory(updatedCategory);

            A.CallTo(() => categoryRepository.Update(updatedCategory)).MustHaveHappened();
            Assert.AreEqual(result.Id, response.Value.Id);
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsUpdateCategory()
        {
            var updatedCategory = new Category
            {
                Id = 1,
                UserId = 1,
                Description = "Test",
                Code = "test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, updatedCategory.UserId)).Returns(false);

            var validator = new CategoryValidator();

            var controller = new CategoriesController(null, null, userHelper, validator);

             var response = controller.UpdateCategory(updatedCategory);

            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }

        [Test]
        public void ReturnBadRequest_WhenCategoryDoesNotExist_OnCallToUpdateCategory()
        {
            var updatedCategory = new Category
            {
                Id = 1,
                UserId = 1,
                Description = "Test",
                Code = "test"
            };

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, updatedCategory.UserId)).Returns(true);

            var categoryRepository = A.Fake<ICategoryRepository>();
            A.CallTo(() => categoryRepository.CategoryExists(updatedCategory.Id)).Returns(false);
           
             var validator = new CategoryValidator();

            var controller = new CategoriesController(categoryRepository, null, userHelper, validator);

            var response = controller.UpdateCategory(updatedCategory);

            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Category with Id {updatedCategory.Id} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnCategory_WhenValidUser_CallsDeleteCategory()
        {
            var id = 1;
            
            var result = new Category
            {
                Id = id,
                UserId = 1
            };

            var categoryRepository = A.Fake<ICategoryRepository>();
            A.CallTo(() => categoryRepository.CategoryExists(id)).Returns(true);
            A.CallTo(() => categoryRepository.GetCategory(id)).Returns(result);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, result.UserId)).Returns(true);

            var controller = new CategoriesController(categoryRepository, null, userHelper, null);

            var response = controller.DeleteCategory(id);
            
            A.CallTo(() => categoryRepository.Delete(id)).MustHaveHappened();
            Assert.AreEqual(result.Id, response.Value.Id);
        }

        [Test]
        public void ReturnBadRequest_WhenCategoryDoesNotExist_OnCallToDeleteCategory()
        {
            var id = 1;

            var categoryRepository = A.Fake<ICategoryRepository>();
            A.CallTo(() => categoryRepository.CategoryExists(id)).Returns(false);

            var controller = new CategoriesController(categoryRepository, null, null, null);

            var response = controller.DeleteCategory(id);
            
            Assert.AreEqual((int)HttpStatusCode.BadRequest, ((BadRequestObjectResult)response.Result).StatusCode);
            Assert.AreEqual($"Category with Id {id} does not exist.", ((BadRequestObjectResult)response.Result).Value);
        }

        [Test]
        public void ReturnUnauthorized_WhenInvalidUser_CallsDeleteCategory()
        {
            var id = 1;
            
            var result = new Category
            {
                Id = id,
                UserId = 1
            };

            var categoryRepository = A.Fake<ICategoryRepository>();
            A.CallTo(() => categoryRepository.CategoryExists(id)).Returns(true);
            A.CallTo(() => categoryRepository.GetCategory(id)).Returns(result);

            var userHelper = A.Fake<IUserHelper>();
            A.CallTo(() => userHelper.MatchingUsers(A<HttpContext>.Ignored, result.UserId)).Returns(false);

            var controller = new CategoriesController(categoryRepository, null, userHelper, null);

            var response = controller.DeleteCategory(id);
            
            Assert.AreEqual((int)HttpStatusCode.Unauthorized, ((UnauthorizedResult)response.Result).StatusCode);
        }
    }
}