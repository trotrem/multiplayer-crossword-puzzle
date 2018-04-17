import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from "@angular/core/testing";
import { HomePageComponent } from "./home-page.component";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { Difficulty } from "../../../../../common/communication/types";
import { CrosswordGridComponent } from "../crossword-grid/crossword-grid.component";
import { CommunicationService } from "../communication.service";
import { GameConfigurationService } from "../game-configuration.service";

/* tslint:disable:no-magic-numbers*/
describe("HomePageComponent", () => {
    let router: Router;
    let config: GameConfigurationService;
    let communcation: CommunicationService;
    let component: HomePageComponent = new HomePageComponent(router, communcation, config);
    let fixture: ComponentFixture<HomePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomePageComponent, CrosswordGridComponent],
            imports: [FormsModule, RouterTestingModule.withRoutes([
                { path: "crossword/game", component: CrosswordGridComponent }])]
        })
            .compileComponents();
    }));

    beforeEach(inject([Router], (_router: Router) => {
        router = _router;
        communcation = new CommunicationService();
        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it('navigate to "crossword/nbPlayers/difficulty" takes you to /crossword/nbPlayers/difficulty', fakeAsync(() => {
        const difficulty: Difficulty = Difficulty.Easy;
        const nbPlayers: string = "one";
        router.navigateByUrl("/crossword/game");
        tick(50);
        expect(router.url).toBe("/crossword/game");
    }));
});
