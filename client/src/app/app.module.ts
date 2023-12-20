import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './pages/app/app.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { EarthComponent } from './components/earth/earth.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app.routes';
import { MainPageComponent } from './pages/main-page/main-page.component';

@NgModule({
    declarations: [AppComponent, ExplorePageComponent, EarthComponent, MainPageComponent],
    imports: [BrowserModule, CommonModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
