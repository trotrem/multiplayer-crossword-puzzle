import { Component, OnInit } from "@angular/core";
import { Track } from "../../track";
import { Router } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { inject } from "inversify";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

  private tracks: Track[];

  private selectedTrack: Track;

  private isSelected: boolean;

  public constructor(@inject(RacingCommunicationService) private communicationService: RacingCommunicationService, private router: Router) {
    this.tracks = new Array<Track>();
    this.isSelected = false;
  }
  public setTracks(tracks: Track[]): void {
    this.tracks = tracks;
  }
  public setSelectedTrack(track: Track): void {
    this.selectedTrack = track;
  }
  public setIsSelected(bool: boolean): void {
    this.isSelected = bool;
  }
  public getSelectedTrack(): Track {
    return this.selectedTrack;
  }
  public getTracksList(): Track[] {
    return this.tracks;
  }
  public getisSelected(): boolean {
    return this.isSelected;
  }
  public getRouter(): Router {
    return this.router;
  }

  public getCommunicationService(): RacingCommunicationService {
    return this.communicationService;
  }

  public ngOnInit(): void {
    this.getTracks();
  }

  private getTracks(): void {
    this.communicationService.getTracks()
      .subscribe((res: Array<Track>) => {
        this.tracks = res;
      });
  }

  public onSelect(track: Track): void {
    this.selectedTrack = track;
    this.isSelected = true;
    console.warn(this.selectedTrack);
  }

  public editTrack(): Track {
    this.router.navigateByUrl("/editor/" + this.selectedTrack.name);

    return this.selectedTrack;
  }

  public deleteTrack(): Track {
    this.communicationService.deleteTrack(this.selectedTrack);

    return this.selectedTrack;
  }

  public notReadyToModify(): boolean {
    return !this.isSelected;
  }

}
