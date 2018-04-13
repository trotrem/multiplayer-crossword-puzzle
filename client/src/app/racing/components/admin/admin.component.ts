import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { inject } from "inversify";
import { Track } from "../../track";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

  public tracks: Track[];

  public selectedTrack: Track;

  public isSelected: boolean;

  public constructor(@inject(RacingCommunicationService) private communicationService: RacingCommunicationService, private router: Router) {
    this.tracks = new Array<Track>();
    this.isSelected = false;
  }

  public ngOnInit(): void {
    this.getTracks();
  }

  // TODO changer le nom de getTracks ici (il y a une autre dans communicationService)
  private getTracks(): void {
    this.communicationService.getTracks()
      .subscribe((res: Array<Track>) => {
        this.tracks = res;
      });
  }

  public onSelect(track: Track): void {
    this.selectedTrack = track;
    this.isSelected = true;

  }

  public editTrack(): Track {
    this.router.navigateByUrl("/editor/" + this.selectedTrack.name);

    return this.selectedTrack;
  }

  public deleteTrack(): Track {
    this.communicationService.deleteTrack(this.selectedTrack);

    return this.selectedTrack;
  }

}
