namespace MAS.Payments.Commands
{
    using MAS.Payments.DataBase;
    using MAS.Payments.DataBase.Access;
    using MAS.Payments.Infrastructure;
    using MAS.Payments.Infrastructure.Command;
    using MAS.Payments.Infrastructure.Exceptions;
    using MAS.Payments.Infrastructure.Extensions;
    using MAS.Payments.Infrastructure.Specification;

    internal class AddPaymentTypeCommandHandler : BaseCommandHandler<AddPaymentTypeCommand>
    {
        private IRepository<PaymentType> Repository { get; }

        public AddPaymentTypeCommandHandler(
            IResolver resolver
        ) : base(resolver)
        {
            Repository = GetRepository<PaymentType>();
        }

        public override void Handle(AddPaymentTypeCommand command)
        {
            var isUnique =
                !Repository.GetAll().Any(
                    new CommonSpecification<PaymentType>(x => x.Name == command.Name && x.Company == command.Company));

            if (!isUnique)
            {
                throw new CommandExecutionException(CommandType,
                    $"Payment type with name {command.Name} from {command.Company} is already exist");
            }

            var paymentType = new PaymentType
            {
                Name = command.Name,
                Description = command.Description,
                Company = command.Company,
                Color = command.Color,
            };

            Repository.Add(paymentType);
        }
    }
}