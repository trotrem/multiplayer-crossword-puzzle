import { Component, OnInit, ViewChild, ElementRef  } from "@angular/core";
import { Track } from "./../track-savor/track";
import { ActivatedRoute, Router } from "@angular/router";
import { PrintTrackService } from "../print-track.service/print-track.service";
import { UserService } from "../user.service/user.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-race",
  templateUrl: "./race.component.html",
  styleUrls: ["./race.component.css"]
})
export class RaceComponent implements OnInit {

  @ViewChild("canvas")

  private canvasRef: ElementRef;

  private track: Track;

  private printTrackService: PrintTrackService;

  private userService: UserService;

  private get canvas(): HTMLCanvasElement {
      return this.canvasRef.nativeElement;
  }

  public constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
      this.track = new Track();
      this.printTrackService = new PrintTrackService();
      this.userService = new UserService(this.http);
  }

  public setTrack(track: Track): void {
    this.track = track;
    }

  public ngOnInit(): void {
    this.printTrackService.initialize(this.canvas);
    const name: string = this.route.snapshot.paramMap.get("name");
    if (name !== null) {
      this.getTrack(name);
    }

}

  private getTrack(name: string): void {
    this.userService.getTrackServiceByName(name)
      .subscribe((res: Track[]) => {
          this.track = res[0];
          this.printTrackService.drawTrack(this.track.points);
          this.printTrackService.insertCars(this.track.startingZone);
          console.warn(this.printTrackService.getScene());
          console.warn(this.track.startingZone);
      });
}
  public showTrack(): void {
    this.router.navigateByUrl("/race/" + this.track.name + "/play/");
  }

}
