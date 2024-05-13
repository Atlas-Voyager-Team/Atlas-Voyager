import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './pages/app/app.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app.routes';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HttpClientModule } from '@angular/common/http';
import { EarthComponent } from './components/earth/earth.component';
import { EarthLoadingComponent } from './components/earth-loading/earth-loading.component';

@NgModule({
    declarations: [AppComponent, ExplorePageComponent, EarthComponent, MainPageComponent, EarthLoadingComponent],
    imports: [BrowserModule, CommonModule, AppRoutingModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
