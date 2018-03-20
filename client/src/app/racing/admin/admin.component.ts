import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AdminService } from "./../admin.service/admin.service";
import { Track } from "../track-savor/track";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

  private adminService: AdminService;

  private tracks: Track[];

  private selectedTrack: Track;

  private isSelected: boolean;

  public constructor(private http: HttpClient, private router: Router) {
    this.adminService = new AdminService(this.http);
    this.tracks = new Array<Track>();
    this.selectedTrack = new Track();
    this.isSelected = false;
  }
  public setTracks(tracks: Track[]): void {
    this.tracks = tracks;
  }
  public setSelectedTrack(track: Track): void {
    this.selectedTrack = track;
  }
  public setisSelected(bool: boolean): void {
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
  public getAdminService(): AdminService {
    return this.adminService;
  }

  public ngOnInit(): void {
    this.getTracks();
  }

  private getTracks(): void {
    this.adminService.getTracksService()
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
    this.adminService.deleteTrack(this.selectedTrack);

    return this.selectedTrack;
  }

  public notReadyToModify(): boolean {
    return !this.isSelected;
  }

}
