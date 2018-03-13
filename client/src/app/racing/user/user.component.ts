import { Component, OnInit } from "@angular/core";
// import { UserService } from "../user.service/user.service";
import { Track } from "./../track";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { PrintTrackService } from "../print-track.service/print-track.service";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

  private communicationService: CommunicationRacingService;

  private tracks: Track[];

  private selectedTrack: Track;

  private printTrackService: PrintTrackService;

  public constructor(private http: HttpClient, private router: Router) {
    this.communicationService = new CommunicationRacingService(this.http);
    this.tracks = new Array<Track>();
    this.printTrackService = new PrintTrackService();
    this.tracks = new Array<Track>();
    // this.selectedTrack = new Track();
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
}
