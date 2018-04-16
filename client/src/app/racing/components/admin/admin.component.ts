import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { ITrack } from "../../track";
import { INewScores, IBestScores } from "../../../../../../common/communication/interfaces";
import * as THREE from "three";

const EDITOR: string = "/editor/";
@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

    public tracks: ITrack[];
    public selectedTrack: ITrack;

    public isSelected: boolean;

    public constructor(private communicationService: RacingCommunicationService, private router: Router) {
        this.tracks = new Array<ITrack>();
        this.isSelected = false;
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

    public onSelect(track: ITrack): void {
        this.selectedTrack = track;
        this.isSelected = true;

    }

    public editTrack(): ITrack {
        this.router.navigateByUrl(EDITOR + this.selectedTrack.name);

        return this.selectedTrack;
    }

    public deleteTrack(): ITrack {
        this.communicationService.deleteTrack(this.selectedTrack);

        return this.selectedTrack;
    }

}
