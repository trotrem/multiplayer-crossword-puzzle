import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GameManagerService } from "../game-manager/game-manager.service";
import { Keyboard } from "../commands/keyboard";
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

    public constructor(private route: ActivatedRoute, private gameManager: GameManagerService, private keyboard: Keyboard ) {
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

    @HostListener("document:keydown", ["$event"])
    public onKeyPressed(event: KeyboardEvent): void {
        this.keyboard.executeKeyUpCommands(event.keyCode);
    }

    @HostListener("document:keyup", ["$event"])
    public onKeyReleased(event: KeyboardEvent): void {
        this.keyboard.executeKeyDownCommands(event.keyCode);
    }

    public async ngAfterViewInit(): Promise<void> {
        const name: string = this.route.snapshot.paramMap.get("name");
        if (name !== null) {
            await this.gameManager.initializeGame(name, this.containerRef);
        }
    }

    private async changeLightColor(color: string, delay: number): Promise<void> {
        for (let i: number = 0; i < LIGHTS; i++) {
            this.lights[i] = color;
            await this.delay(delay).then();
        }

    }
    private async visualSignal(): Promise<void> {
        await this.changeLightColor("red", DELAY_BETWEEN_RED);
        await this.delay(DELAY_FOR_RED).then(async() => {
        await this.changeLightColor("green", 0);
        });
        await this.delay(DELAY).then(async() => {
            await this.changeLightColor("", 0);
            this.gameManager.startRace();
        });
        await this.delay(DELAY);
    }

    private async delay(ms: number): Promise<{}> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public async play(): Promise<void> {
        this.playButtonEnabled = false;
        await this.visualSignal();
    }
}
