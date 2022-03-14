import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './components/header/header.module';
import { GuardsModule } from './guards/guards.module';
import { routes } from './routes/routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    GuardsModule,
    AppRoutingModule,

    HeaderModule,
    FooterModule,

    ...routes,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
