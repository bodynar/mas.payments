import { Observable } from 'rxjs';

import { MeasurementsFilter } from 'models/measurementsFilter';
import { AddMeasurementRequest } from 'models/request/addMeasurementRequest';
import { AddMeasurementTypeRequest } from 'models/request/addMeasurementTypeRequest';
import { MeasurementResponse } from 'models/response/measurementResponse';
import { MeasurementTypeResponse } from 'models/response/measurementTypeResponse';

abstract class IMeasurementService {
    abstract getMeasurement(id: number): Observable<MeasurementResponse>;

    abstract getMeasurementType(id: number): Observable<MeasurementTypeResponse>;

    abstract addMeasurementType(measurementTypeData: AddMeasurementTypeRequest): Observable<boolean>;

    abstract addMeasurement(measurementData: AddMeasurementRequest): Observable<boolean>;

    abstract updateMeasurementType(id: number, measurementTypeData: AddMeasurementTypeRequest): Observable<boolean>;

    abstract updateMeasurement(id: number, measurementData: AddMeasurementRequest): Observable<boolean>;

    abstract getMeasurementTypes(): Observable<Array<MeasurementTypeResponse>>;

    abstract getMeasurements(filter?: MeasurementsFilter): Observable<Array<MeasurementResponse>>;

    abstract deleteMeasurementType(measurementTypeId: number): Observable<boolean>;

    abstract deleteMeasurement(measurementId: number): Observable<boolean>;
}

export { IMeasurementService };