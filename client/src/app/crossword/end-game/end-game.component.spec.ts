import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { EndGameComponent } from "./end-game.component";
import { HomePageComponent } from "../home-page/home-page.component";
import { CrosswordGridComponent } from "../crossword-grid/crossword-grid.component";
import { Difficulty } from "../../../../../common/communication/types";

/* tslint:disable:no-magic-numbers*/
describe("EndGameComponent", () => {
    let router: Router;
    let route: ActivatedRoute;
    let component: EndGameComponent = new EndGameComponent(router, route);
    let fixture: ComponentFixture<EndGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule.withRoutes([
                { path: "crossword/homePage", component: HomePageComponent },
                { path: "crossword/game", component: CrosswordGridComponent }])],
            declarations: [EndGameComponent, HomePageComponent, CrosswordGridComponent]
        })
            .compileComponents();
    }));

    beforeEach(inject([Router, ActivatedRoute], (_router: Router, _route: ActivatedRoute) => {
        route = _route;
        router = _router;
        fixture = TestBed.createComponent(EndGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("returnHome takes you to /crossword/homePage", fakeAsync(() => {
        component.returnHome();
        tick(50);
        expect(router.url).toBe("/crossword/homePage");
    }));

    it("playSameConfig takes you to /crossword/game", fakeAsync(() => {
        component.playSameCongif();
        tick(50);
        expect(router.url).toBe("/crossword/game");
    }));
});
