import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MeasurementsComponent } from './component/measurement.component';
import { AddMeasurementComponent } from './components/addMeasurement/addMeasurement.component';
import { AddMeasurementTypeComponent } from './components/addMeasurementType/addMeasurementType.component';
import { MeasurementComponent } from './components/measurement/measurement.component';
import { MeasurementListComponent } from './components/measurementList/measurementList.component';
import { MeasurementTypesComponent } from './components/measurementTypes/measurementTypes.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    exports: [],
    declarations: [
        MeasurementsComponent, AddMeasurementComponent, AddMeasurementTypeComponent,

        MeasurementListComponent, MeasurementComponent, MeasurementTypesComponent
    ],
    providers: [],
})
class MeasurementModule { }

export { MeasurementModule };