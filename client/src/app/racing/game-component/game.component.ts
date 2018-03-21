import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import { PrintCarsService } from "../printCar.service/print-cars.service";
import { PrintTrackService } from "../print-track.service/print-track.service";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Track } from "../track";
import * as THREE from "three";
const CARS_MAX: number = 4;

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})

export class GameComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    private communicationService: CommunicationRacingService;
    private cars: Car[];
    private chosenCarIndex: number;
    private renderService: RenderService;

    public constructor(private route: ActivatedRoute, private http: HttpClient) {
        this.communicationService = new CommunicationRacingService(this.http);
        this.cars = new Array<Car>(CARS_MAX);
        this.chosenCarIndex = 0;
        this.renderService = new RenderService();

    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.renderService.handleKeyDown(event);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.renderService.handleKeyUp(event);
    }

    public ngAfterViewInit(): void {
        const name: string = this.route.snapshot.paramMap.get("name");
        if (name !== null) {
              this.getTrack(name);
            }

    }
    private getTrack(name: string): void {
        this.communicationService.getTrackByName(name)
          .subscribe((res: Track[]) => {
            const track: Track = res[0];
            this.renderService.initialize(this.containerRef.nativeElement, track.startingZone, this.cars);
            this.renderService.drawTrack(track.points);

          });

        }

    public getCars(): Car[] {
        return this.cars;
    }
}
