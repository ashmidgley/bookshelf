using FluentValidation;

namespace Bookshelf.Core
{
    public class CategoryValidator : AbstractValidator<Category>
    {
        public CategoryValidator()
        {
            RuleFor(category => category.Description).NotNull();
            RuleFor(category => category.Code).NotNull();
        }
    }
}
