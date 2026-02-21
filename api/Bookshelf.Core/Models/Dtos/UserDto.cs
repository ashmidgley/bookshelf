using System;

namespace Bookshelf.Core
{
    public class UserDto
    {
      public int Id { get; set; }
      public string Email { get; set; }
      public bool IsAdmin { get; set; }
      public Guid? PasswordResetToken { get; set; }
      public DateTime? PasswordResetExpiry { get; set; }
    }
}