import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WaitingRoomComponent } from "./waiting-room.component";
import { RouterTestingModule } from "@angular/router/testing";
import { CommunicationService } from "../communication.service";
import { SocketsService } from "../sockets.service";
import { HttpClientModule } from "@angular/common/http";

describe("WaitingRoomComponent", () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [WaitingRoomComponent],
            providers: [CommunicationService, SocketsService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
