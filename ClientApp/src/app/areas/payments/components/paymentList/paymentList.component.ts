import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { delay, filter, switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators';

import { isNullOrUndefined } from 'util';

import { INotificationService } from 'services/INotificationService';
import { IPaymentService } from 'services/IPaymentService';
import { IRouterService } from 'services/IRouterService';

import { PaymentsFilter } from 'models/paymentsFilter';
import PaymentResponse from 'models/response/payments/paymentResponse';
import PaymentTypeResponse from 'models/response/payments/paymentTypeResponse';

import { months } from 'src/static/months';

@Component({
    templateUrl: 'paymentList.template.pug',
    styleUrls: ['paymentList.style.styl']
})
class PaymentListComponent implements OnInit, OnDestroy {
    public filters: PaymentsFilter =
        {};

    public payments$: Subject<Array<PaymentResponse>> =
        new Subject();

    public paymentTypes$: Subject<Array<PaymentTypeResponse>> =
        new Subject();

    public isLoading$: Subject<boolean> =
        new BehaviorSubject(true);

    public months: Array<{ name: string, id?: number }>;

    public actions: Array<string> =
        ['add', 'types'];

    public amountFilterType$: BehaviorSubject<string> =
        new BehaviorSubject('');


    private whenSubmitFilters$: Subject<null> =
        new Subject();

    private whenPaymentDelete$: Subject<number> =
        new Subject();

    private whenPaymentEdit$: Subject<number> =
        new Subject();

    private whenComponentDestroy$: Subject<null> =
        new Subject();

    constructor(
        private paymentService: IPaymentService,
        private routerService: IRouterService,
        private notificationService: INotificationService,
    ) {
        this.months = [{ name: '' }, ...months];

        this.whenSubmitFilters$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                tap(_ => this.isLoading$.next(true)),
                switchMap(_ => this.paymentService.getPayments(this.filters)),
                tap(_ => this.isLoading$.next(false)),
                filter(response => {
                    if (!response.success) {
                        this.notificationService.error(response.error);
                    }
                    return response.success;
                }),
            )
            .subscribe(({ result }) => this.payments$.next(result));

        this.whenPaymentDelete$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                filter(id => id !== 0),
                switchMap(id => this.paymentService.deletePayment(id)),
                filter(response => {
                    if (!response.success) {
                        this.notificationService.error(response.error);
                    }
                    return response.success;
                }),
                switchMapTo(this.paymentService.getPayments(this.filters)),
                filter(response => {
                    if (!response.success) {
                        this.notificationService.error(response.error);
                    }
                    return response.success;
                }),
                tap(_ => this.notificationService.success('Delete performed sucessfully'))
            )
            .subscribe(({ result }) => this.payments$.next(result));

        this.whenPaymentEdit$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                filter(id => id !== 0)
            )
            .subscribe(id =>
                this.routerService.navigateDeep(
                    ['update'],
                    { queryParams: { 'id': id } }
                )
            );
    }

    public ngOnInit(): void {
        this.paymentService
            .getPaymentTypes()
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                filter(response => {
                    if (!response.success) {
                        this.notificationService.error(response.error);
                    }
                    return response.success;
                }),
            )
            .subscribe(({ result }) => {
                this.paymentTypes$.next([{
                    name: '',
                    systemName: '',
                }, ...result]);
                this.whenSubmitFilters$.next();
            });
    }

    public ngOnDestroy(): void {
        this.whenComponentDestroy$.next(null);
        this.whenComponentDestroy$.complete();
    }

    public onActionClick(actionName: string): void {
        this.routerService.navigateDeep([actionName]);
    }

    public onSubmitClick(): void {
        this.whenSubmitFilters$.next();
    }

    public onAmountFilterChanged(filterType: string): void {
        const availableTypes: Array<string> =
            ['between', 'exactly'];

        if (availableTypes.includes(filterType.toLowerCase())) {
            this.filters.amount = {};
        } else {
            this.filters.amount = undefined;
        }
        this.amountFilterType$.next(filterType.toLowerCase());
    }

    public onDeleteRecordClick(paymentId: number): void {
        this.whenPaymentDelete$.next(paymentId);
    }

    public onEditRecordClick(paymentId: number): void {
        this.whenPaymentEdit$.next(paymentId);
    }

    public onTypeClick(paymentTypeId: number): void {
        if (!isNullOrUndefined(paymentTypeId) && paymentTypeId !== 0) {
            this.filters.paymentTypeId = paymentTypeId;

            this.onSubmitClick();
        }
    }

    public clearFilters(): void {
        this.filters = {};

        this.onSubmitClick();
    }
}

export { PaymentListComponent };