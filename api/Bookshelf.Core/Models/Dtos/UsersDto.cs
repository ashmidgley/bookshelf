using System.Collections.Generic;

namespace Bookshelf.Core
{
    public class UsersDto
    {
        public IEnumerable<UserDto> Users { get; set; }
        public bool HasMore { get; set; }
    }
}