import { Component } from '@angular/core';

import { ReplaySubject, Subject, Observable, BehaviorSubject } from 'rxjs';
import { filter, switchMap, switchMapTo, takeUntil, map, tap } from 'rxjs/operators';

import { getPaginatorConfig } from 'sharedComponents/paginator/paginator';
import PaginatorConfig from 'sharedComponents/paginator/paginatorConfig';

import { BaseRoutingComponentWithModalComponent } from 'common/components/BaseComponentWithModal';

import { INotificationService } from 'services/INotificationService';
import { IPaymentService } from 'services/IPaymentService';

import { IRouterService } from 'services/IRouterService';
import { IModalService } from 'src/app/components/modal/IModalService';

import PaymentTypeResponse from 'models/response/payments/paymentTypeResponse';

@Component({
    templateUrl: 'paymentTypes.template.pug',
    styleUrls: ['paymentTypes.style.styl']
})
export class PaymentTypesComponent extends BaseRoutingComponentWithModalComponent {
    public paymentTypes$: Subject<Array<PaymentTypeResponse>> =
        new ReplaySubject(1);

    public paginatorConfig$: Subject<PaginatorConfig> =
        new ReplaySubject(1);

    public hasData$: Subject<boolean> =
        new BehaviorSubject(false);

    public isLoading$: Subject<boolean> =
        new BehaviorSubject(false);

    private whenTypeDelete$: Subject<number> =
        new Subject();

    private whenTypeEdit$: Subject<number> =
        new Subject();

    private whenGetPaymentTypes$: Subject<null> =
        new Subject();

    private paymentTypes: Array<PaymentTypeResponse> =
        [];

    private pageSize: number =
        5;

    constructor(
        private paymentService: IPaymentService,
        private notificationService: INotificationService,
        modalService: IModalService,
        routerService: IRouterService,
    ) {
        super(routerService, modalService);

        this.whenComponentInit$
            .subscribe(() => this.whenGetPaymentTypes$.next(null));

        this.whenGetPaymentTypes$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                tap(_ => this.isLoading$.next(true)),
                switchMapTo(this.paymentService.getPaymentTypes()),
                tap(_ => this.isLoading$.next(false)),
                filter(response => {
                    if (!response.success) {
                        this.notificationService.error(response.error);
                    }
                    return response.success;
                }),
            )
            .subscribe(({ result }) => {
                this.paymentTypes = result;

                const paginatorConfig: PaginatorConfig =
                    getPaginatorConfig(this.paymentTypes, this.pageSize);

                if (paginatorConfig.enabled) {
                    this.onPageChange(0);
                } else {
                    this.paymentTypes$.next(this.paymentTypes);
                }

                this.hasData$.next(result.length > 0);
                this.paginatorConfig$.next(paginatorConfig);
            });

        this.whenTypeDelete$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                filter(id => id !== 0),
                switchMap(id => this.hasRelatedObjects(id)),
                filter(({ canDelete }) => canDelete),
                switchMap(({ id }) => this.paymentService.deletePaymentType(id)),
                filter(response => {
                    if (!response.success) {
                        this.notificationService.error(response.error);
                    } else {
                        this.notificationService.success('Delete performed sucessfully');
                    }
                    return response.success;
                }),
            )
            .subscribe(() => this.whenGetPaymentTypes$.next(null));

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
        const slicedItems: Array<PaymentTypeResponse> =
            this.paymentTypes.slice(this.pageSize * pageNumber, (pageNumber + 1) * this.pageSize);

        this.paymentTypes$.next(slicedItems);
    }

    private hasRelatedObjects(id: number): Observable<{ id: number, canDelete: boolean }> {
        const { hasRelatedPayments, hasRelatedMeasurementTypes } = this.paymentTypes.find(x => x.id === id);

        if (hasRelatedPayments || hasRelatedMeasurementTypes) {
            const relatedObjectsName: string =
                hasRelatedPayments && hasRelatedMeasurementTypes
                    ? 'payments and measurement types'
                    : hasRelatedPayments
                        ? 'payments'
                        : hasRelatedMeasurementTypes
                            ? 'measurement types'
                            : '';

            return this.confirmInModal(
                'Warning! Payment type related with objects.',
                `Type related with ${relatedObjectsName}.\nAre you sure want to delete it?\nDependant ${relatedObjectsName} will be deleted.`)
                .pipe(map(response => ({ id, canDelete: response })));
        } else {
            return this.confirmDelete().pipe(map(canDelete => ({ id, canDelete })));
        }
    }
}