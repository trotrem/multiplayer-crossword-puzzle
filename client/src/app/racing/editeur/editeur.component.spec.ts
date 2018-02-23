import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";
import { EditeurComponent } from "./editeur.component";
import { HttpClient , HttpClientModule} from "@angular/common/http";
import { TrackServices } from "./track-services";
import { Track } from "./track";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */

describe("EditeurComponent", () => {
    const http: HttpClient;
    let component: EditeurComponent = new EditeurComponent(http);
    let fixture: ComponentFixture<EditeurComponent>;
    const trackService: TrackServices = new TrackServices(http);
    const track: Track = new Track();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditeurComponent ],
            imports: [HttpModule, FormsModule, HttpClientModule],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ EditeurComponent ],
            imports: [HttpModule, FormsModule, HttpClientModule],
           //  providers: [TrackService]
          });
        fixture = TestBed.createComponent(EditeurComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the EditeurComponent", () => {
        expect(component).toBeDefined();
    });

    it("should create a scene", () => {
        component.createScene();
        expect(component.getScene().children.length).toBe(0);
    });

    it("should create a point", () => {
        const position: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        component.createPoint(position);
        expect(component.getScene().children.length).toBe(1);
    });

    it("should create a segment", () => {
        const points: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        points.push(position1);
        component.points = points;
        const position2: THREE.Vector3 = new THREE.Vector3(23, -2, 0);
        component.createLine(position1, position2);
        expect(component.getScene().children.length).toBe(1);
    });
   /* it("should save track when save button is clicked", () => {
         fixture.debugElement.nativeElement.querySelector("button").click();
         fixture.detectChanges();
        // expect(service).toBeTruthy();
         expect(trackService.saveTrackService(track)).toHaveBeenCalled();
    });*/
});
