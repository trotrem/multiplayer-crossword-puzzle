import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { GameComponent } from "./game-component/game.component";
import { RouterModule, Routes } from "@angular/router";
import { RenderService } from "./render-service/render.service";
import { BasicService } from "./basic.service";
import { EditeurComponent } from "./editeur/editeur.component";
import { AdminComponent } from "./admin/admin.component";
const appRoutes: Routes = [
  { path: "Editeur", component: EditeurComponent },
  { path: "Admin", component: AdminComponent },

];

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        EditeurComponent,
        AdminComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(
            appRoutes
          )
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
