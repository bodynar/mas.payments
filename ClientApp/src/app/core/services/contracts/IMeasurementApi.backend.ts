import { Observable } from 'rxjs';

import { AddMeasurementRequest } from 'models/request/addMeasurementRequest';
import { AddMeasurementTypeRequest } from 'models/request/addMeasurementTypeRequest';
import { MeasurementResponse } from 'models/response/measurementResponse';
import { MeasurementTypeResponse } from 'models/response/measurementTypeResponse';

abstract class IMeasurementApiBackendService {
    abstract addMeasurementType(MeasurementTypeData: AddMeasurementTypeRequest): Observable<any>;

    abstract addMeasurement(MeasurementData: AddMeasurementRequest): Observable<any>;

    abstract getMeasurementTypes(): Observable<Array<MeasurementTypeResponse>>;

    abstract getMeasurements(): Observable<Array<MeasurementResponse>>;
}

export { IMeasurementApiBackendService };