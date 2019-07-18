using System;

namespace MAS.Payments.Infrastructure.Query
{
    public class QueryProcessor : IQueryProcessor
    {
        private IResolver Resolver { get; }

        public QueryProcessor(
            IResolver resolver
        )
        {
            Resolver = resolver;
        }

        public TResult Execute<TResult>(IQuery<TResult> query)
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }

            var handlerType = typeof(IQueryHandler<,>).MakeGenericType(query.GetType(), typeof(TResult));

            dynamic handler = Resolver.GetInstance(handlerType);

            return handler.Handle((dynamic)query);
        }
    }
}