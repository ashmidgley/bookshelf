using FluentValidation;

namespace Bookshelf.Core
{
    public class RatingValidator : AbstractValidator<Rating>
    {
        public RatingValidator()
        {
            RuleFor(rating => rating.Description).NotNull();
            RuleFor(rating => rating.Code).NotNull();
        }
    }
}
