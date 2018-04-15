import { Component, OnInit } from "@angular/core";
import { Track } from "./../../track";
import { Router } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

  public tracks: Track[];

  public selectedTrack: Track;

  public constructor(private communicationService: RacingCommunicationService, private router: Router) {
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
}
