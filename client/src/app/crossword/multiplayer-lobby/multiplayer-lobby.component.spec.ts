import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiplayerLobbyComponent } from "./multiplayer-lobby.component";
import { CommunicationService } from "../communication.service";
import { SocketsService } from "../sockets.service";
import { HttpClientModule } from "@angular/common/http";
import { GameConfigurationService } from "../game-configuration.service";
import { RouterTestingModule } from "@angular/router/testing";

describe("MultiplayerLobbyComponent", () => {
    let component: MultiplayerLobbyComponent;
    let fixture: ComponentFixture<MultiplayerLobbyComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            declarations: [MultiplayerLobbyComponent],
            imports: [HttpClientModule, RouterTestingModule],
            providers: [CommunicationService, SocketsService, GameConfigurationService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerLobbyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
