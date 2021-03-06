namespace MAS.Payments.Commands
{

    using MAS.Payments.Infrastructure.Command;

    public class DeleteMeterMeasurementCommand : ICommand
    {
        public long MeterMeasurementId { get; set; }

        public DeleteMeterMeasurementCommand(long meterMeasurementId)
        {
            MeterMeasurementId = meterMeasurementId;
        }
    }
}