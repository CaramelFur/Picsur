import { PortalModule } from '@angular/cdk/portal';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  TRANSLATE_HTTP_LOADER_CONFIG,
  TranslateHttpLoader,
} from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './components/header/header.module';
import { GuardsModule } from './guards/guards.module';
import { ApiErrorManagerModule } from './util/api-error-manager/api-error-manager.module';
import { CompatibilityManagerModule } from './util/compatibilitiy-manager/compatibility-manager.module';
import { SnackBarManagerModule } from './util/snackbar-manager/snackbar-manager.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
      },
    }),
    PortalModule,
    MatSidenavModule,

    SnackBarManagerModule.forRoot(),
    CompatibilityManagerModule,
    ApiErrorManagerModule,

    GuardsModule,
    AppRoutingModule,

    HeaderModule,
    FooterModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', color: 'accent' },
    },
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: '/assets/i18n/',
        suffix: '.json',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
