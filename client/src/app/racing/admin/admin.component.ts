import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Track } from "../track";
import { Router } from "@angular/router";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

  private communicationService: CommunicationRacingService;

  private tracks: Track[];

  private selectedTrack: Track;

  private isSelected: boolean;

  public constructor(private http: HttpClient, private router: Router) {
    this.communicationService = new CommunicationRacingService(this.http);
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
    return this.isSelected ;
  }
  public getRouter(): Router {
    return this.router;
  }
  public getHttp(): HttpClient {
    return this.http;
  }
  public getCommunicationService(): CommunicationRacingService {
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
