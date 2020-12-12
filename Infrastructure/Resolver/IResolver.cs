namespace MAS.Payments.Infrastructure
{
    using System;

    public interface IResolver
    {
        TService Resolve<TService>()
            where TService : class;

        object GetInstance(Type serviceType);
    }
}
