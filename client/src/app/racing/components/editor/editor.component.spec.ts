import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { EditorComponent } from "./editor.component";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { RenderEditorService } from "./render-editor.service/render-editor.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SceneEditorService } from "./scene-editor.service/scene-editor.service";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ITrack } from "../../track";
import * as THREE from "three";
import { INewScores, IBestScores } from "../../../../../../common/communication/types-racing";

describe("EditorComponent", () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let route: ActivatedRoute;
    const track: ITrack = {
        name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
        INewScores: new Array<INewScores>(), IBestScores: new Array<IBestScores>()
    };
    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            declarations: [EditorComponent],
            imports: [
                FormsModule,
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: "editor/:name", component: EditorComponent }])],
            providers: [RacingCommunicationService, RenderEditorService,
                        SceneEditorService]
        })
            .compileComponents();
    }));

    beforeEach(inject([Router], (_route: ActivatedRoute) => {
        route = _route;
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    it("the track to edit should have a name", async () => {
        route.snapshot.params = { params: track.name };
        void component.getTrack(track.name);
        expect(component.track.name).toBe("Laurence");
    });
    it("the track to edit should have a description", async () => {
        route.snapshot.params = { params: track.name };
        void component.getTrack(track.name);
        expect(component.track.description).toBe(track.description);
    });
});
