namespace MAS.Payments.Controllers
{
    using System;

    using MAS.Payments.Infrastructure;
    using MAS.Payments.Models;
    using MAS.Payments.Queries;

    using Microsoft.AspNetCore.Mvc;

    [Route("api/stats")]
    public class StatisticsApiController : BaseApiController
    {
        public StatisticsApiController(
            IResolver resolver
        ) : base(resolver)
        {
        }

        [HttpGet("[action]")]
        public GetPaymentStatisticsResponse GetPaymentsStatistics([FromQuery]GetPaymentsStatisticsRequest request)
        {
            if (request == null || !request.Year.HasValue || !request.PaymentTypeId.HasValue)
            {
                throw new Exception("Year and Payment type must be specified.");
            }

            return QueryProcessor.Execute(new GetPaymentStatisticsQuery(request.Year.Value, request.PaymentTypeId.Value));
        }

        [HttpGet("[action]")]
        public GetMeasurementStatisticsQueryResponse GetMeasurementStatistics([FromQuery]GetMeasurementStatisticsRequest request)
        {
            if (request == null || !request.Year.HasValue || !request.MeasurementTypeId.HasValue)
            {
                throw new Exception("Year and Measurement type must be specified.");
            }

            return QueryProcessor.Execute(new GetMeasurementStatisticsQuery(request.Year.Value, request.MeasurementTypeId.Value));
        }
    }
}