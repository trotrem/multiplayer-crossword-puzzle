import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { EndGameComponent } from "./end-game.component";
import { HomePageComponent } from "../home-page/home-page.component";
import { CrosswordGridComponent } from "../crossword-grid/crossword-grid.component";
import { CommunicationService } from "../../communication.service";
import { GameConfigurationService } from "../../game-configuration.service";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SocketsService } from "../../sockets.service";

/* tslint:disable:no-magic-numbers*/
describe("EndGameComponent", () => {
    let router: Router;
    let route: ActivatedRoute;
    let communicationService: CommunicationService;
    let gameConfigurationService: GameConfigurationService;
    let component: EndGameComponent;
    let fixture: ComponentFixture<EndGameComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([
                { path: "crossword/homePage", component: HomePageComponent },
                { path: "crossword/game", component: CrosswordGridComponent }])],
            declarations: [EndGameComponent, HomePageComponent, CrosswordGridComponent],
            providers: [CommunicationService, GameConfigurationService, SocketsService]
        })
            .compileComponents();
    }));

    beforeEach(inject(
        [Router, ActivatedRoute, CommunicationService, GameConfigurationService],
        (
            _router: Router, _route: ActivatedRoute,
            _communicationService: CommunicationService, _gameConfigurationService: GameConfigurationService) => {
            route = _route;
            router = _router;
            communicationService = _communicationService;
            gameConfigurationService = _gameConfigurationService;
            fixture = TestBed.createComponent(EndGameComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            communicationService.initialize();
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
