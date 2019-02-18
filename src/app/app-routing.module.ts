import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AboutComponent } from './pages/about/about.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseComponent } from './pages/course/course.component';
import { SessionComponent } from './pages/session/session.component';

import { AuthGuard } from '../app/core/auth.guard';

const routes: Routes = [
  { path:"", component: HomeComponent},
  { path:"login", component: LoginComponent},
  { path:"signup", component: SignupComponent},
  { path:"about", component: AboutComponent},
  { path:"courses", component: CoursesComponent, canActivate: [AuthGuard]},
  { path:"course/:id", component:CourseComponent, canActivate: [AuthGuard]},
  { path:"session/:id", component:SessionComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo:'/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
