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

  public tracks: Track[];

  public selectedTrack: Track;

  public constructor(@inject(RacingCommunicationService) private communicationService: RacingCommunicationService, private router: Router) {
    this.tracks = new Array<Track>();
    this.tracks = new Array<Track>();
  }

  public ngOnInit(): void {
    this.getTracks();
  }

  // TODO : possible de mettre ensemble ??
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
