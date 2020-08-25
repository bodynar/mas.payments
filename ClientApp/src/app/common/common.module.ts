import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ColorValidatorDirective } from './directives/colorValidator/colorValidator.directive';
import { HexColorValidatorDirective } from './directives/hexColorValidator/hexColorValidator.directive';
import { PositiveNumberValidatorDirective } from './directives/positiveNumberValidator/positiveNumber.directive';

import { PaginatorComponent } from './components/paginator/component/paginator.component';
import { BadgeComponent } from './components/badge/badge.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        PaginatorComponent,
        BadgeComponent,
        ColorValidatorDirective,
        HexColorValidatorDirective,
        PositiveNumberValidatorDirective,
    ],
    declarations: [
        PaginatorComponent,
        BadgeComponent,
        ColorValidatorDirective,
        HexColorValidatorDirective,
        PositiveNumberValidatorDirective,
    ],
    providers: [],
})
export class AppCommonModule { }