import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Track } from "../track";
import * as THREE from "three";
const LIGHTS: number = 3;
const DELAY_BETWEEN_RED: number = 600;
const DELAY: number = 1000;
const DELAY_FOR_RED: number = 1500;

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
    private renderService: RenderService;
    private lights: string[];
    private disabledCar: boolean;

    public constructor(private route: ActivatedRoute, private http: HttpClient) {
        this.communicationService = new CommunicationRacingService(this.http);
        this.renderService = new RenderService();
        this.lights = new Array<string>();
        for (let i: number = 0; i < LIGHTS; i++) {
            this.lights.push("");
        }
        this.disabledCar = true;
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    public ngAfterViewInit(): void {
        const name: string = this.route.snapshot.paramMap.get("name");
        if (name !== null) {
            this.getTrack(name);
        }
    }

    private async changeLightColor(color: string, delay: number): Promise<void> {
        for (let i: number = 0; i < LIGHTS; i++) {
            this.lights[i] = color;
            await this.delay(delay);
        }

    }
    private async visualSignal(): Promise<void> {
        this.changeLightColor("red", DELAY_BETWEEN_RED);
        await this.delay(DELAY_FOR_RED);
        this.changeLightColor("green", 0);
        await this.delay(DELAY);
        this.changeLightColor("", 0);
        this.disabledCar = false;
        this.renderService.initializeEventHandlerService();
        await this.delay(DELAY);
    }

    private delay(ms: number): Promise<boolean> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private getTrack(name: string): void {
        this.communicationService.getTrackByName(name)
            .subscribe((res: Track[]) => {
                const track: Track = res[0];
                this.renderService.initialize(this.containerRef.nativeElement, track.startingZone, track.points);

            });

    }

    private play(): void {
        this.visualSignal();
    }
}
