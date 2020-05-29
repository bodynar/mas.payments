import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ReplaySubject, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { isNullOrUndefined } from 'util';

import { INotificationService } from 'services/INotificationService';
import { IStatisticsService } from 'services/IStatisticsService';

import { PaymentStatsResponse } from 'models/response/payments/paymentStatsResponse';
import { StatisticsFilter } from 'models/statisticsFilter';

@Component({
    templateUrl: 'stats.template.pug',
    styleUrls: ['stats.style.styl']
})
class StatsComponent implements OnDestroy {

    public statisticsFilter: StatisticsFilter = {
        includeMeasurements: true,
    };

    public stats$: Subject<Array<PaymentStatsResponse>> =
        new ReplaySubject(1);

    public dates$: Subject<Array<Date>> =
        new ReplaySubject(1);

    private whenSubmitForm$: Subject<NgForm> =
        new Subject();

    private whenComponentDestroy$: Subject<null> =
        new Subject();

    constructor(
        private statisticsService: IStatisticsService,
        private notificationService: INotificationService,
    ) {
        this.whenSubmitForm$
            .pipe(
                takeUntil(this.whenComponentDestroy$),
                switchMap(_ => this.statisticsService.getPaymentStatistics(this.statisticsFilter)),
                filter(response => {
                    if (!response.success) {
                        this.notificationService.error(response.error);
                    }
                    return response.success;
                }),
            )
            .subscribe(({ result }) => {
                this.stats$.next(result.items);

                if (this.statisticsFilter.includeMeasurements && !isNullOrUndefined(result.dates)) {
                    this.dates$.next(result.dates);
                }
            });
    }

    public ngOnDestroy(): void {
        this.whenComponentDestroy$.next(null);
        this.whenComponentDestroy$.complete();
    }

    public onFormSubmit(): void {
        this.whenSubmitForm$.next();
    }
}

export { StatsComponent };