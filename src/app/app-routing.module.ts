import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () =>redirectLoggedInTo(['home']);
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'tutorials',
    loadChildren: () => import('./tutorials/tutorials.module').then( m => m.TutorialsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'report-case',
    loadChildren: () => import('./report-case/report-case.module').then( m => m.ReportCasePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'report-details/:ctg/:type',
    loadChildren: () => import('./report-details/report-details.module').then( m => m.ReportDetailsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./auth/password-reset/password-reset.module').then( m => m.PasswordResetPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./auth/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },
  {
    path: 'links',
    loadChildren: () => import('./links/links.module').then( m => m.LinksPageModule)
  },
  {
    path: 'report-categories/:title',
    loadChildren: () => import('./report-categories/report-categories.module').then( m => m.ReportCategoriesPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./quiz/start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'question',
    loadChildren: () => import('./quiz/question/question.module').then( m => m.QuestionPageModule)
  },
  {
    path: 'results',
    loadChildren: () => import('./quiz/results/results.module').then( m => m.ResultsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'quiz-category:id',
    loadChildren: () => import('./quiz/quiz-category/quiz-category.module').then( m => m.QuizCategoryPageModule)
  },
  {
    path: 'note',
    loadChildren: () => import('./note/note.module').then( m => m.NotePageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'view-report/:id',
    loadChildren: () => import('./view-report/view-report.module').then( m => m.ViewReportPageModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
