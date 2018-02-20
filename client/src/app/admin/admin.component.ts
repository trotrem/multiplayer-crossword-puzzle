import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AdminServices } from "./admin.services";
//import { Response } from "@angular/http";
import { Track } from "../editeur/track";


@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  private adminServices: AdminServices;

  private tracks: Track[];

  private selectedTrack: Track;

  private isSelected: boolean;

  public constructor(private http: HttpClient) {
    this.adminServices = new AdminServices(this.http);
    this.tracks = new Array<Track>();
    this.selectedTrack = new Track();
    this.isSelected = false;
  }

  public ngOnInit(): void {
    this.getTracks();
  }

  private getTracks(): void {
    this.adminServices.getTracksService()
      .subscribe((res: Array<Track>) => this.tracks = res);
  }

  private onSelect(track: Track) {
    this.selectedTrack = track;
    this.isSelected = true;
  }

  private editTrack(): void {
  }

  private deleteTrack(): void {
  }

  
  private notReadyToModify(): boolean {
    return !this.isSelected;
  }

}
