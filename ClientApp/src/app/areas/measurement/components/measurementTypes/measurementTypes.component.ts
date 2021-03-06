import { Component } from '@angular/core';

import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { filter, switchMap, switchMapTo, takeUntil, map, tap } from 'rxjs/operators';

import { IMeasurementService } from 'services/IMeasurementService';
import { INotificationService } from 'services/INotificationService';
import { IRouterService } from 'services/IRouterService';

import { BaseRoutingComponentWithModalComponent } from 'common/components/BaseComponentWithModal';
import { IModalService } from 'src/app/components/modal/IModalService';

import PaginatorConfig from 'sharedComponents/paginator/paginatorConfig';

import MeasurementTypeResponse from 'models/response/measurements/measurementTypeResponse';
import { getPaginatorConfig } from 'sharedComponents/paginator/paginator';

@Component({
    templateUrl: 'measurementTypes.template.pug',
    styleUrls: ['measurementTypes.style.styl']
})
export class MeasurementTypesComponent extends BaseRoutingComponentWithModalComponent {
    public hasData$: Subject<boolean> =
        new BehaviorSubject(false);

    public isLoading$: Subject<boolean> =
        new BehaviorSubject(false);

    public measurementTypes$: Subject<Array<MeasurementTypeResponse>> =
        new ReplaySubject(1);

    public paginatorConfig$: Subject<PaginatorConfig> =
        new ReplaySubject(1);

    private whenTypeDelete$: Subject<number> =
        new Subject();

    private whenTypeEdit$: Subject<number> =
        new Subject();

    private whenGetMeasurementTypes$: Subject<null> =
        new Subject();

    private measurementTypes: Array<MeasurementTypeResponse> =
        [];

    private pageSize: number =
        10;

    constructor(
        private measurementService: IMeasurementService,
        private notificationService: INotificationService,
        modalService: IModalService,
        routerService: IRouterService,
    ) {
        super(routerService, modalService);

        this.whenComponentInit$
            .pipe(tap(_ => { this.measurementTypes$.next([]); }))
            .subscribe(() => this.whenGetMeasurementTypes$.next(null));

        this.whenGetMeasurementTypes$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                tap(_ => this.isLoading$.next(true)),
                switchMapTo(this.measurementService.getMeasurementTypes()),
                tap(_ => this.isLoading$.next(false)),
                filter(response => {
                    if (!response.success) {
                        this.notificationService.error(response.error);
                    }

                    return response.success;
                }),
            )
            .subscribe(({ result }) => {
                this.measurementTypes = result;

                const paginatorConfig: PaginatorConfig =
                    getPaginatorConfig(this.measurementTypes, this.pageSize);

                if (paginatorConfig.enabled) {
                    this.onPageChange(0);
                } else {
                    this.measurementTypes$.next(this.measurementTypes);
                }

                this.hasData$.next(result.length > 0);
                this.paginatorConfig$.next(paginatorConfig);
            });

        this.whenTypeDelete$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                filter(id => id !== 0),
                switchMap(id => {
                    if (this.measurementTypes.find(x => x.id === id).hasRelatedMeasurements) {
                        return this.confirmInModal(
                            'Warning! Measurement type related with measurements.',
                            'Measurement type related with measurements.\nAre you sure want to delete it?\nDependant measurements will be deleted.'
                        ).pipe(map(response => ({ id, canDelete: response })));
                    } else {
                        return this.confirmDelete()
                            .pipe(map(canDelete => ({ id, canDelete })));
                    }
                }),
                filter(({ canDelete }) => canDelete),
                tap(_ => this.isLoading$.next(true)),
                switchMap(({ id }) => this.measurementService.deleteMeasurementType(id)),
                tap(_ => this.isLoading$.next(false)),
                filter(response => {
                    if (!response.success) {
                        this.notificationService.error(response.error);
                    } else {
                        this.notificationService.success('Delete performed sucessfully');
                    }

                    return response.success;
                }),
            )
            .subscribe(() => this.whenGetMeasurementTypes$.next(null));

        this.whenTypeEdit$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                filter(id => id !== 0),
            )
            .subscribe(id => this.routerService.navigateArea(
                ['updateType'],
                { queryParams: { id } }
            ));
    }

    public onDeleteClick(typeId: number): void {
        this.whenTypeDelete$.next(typeId);
    }

    public onEditClick(typeId: number): void {
        this.whenTypeEdit$.next(typeId);
    }

    public onAddClick(): void {
        this.routerService.navigateArea(['addType']);
    }

    public onPageChange(pageNumber: number): void {
        const slicedItems: Array<MeasurementTypeResponse> =
            this.measurementTypes.slice(this.pageSize * pageNumber, (pageNumber + 1) * this.pageSize);

        this.measurementTypes$.next(slicedItems);
    }
}