import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ReplaySubject, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { isNullOrUndefined } from 'util';
import { months } from 'src/static/months';
import { years } from 'src/common/years';

import { IMeasurementService } from 'services/IMeasurementService';
import { INotificationService } from 'services/INotificationService';
import { IRouterService } from 'services/IRouterService';

import { AddMeasurementRequest } from 'models/request/addMeasurementRequest';
import { MeasurementTypeResponse } from 'models/response/measurementTypeResponse';

@Component({
    templateUrl: 'updateMeasurement.template.pug'
})
class UpdateMeasurementComponent implements OnInit, OnDestroy {

    public measurementRequest: AddMeasurementRequest =
        {};

    public measurementTypes$: Subject<Array<MeasurementTypeResponse>> =
        new ReplaySubject(1);

    public whenSubmittedForm$: Subject<NgForm> =
        new ReplaySubject(1);

    public months$: Subject<Array<{ id?: number, name: string }>> =
      new ReplaySubject(1);

    public years$: Subject<Array<{ id?: number, name: string }>> =
      new ReplaySubject(1);


    private measurementId: number;

    private whenComponentDestroy$: Subject<null> =
        new Subject();

    constructor(
        private activatedRoute: ActivatedRoute,
        private measurementService: IMeasurementService,
        private notificationService: INotificationService,
        private routerService: IRouterService,
    ) {
        this.activatedRoute
            .queryParams
            .pipe(
                filter(params => !isNullOrUndefined(params['id']) && params['id'] !== 0),
                map(params => params['id']),
                tap(id => this.measurementId = id),
                switchMap(id => this.measurementService.getMeasurement(id))
            )
          .subscribe(params =>
            this.measurementRequest = {
                year: params.year,
                comment: params.comment,
                measurement: params.measurement,
                meterMeasurementTypeId: params.meterMeasurementTypeId,
                month: (parseInt(params.month) - 1).toString()
            }
          );

        this.whenSubmittedForm$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                filter(({ valid }) => valid && this.isFormValid()),
                tap(_ => {
                  this.measurementRequest.month = (parseInt(this.measurementRequest.month) + 1).toString();
                }),
                switchMap(_ => this.measurementService.updateMeasurement(this.measurementId, this.measurementRequest)),
                filter(withoutError => {
                    if (!withoutError) {
                        this.notificationService.error('Error due saving data. Please, try again later');
                    } else {
                        this.notificationService.success('Measurement was successfully updated.');
                    }

                    return withoutError;
                })
            )
            .subscribe(_ => this.routerService.navigateUp());
    }

    public ngOnInit(): void {
        this.measurementService
            .getMeasurementTypes()
            .pipe(takeUntil(this.whenComponentDestroy$))
            .subscribe(measurementTypes => this.measurementTypes$.next([{
                name: '',
                systemName: '',
            }, ...measurementTypes]));

      const currentDate = new Date();

      this.months$.next(months);
      this.years$.next(years(currentDate.getFullYear() - 40, currentDate.getFullYear() + 40));
    }

    public ngOnDestroy(): void {
        this.whenComponentDestroy$.next(null);
        this.whenComponentDestroy$.complete();
    }

    public onFormSubmit(form: NgForm): void {
        this.whenSubmittedForm$.next(form);
    }

    private isFormValid(): boolean {
        // todo: fix => make normal validator on field
        let isFormValid: boolean =
            true;

        if (!isNullOrUndefined(this.measurementRequest.measurement)) {
            const measurementValue: number =
                parseFloat(`${this.measurementRequest.measurement}`);

            if (Number.isNaN(measurementValue)) {
                isFormValid = false;
            }
        }
        return isFormValid;
    }
}

export { UpdateMeasurementComponent };