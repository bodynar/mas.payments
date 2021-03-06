import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddMeasurementComponent } from './components/addMeasurement/addMeasurement.component';
import { AddMeasurementTypeComponent } from './components/addMeasurementType/addMeasurementType.component';
import { MeasurementListComponent } from './components/measurementList/measurementList.component';
import { MeasurementTypesComponent } from './components/measurementTypes/measurementTypes.component';
import { UpdateMeasurementComponent } from './components/updateMeasurement/updateMeasurement.component';
import { UpdateMeasurementTypeComponent } from './components/updateMeasurementType/updateMeasurementType.component';

const routes: Routes = [
    {
        path: '',
        component: MeasurementListComponent
    },
    {
        path: 'add',
        component: AddMeasurementComponent
    },
    {
        path: 'update',
        component: UpdateMeasurementComponent
    },
    {
        path: 'types',
        component: MeasurementTypesComponent
    },
    {
        path: 'addType',
        component: AddMeasurementTypeComponent
    },
    {
        path: 'updateType',
        component: UpdateMeasurementTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class MeasurementRoutingModule { }