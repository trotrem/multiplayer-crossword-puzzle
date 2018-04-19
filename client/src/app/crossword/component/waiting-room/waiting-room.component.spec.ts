import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { WaitingRoomComponent } from "./waiting-room.component";
import { RouterTestingModule } from "@angular/router/testing";
import { CommunicationService } from "../../communication-service/communication.service";
import { SocketsService } from "../../sockets/sockets.service";
import { HttpClientModule } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import { CrosswordGridComponent } from "../crossword-grid/crossword-grid.component";
import { Router } from "@angular/router";
import { GameConfigurationService } from "../../game-configuration/game-configuration.service";

describe("WaitingRoomComponent", () => {
    let component: WaitingRoomComponent;
    let router: Router;
    let fixture: ComponentFixture<WaitingRoomComponent>;
    let communicationService: CommunicationService;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            declarations: [CrosswordGridComponent, WaitingRoomComponent],
            imports: [HttpClientModule, RouterTestingModule, RouterTestingModule.withRoutes([
                { path: "crossword/game", component: CrosswordGridComponent }])],
            providers: [CommunicationService, SocketsService, GameConfigurationService]
        })
            .compileComponents();
    }));

    beforeEach(inject([Router, CommunicationService], (_router: Router, _communicationService: CommunicationService) => {
        communicationService = _communicationService;
        router = _router;
        communicationService.initialize();
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should start a game when an opponent is found", () => {
        spyOn(communicationService, "sendEventOnOpponentFound").and.returnValue(Observable.of(null));
        component.ngOnInit();
        expect(communicationService.sendEventOnOpponentFound).toHaveBeenCalled();
    });
});
