import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    MatToolbarModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  exports: [
    MatToolbarModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ]
})
export class MaterialModule { }
