import { Component, OnInit, ViewChild, ElementRef  } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Track } from "./../editeur/track";
import { ActivatedRoute } from "@angular/router";
import { SceneServices } from "./../scene.services/scene.service";
import { TrackServices } from "../track.services/track.service";
import { PrintTrackService } from "./../user/print-track.service";
import { UserService } from "../user/user.service";
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

  private sceneService: SceneServices;

  private printTrackService: PrintTrackService;

  private userService: UserService;

  private get canvas(): HTMLCanvasElement {
      return this.canvasRef.nativeElement;
  }

  public constructor(private route: ActivatedRoute, private http: HttpClient) {
      this.track = new Track();
      this.printTrackService = new PrintTrackService();
      this.userService = new UserService(this.http);
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
      });
}

}
