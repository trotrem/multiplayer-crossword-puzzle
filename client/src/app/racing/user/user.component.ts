import { Component, OnInit } from "@angular/core";
import { UserServices} from "./user-services";
import {Track } from "./../editeur/track";
import {Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

  private userServices: UserServices;

  private tracks: Track[];

  private selectedTrack: Track;

  private isSelected: boolean;

  public constructor(private http: HttpClient, private router: Router) {
    this.userServices = new UserServices(this.http);
    this.tracks = new Array<Track>();
  }

  public ngOnInit(): void {
    this.getTracks();
  }
  private getTracks(): void {
    this.userServices.getTracksService()
      .subscribe((res: Array<Track>) => {
        this.tracks = res;
      });
    }
  public onSelect(track: Track): void {
    this.selectedTrack = track;
    this.isSelected = true;
    console.warn(this.selectedTrack);
    }

}
