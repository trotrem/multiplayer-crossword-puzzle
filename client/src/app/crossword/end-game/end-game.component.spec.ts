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
    let component: EndGameComponent = new EndGameComponent(route, router);
    let fixture: ComponentFixture<EndGameComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule.withRoutes([
                { path: "homePage", component: HomePageComponent },
                { path: "crossword/:nbPlayers/:Difficulty", component: CrosswordGridComponent }])],
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

    it('navigate to "homePage" takes you to /homePage', fakeAsync(() => {
        router.navigateByUrl("/homePage");
        tick(50);
        expect(router.url).toBe("/homePage");
    }));

    it('navigate to "crossword/nbPlayers/difficulty" takes you to /crossword/nbPlayers/difficulty', fakeAsync(() => {
        const difficulty: Difficulty = "easy";
        const nbPlayers: string = "one";
        router.navigateByUrl("/crossword/" + nbPlayers + "/" + difficulty);
        tick(50);
        expect(router.url).toBe("/crossword/" + nbPlayers + "/" + difficulty);
    }));
});
