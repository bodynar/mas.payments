import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgApexchartsModule } from 'ng-apexcharts';

import { StatisticsComponent } from './component/statistics.component';
import { MeasurementStatsComponent } from './components/measurementStats/measurementStats.component';
import { PaymentStatsComponent } from './components/paymentStats/paymentStats.component';
import { StatsComponent } from './components/stats/stats.component';
import { StatsChartComponent } from './components/statsChart/statsChart.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        NgApexchartsModule,
    ],
    exports: [],
    declarations: [
        StatisticsComponent,
        MeasurementStatsComponent, PaymentStatsComponent,
        StatsComponent, StatsChartComponent
    ],
    providers: [],
})
class StatisticsModule { }

export { StatisticsModule };