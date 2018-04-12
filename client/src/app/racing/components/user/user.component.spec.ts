import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { UserComponent } from "./user.component";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { GameComponent } from "../racing-game/game-component/game.component";

// tslint:disable:no-floating-promises

describe("UserComponent", () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let router: Router;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserComponent, GameComponent],
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([{ path: "race/:name", component: GameComponent }])]
            ,
            providers: [RacingCommunicationService]
        })
            .compileComponents();
        fixture = TestBed.createComponent(UserComponent);

    }));

    beforeEach(inject([Router], (_router: Router) => {
        router = _router;
        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create user component", () => {
        expect(component).toBeTruthy();
    });

    it("should containts a tracks's list", () => {
        expect(component.tracks).toBeDefined();
    });

    it('navigate to "race/name" takes you to  "race/name"', fakeAsync(() => {
        const name: string = "Laurence";
        router.navigateByUrl("/race/" + name);
        /* tslint:disable */
        tick(50);
        expect(router.url).toBe("/race/" + name);
    }));
    it("each track containts a name ", () => {
        expect(component.tracks).toBeDefined();
    });
    
});
