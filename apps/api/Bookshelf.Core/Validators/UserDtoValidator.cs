using FluentValidation;

namespace Bookshelf.Core
{
    public class UserDtoValidator : AbstractValidator<UserDto>
    {
        public UserDtoValidator()
        {
            RuleFor(dto => dto.Id).NotNull();
            RuleFor(dto => dto.Email).NotNull();
            RuleFor(dto => dto.IsAdmin).NotNull();
        }
    }
}
