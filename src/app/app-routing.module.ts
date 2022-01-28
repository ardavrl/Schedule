import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

const routes: Route [] = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
