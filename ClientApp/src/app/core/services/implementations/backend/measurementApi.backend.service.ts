import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { isNullOrUndefined } from 'common/utils/common';
import { boxServerResponse, boxServerQueryResponse } from 'common/utils/api';

import { IMeasurementApiBackendService } from 'services/backend/IMeasurementApi.backend';

import MeasurementsFilter from 'models/measurementsFilter';

import CommandExecutionResult from 'models/response/commandExecutionResult';
import QueryExecutionResult from 'models/response/queryExecutionResult';

import { AddMeasurementRequest } from 'models/request/measurement/addMeasurementRequest';
import { AddMeasurementTypeRequest } from 'models/request/measurement/addMeasurementTypeRequest';

import MeasurementResponse from 'models/response/measurements/measurementResponse';
import MeasurementsResponse, { MeasurementsResponseMeasurement } from 'models/response/measurements/measurementsResponse';
import MeasurementTypeResponse from 'models/response/measurements/measurementTypeResponse';

@Injectable()
export class MeasurementApiBackendService implements IMeasurementApiBackendService {

    private readonly apiPrefix: string =
        '/api/measurement';

    constructor(
        private http: HttpClient
    ) {
    }

    // #region measurements

    public addMeasurement(measurementData: AddMeasurementRequest): Observable<CommandExecutionResult> {
        return this.http
            .post(`${this.apiPrefix}/addMeasurement`, measurementData)
            .pipe(
                catchError(error => of(error)),
                map(x => boxServerResponse(x)),
            );
    }

    public getMeasurements(filter?: MeasurementsFilter): Observable<QueryExecutionResult<Array<MeasurementsResponse>>> {
        let params: HttpParams =
            new HttpParams();

        if (!isNullOrUndefined(filter)) {
            if (!isNullOrUndefined(filter.month)) {
                params = params.set('month', `${filter.month + 1}`);
            }
            if (!isNullOrUndefined(filter.year)) {
                params = params.set('year', `${filter.year}`);
            }
            if (!isNullOrUndefined(filter.measurementTypeId)) {
                params = params.set('measurementTypeId', `${filter.measurementTypeId}`);
            }
        }

        const headers: HttpHeaders =
            new HttpHeaders({
                'Content-Type': 'application/json'
            });

        return this.http
            .get(`${this.apiPrefix}/getMeasurements`, { headers, params })
            .pipe(
                map((response: Array<any>) =>
                    response.map(measurement => ({
                        year: measurement['dateYear'],
                        month: measurement['dateMonth'],
                        measurements: measurement['measurements'].map(x => ({
                            id: x['id'],
                            measurement: x['measurement'],
                            comment: x['comment'],
                            meterMeasurementTypeId: x['meterMeasurementTypeId'],
                            measurementTypeName: x['measurementTypeName'],
                            measurementTypeColor: x['measurementTypeColor'],
                            isSent: x['isSent'],
                            year: measurement['dateYear'],
                            month: measurement['dateMonth'],
                        }) as MeasurementsResponseMeasurement),
                    }) as MeasurementsResponse)),
                catchError(error => of(error)),
                map(x => boxServerQueryResponse<Array<MeasurementsResponse>>(x)),
            );
    }

    public getMeasurement(id: number): Observable<QueryExecutionResult<MeasurementResponse>> {
        return this.http
            .get(`${this.apiPrefix}/getMeasurement`, {
                params: new HttpParams({
                    fromObject: { id: `${id}` }
                })
            })
            .pipe(
                map((response: any) =>
                    ({
                        id: response['id'],
                        measurement: response['measurement'],
                        comment: response['comment'],
                        month: response['dateMonth'],
                        year: response['dateYear'],
                        meterMeasurementTypeId: response['meterMeasurementTypeId'],
                        measurementTypeName: response['measurementTypeName'],
                    }) as MeasurementResponse),
                catchError(error => of(error)),
                map(x => boxServerQueryResponse<MeasurementResponse>(x)),
            );
    }

    public updateMeasurement(id: number, measurementData: AddMeasurementRequest): Observable<CommandExecutionResult> {
        return this.http
            .post(`${this.apiPrefix}/updateMeasurement`, { id, ...measurementData })
            .pipe(
                catchError(error => of(error)),
                map(x => boxServerResponse(x)),
            );
    }

    public deleteMeasurement(measurementId: number): Observable<CommandExecutionResult> {
        return this.http
            .post(`${this.apiPrefix}/deleteMeasurement`, measurementId)
            .pipe(
                catchError(error => of(error)),
                map(x => boxServerResponse(x)),
            );
    }

    public sendMeasurements(measurementIds: Array<number>): Observable<CommandExecutionResult> {
        return this.http
            .post(`${this.apiPrefix}/sendMeasurements`, measurementIds)
            .pipe(
                catchError(error => of(error)),
                map(x => boxServerResponse(x)),
            );
    }

    // #endregion measurements

    // #region measurement types

    public addMeasurementType(measurementTypeData: AddMeasurementTypeRequest): Observable<CommandExecutionResult> {
        return this.http
            .post(`${this.apiPrefix}/addMeasurementType`, measurementTypeData)
            .pipe(
                catchError(error => of(error)),
                map(x => boxServerResponse(x)),
            );
    }

    public getMeasurementTypes(): Observable<QueryExecutionResult<Array<MeasurementTypeResponse>>> {
        return this.http
            .get(`${this.apiPrefix}/getMeasurementTypes`)
            .pipe(
                map((response: Array<any>) =>
                    response.map(measurementType => ({
                        id: measurementType['id'],
                        name: measurementType['name'],
                        systemName: measurementType['systemName'],
                        description: measurementType['description'],
                        paymentTypeId: measurementType['paymentTypeId'],
                        paymentTypeName: measurementType['paymentTypeName'],
                        paymentTypeColor: measurementType['paymentTypeColor'],
                        color: measurementType['color'],
                        hasRelatedMeasurements: measurementType['hasRelatedMeasurements'] || false,
                    }) as MeasurementTypeResponse)),
                catchError(error => of(error)),
                map(x => boxServerQueryResponse<Array<MeasurementTypeResponse>>(x)),
            );
    }

    public getMeasurementType(id: number): Observable<QueryExecutionResult<MeasurementTypeResponse>> {
        return this.http
            .get(`${this.apiPrefix}/getMeasurementType`, {
                params: new HttpParams({
                    fromObject: { id: `${id}` }
                })
            })
            .pipe(
                map((response: any) =>
                    ({
                        id: response['id'],
                        name: response['name'],
                        systemName: response['systemName'],
                        description: response['description'],
                        paymentTypeId: response['paymentTypeId'],
                        color: response['color'],
                        paymentTypeName: response['paymentTypeName'],
                    }) as MeasurementTypeResponse),
                catchError(error => of(error)),
                map(x => boxServerQueryResponse<MeasurementTypeResponse>(x)),
            );
    }

    public updateMeasurementType(id: number, measurementTypeData: AddMeasurementTypeRequest): Observable<CommandExecutionResult> {
        return this.http
            .post(`${this.apiPrefix}/updateMeasurementType`, { id, ...measurementTypeData })
            .pipe(
                catchError(error => of(error)),
                map(x => boxServerResponse(x)),
            );
    }

    public deleteMeasurementType(measurementTypeId: number): Observable<CommandExecutionResult> {
        return this.http
            .post(`${this.apiPrefix}/deleteMeasurementType`, measurementTypeId)
            .pipe(
                catchError(error => of(error)),
                map(x => boxServerResponse(x)),
            );
    }

    // #endregion measurement types
}