import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { inject } from "inversify";
import { GameManagerService } from "../game-manager/game-manager.service";
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
    private lights: string[];
    private playButtonEnabled: boolean;

    public constructor(private route: ActivatedRoute, @inject(GameManagerService) private gameManager: GameManagerService) {
        this.lights = new Array<string>();
        for (let i: number = 0; i < LIGHTS; i++) {
            this.lights.push("");
        }
        this.playButtonEnabled = true;
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.gameManager.onResize();
    }

    public ngAfterViewInit(): void {
        const name: string = this.route.snapshot.paramMap.get("name");
        if (name !== null) {
            this.gameManager.initializeGame(name, this.containerRef);
        }
    }

    private async changeLightColor(color: string, delay: number): Promise<void> {
        for (let i: number = 0; i < LIGHTS; i++) {
            this.lights[i] = color;
            await this.delay(delay).then();
        }

    }
    private async visualSignal(): Promise<void> {
        this.changeLightColor("red", DELAY_BETWEEN_RED);
        await this.delay(DELAY_FOR_RED).then(() => {
            this.changeLightColor("green", 0);
        });
        await this.delay(DELAY).then(() => {
            this.changeLightColor("", 0);
            this.gameManager.startRace();
        });
        await this.delay(DELAY);
    }

    private async delay(ms: number): Promise<{}> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public play(): void {
        this.playButtonEnabled = false;
        this.visualSignal();
    }
}
