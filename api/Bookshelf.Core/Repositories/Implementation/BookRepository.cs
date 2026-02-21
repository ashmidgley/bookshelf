using System.Collections.Generic;
using System.Linq;

namespace Bookshelf.Core
{
    public class BookRepository : IBookRepository
    {
        private readonly BookshelfContext _context;

        public BookRepository(BookshelfContext context)
        {
            _context = context;
        }

        public IEnumerable<BookDto> GetUserBooks(int userId, BookQueryOptions options)
        {
            var query = _context.Books
                .Where(b => b.UserId == userId);
            
            if(options.Search != null)
            {
                query = query
                    .Where(x => x.Title.Contains(options.Search) || x.Author.Contains(options.Search));
            }

            if(options.Category.HasValue)
            {
                query = query
                    .Where(x => x.CategoryId == options.Category.Value);
            }

            if(options.Rating.HasValue)
            {
                query = query
                    .Where(x => x.RatingId == options.Rating.Value);
            }

            var entriesPerPage = options.EntriesPerPage ?? 10;
            return query
                .OrderByDescending(x => x.FinishedOn)
                .Skip(options.Page * entriesPerPage)
                .Take(entriesPerPage)
                .Select(b => ToBookDto(b));
        }

        public bool HasMore(int userId, BookQueryOptions options)
        {
            var query = _context.Books
                .Where(b => b.UserId == userId);
            
            if(options.Search != null)
            {
                query = query
                    .Where(x => x.Title.Contains(options.Search) || x.Author.Contains(options.Search));
            }

            if(options.Category.HasValue)
            {
                query = query
                    .Where(x => x.CategoryId == options.Category.Value);
            }

            if(options.Rating.HasValue)
            {
                query = query
                    .Where(x => x.RatingId == options.Rating.Value);
            }

            var entriesPerPage = options.EntriesPerPage ?? 10;
            return query
                .Skip((options.Page + 1) * entriesPerPage)
                .Any();
        }

        public BookDto GetBook(int id)
        {
            var book = _context.Books
                .Single(b => b.Id == id);

            return ToBookDto(book);
        }

        public int Add(Book book)
        {
            _context.Books.Add(book);
            _context.SaveChanges();
            return book.Id;
        }

        public void Update(BookDto dto)
        {
            var book = ToBook(dto);
            _context.Books.Update(book);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var book = _context.Books
                .Single(b => b.Id == id);
                
            _context.Books.Remove(book);
            _context.SaveChanges();
        }

        public void DeleteUserBooks(int userId)
        {
            var books = _context.Books
                .Where(b => b.UserId == userId);

            _context.Books.RemoveRange(books);
            _context.SaveChanges();
        }

        public bool BookExists(int id)
        {
            return _context.Books
                .Any(x => x.Id == id);
        }

         private static BookDto ToBookDto(Book book)
        {
            return new BookDto
            {
                Id = book.Id,
                UserId = book.UserId,
                CategoryId = book.CategoryId,
                RatingId = book.RatingId,
                ImageUrl = book.ImageUrl,
                Title = book.Title,
                Author = book.Author,
                FinishedOn = book.FinishedOn,
                Year = book.FinishedOn.Year,
                PageCount = book.PageCount,
                Summary = book.Summary
            };
        }

        private static Book ToBook(BookDto dto)
        {
            return new Book
            {
                Id = dto.Id,
                UserId = dto.UserId,
                CategoryId = dto.CategoryId,
                RatingId = dto.RatingId,
                ImageUrl = dto.ImageUrl,
                Title = dto.Title,
                Author = dto.Author,
                FinishedOn = dto.FinishedOn,
                PageCount = dto.PageCount,
                Summary = dto.Summary
            };
        }
    }
}
