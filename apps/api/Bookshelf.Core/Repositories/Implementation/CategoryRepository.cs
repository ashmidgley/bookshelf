using System.Collections.Generic;
using System.Linq;

namespace Bookshelf.Core
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly BookshelfContext _context;

        public CategoryRepository(BookshelfContext context)
        {
            _context = context;
        }

        public IEnumerable<Category> GetUserCategories(int userId)
        {
            return _context.Categories
                .Where(c => c.UserId == userId);
        }

        public Category GetCategory(int id)
        {
            return _context.Categories
                .Single(c => c.Id == id);
        }

        public int Add(Category category)
        {
            _context.Categories.Add(category);
            _context.SaveChanges();
            return category.Id;
        }

        public void Update(Category category)
        {
            _context.Categories.Update(category);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var category = _context.Categories
                .Single(c => c.Id == id);

            _context.Categories.Remove(category);
            _context.SaveChanges();
        }

        public void DeleteUserCategories(int userId)
        {
            var categories = _context.Categories
                .Where(c => c.UserId == userId);

            _context.Categories.RemoveRange(categories);
            _context.SaveChanges();
        }

        public bool CategoryExists(int id)
        {
            return _context.Categories
                .Any(x => x.Id == id);
        }
    }
}
