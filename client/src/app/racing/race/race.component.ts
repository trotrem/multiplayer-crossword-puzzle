import { Component, OnInit, ViewChild, ElementRef  } from "@angular/core";
import { Track } from "./../track";
import { ActivatedRoute } from "@angular/router";
import { PrintTrackService } from "../print-track.service/print-track.service";
import { HttpClient } from "@angular/common/http";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";

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

  private communicationService: CommunicationRacingService;

  private get canvas(): HTMLCanvasElement {
      return this.canvasRef.nativeElement;
  }

  public constructor(private route: ActivatedRoute, private http: HttpClient) {
      // this.track = new Track();
      this.printTrackService = new PrintTrackService();
      this.communicationService = new CommunicationRacingService(this.http);
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
    this.communicationService.getTrackByName(name)
      .subscribe((res: Track[]) => {
          this.track = res[0];
          this.printTrackService.drawTrack(this.track.points);
      });
}

}
