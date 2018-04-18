import { Component, OnInit } from "@angular/core";
import { ITrack } from "./../../track";
import { Router } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { INewScores, IBestScores } from "../../../../../../common/communication/interfaces";
import * as THREE from "three";
const RACE: string = "/race/";
@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

    public tracks: ITrack[];

    public selectedTrack: ITrack;

    public constructor(private communicationService: RacingCommunicationService, private router: Router) {
        this.tracks = new Array<ITrack>();
        this.selectedTrack = {
            name: "", description: "", startingZone: new THREE.Line3(), points: new Array<THREE.Vector3>(),
            usesNumber: 0, INewScores: new Array<INewScores>(), IBestScores: new Array<IBestScores>()
        };

    }

    public ngOnInit(): void {
        this.getTracks();
    }
    private getTracks(): void {
        this.communicationService.getTracks()
            .subscribe((res: Array<ITrack>) => {
                this.tracks = res;
            });
    }
    public showTrack(track: ITrack): void {
        this.selectedTrack = track;
        this.router.navigateByUrl(RACE + this.selectedTrack.name);
    }
}
