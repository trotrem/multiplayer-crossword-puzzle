import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { GameResultsComponent } from "./game-results.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ITrack } from "./../../track";
import * as THREE from "three";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { INewScores, IBestScores } from "../../../../../../common/communication/types-racing";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

/* tslint:disable:no-magic-numbers */

describe("GameResultsComponent", () => {
    let component: GameResultsComponent;
    let fixture: ComponentFixture<GameResultsComponent>;
    let route: ActivatedRoute;
    let track: ITrack = {
        name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
        INewScores: new Array<INewScores>(), IBestScores: new Array<IBestScores>()
    };
    track.INewScores.push({ idCar: 2, scoresCar: new Array<number>() });
    track.INewScores.push({ idCar: 1, scoresCar: new Array<number>() });
    track.INewScores.push({ idCar: 0, scoresCar: new Array<number>() });
    track.IBestScores.push({ namePlayer: "Amal", scorePlayer: 10 });
    track.IBestScores.push({ namePlayer: "Amal", scorePlayer: 10 });
    track.IBestScores.push({ namePlayer: "Amal", scorePlayer: 10 });
    track.IBestScores.push({ namePlayer: "Amal", scorePlayer: 10 });
    track.IBestScores.push({ namePlayer: "Amal", scorePlayer: 30 });

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            declarations: [GameResultsComponent],
            imports: [
                BrowserDynamicTestingModule,
                FormsModule,
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: "gameResults/:CarIndex", component: GameResultsComponent }])],
            providers: [RacingCommunicationService]
        })
            .compileComponents();
        fixture = TestBed.createComponent(GameResultsComponent);

    }));

    beforeEach(inject([Router], (_route: ActivatedRoute) => {
        route = _route;
        fixture = TestBed.createComponent(GameResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    it("should get a track by name", async () => {
        expect(component.getTrack(track.name)).toBeDefined();
    });
    it("should return the track's newScores  ", async () => {
        route.snapshot.params = { params: track.name };
        track = await component.getTrack(track.name);
        expect(component.scores === track.INewScores).toBe(true);
    });

    it("should return the track's BestScores  ", async () => {
        route.snapshot.params = { params: track.name };
        track = await component.getTrack(track.name);
        expect(component.bestScores === track.IBestScores).toBe(true);
    });

    it(" IsNotBestScore() return true when the human car is not in first position   ", () => {
        void component.getTrack(track.name);
        expect(component.isNotBestScore()).toBeFalsy();
    });
    it(" IsNotBestScore() return false when the human car is in first position and have the best score  ", () => {
        component.newBestScore = { namePlayer: "Amal", scorePlayer: 10 };
        void component.getTrack(track.name);
        expect(component.isNotBestScore()).toBeFalsy();
    });

});
