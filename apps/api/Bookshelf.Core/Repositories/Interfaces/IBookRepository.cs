using System.Collections.Generic;

namespace Bookshelf.Core
{
    public interface IBookRepository
    {
        IEnumerable<BookDto> GetUserBooks(int userId, BookQueryOptions options);
        bool HasMore(int userId, BookQueryOptions options);
        BookDto GetBook(int id);
        int Add(Book book);
        void Update(BookDto dto);
        void Delete(int id);
        void DeleteUserBooks(int userId);
        bool BookExists(int id);
    }
}