using System;

namespace Bookshelf.Core
{
    public class ResetTokenUpdateDto
    {
        public int UserId { get; set; }
        public Guid Token { get; set; }
        public string Password { get; set; }
    }
}