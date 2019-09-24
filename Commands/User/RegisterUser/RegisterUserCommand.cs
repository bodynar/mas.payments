using System;

using MAS.Payments.Infrastructure.Command;

namespace MAS.Payments.Commands
{
    public class RegisterUserCommand : ICommand
    {
        public string Login { get; }

        public string PasswordHash { get; }

        public string Email { get; }

        public string FirstName { get; }

        public string LastName { get; }

        public string Token { get; set; }

        public RegisterUserCommand(string login, string passwordHash, string email, string firstName, string lastName)
        {
            Login = login ?? throw new ArgumentException(nameof(login));
            PasswordHash = passwordHash ?? throw new ArgumentException(nameof(passwordHash));
            Email = email ?? throw new ArgumentException(nameof(email));
            FirstName = firstName;
            LastName = lastName;
        }
    }
}