import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { UserComponent } from "./user.component";
import { Routes, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Track } from "../track";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";

import * as THREE from "three";

describe("UserComponent", () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserComponent],
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [CommunicationRacingService]
        })
            .compileComponents();
        fixture = TestBed.createComponent(UserComponent);

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create user component", () => {
        expect(component).toBeTruthy();
    });

    it("should containts a tracks's list", () => {
        expect(component.getTracksList()).toBeDefined();
      });

});
