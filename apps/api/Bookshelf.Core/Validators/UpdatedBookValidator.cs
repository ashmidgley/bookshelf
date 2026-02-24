using FluentValidation;

namespace Bookshelf.Core
{
    public class UpdatedBookValidator : AbstractValidator<BookDto>
    {
        public UpdatedBookValidator()
        {
            RuleFor(dto => dto.Id).NotNull();
            RuleFor(dto => dto.UserId).NotNull();
            RuleFor(dto => dto.CategoryId).NotNull();
            RuleFor(dto => dto.RatingId).NotNull();
            RuleFor(dto => dto.ImageUrl).NotNull();
            RuleFor(dto => dto.Title).NotNull();
            RuleFor(dto => dto.Author).NotNull();
            RuleFor(dto => dto.FinishedOn).NotNull();
            RuleFor(dto => dto.Year).NotNull();
            RuleFor(dto => dto.PageCount).NotNull();
        }
    }
}
