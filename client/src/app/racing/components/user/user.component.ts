import { Component, OnInit } from "@angular/core";
import { Track } from "./../../track";
import { Router } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { inject } from "inversify";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

  private tracks: Track[];

  private selectedTrack: Track;

  public constructor(@inject(RacingCommunicationService) private communicationService: RacingCommunicationService, private router: Router) {
    this.tracks = new Array<Track>();
    this.tracks = new Array<Track>();
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
  public showTrack(track: Track): void {
    this.selectedTrack = track;
    this.router.navigateByUrl("/race/" + this.selectedTrack.name);
  }

  public getAttributTracks(): Track[] {
    return this.tracks;
  }

  public setTracks(track: Track[]): void {
    this.tracks = track;
  }
  public getSelectedTrack(): Track {
    return this.selectedTrack;
  }

  public setSelectedTrack(track: Track): void {
    this.selectedTrack = track;
  }

  public getTracksList(): Track[] {
    return this.tracks;
  }
}
