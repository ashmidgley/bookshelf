using FluentValidation;

namespace Bookshelf.Core
{
    public class NewBookValidator : AbstractValidator<Book>
    {
        public NewBookValidator()
        {
            RuleFor(book => book.CategoryId).NotNull();
            RuleFor(book => book.RatingId).NotNull();
            RuleFor(book => book.ImageUrl).NotNull();
            RuleFor(book => book.Title).NotNull();
            RuleFor(book => book.Author).NotNull();
            RuleFor(book => book.FinishedOn).NotNull();
            RuleFor(book => book.PageCount).NotNull();
        }
    }
}