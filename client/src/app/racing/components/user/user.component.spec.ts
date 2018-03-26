import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { UserComponent } from "./user.component";
import { Routes, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Track } from "../track";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";

import * as THREE from "three";
import { GameComponent } from "../game-component/game.component";

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
            providers: [CommunicationRacingService]
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
        expect(component.getTracksList()).toBeDefined();
    });

    it('navigate to "race/name" takes you to  "race/name"', fakeAsync(() => {
        const name: string = "Laurence";
        router.navigateByUrl("/race/" + name);
        /* tslint:disable */
        tick(50);
        expect(router.url).toBe("/race/" + name);
    }));

});
