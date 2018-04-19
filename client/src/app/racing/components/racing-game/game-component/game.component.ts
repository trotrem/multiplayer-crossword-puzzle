import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GameManagerService } from "../../../services/game-manager/game-manager.service";
import { KeyboardEventService } from "../../../commands/keyboard-event.service";
const LIGHTS: number = 3;
const DELAY_BETWEEN_RED: number = 600;
const DELAY: number = 1000;
const DELAY_FOR_RED: number = 1500;
const EVENT: string = "$event";
const RED: string = "red";
const GREEN: string = "green";
const RESIZE: string = "window:resize";
const KEYDOWN: string = "document:keydown";
const KEYUP: string = "document:keyup";
const NAME: string = "name";
const CANVAS: string = "canvas";
const USER: string = "/user";
@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [GameManagerService, KeyboardEventService]
})
export class GameComponent implements AfterViewInit {

    @ViewChild(CANVAS)
    private canvasRef: ElementRef;
    private lights: string[];
    private playButtonEnabled: boolean;

    public constructor(
        private route: ActivatedRoute, private router: Router,
        private gameManager: GameManagerService, private keyboard: KeyboardEventService) {
        this.lights = new Array<string>();
        for (let i: number = 0; i < LIGHTS; i++) {
            this.lights.push("");
        }
        this.playButtonEnabled = true;
    }

    @HostListener(RESIZE, [EVENT])
    public onResize(): void {
        this.gameManager.onResize();
    }

    @HostListener(KEYDOWN, [EVENT])
    public onKeyPressed(event: KeyboardEvent): void {
        this.keyboard.executeKeyUpCommands(event.keyCode);
    }

    @HostListener(KEYUP, [EVENT])
    public onKeyReleased(event: KeyboardEvent): void {
        this.keyboard.executeKeyDownCommands(event.keyCode);
    }

    public async ngAfterViewInit(): Promise<void> {
        const name: string = this.route.snapshot.paramMap.get(NAME);
        if (name !== null) {
            await this.gameManager.initializeGame(name, this.canvasRef, this.keyboard);
        }
    }

    public async play(): Promise<void> {
        this.playButtonEnabled = false;
        await this.visualSignal();
    }
    public return(): void {
        this.router.navigateByUrl(USER);
    }

    private async changeLightColor(color: string, delay: number): Promise<void> {
        for (let i: number = 0; i < LIGHTS; i++) {
            this.lights[i] = color;
            await this.delay(delay).then();
        }

    }
    private async visualSignal(): Promise<void> {
        await this.changeLightColor(RED, DELAY_BETWEEN_RED);
        await this.delay(DELAY_FOR_RED).then(async () => {
            await this.changeLightColor(GREEN, 0);
        });
        await this.delay(DELAY).then(async () => {
            await this.changeLightColor("", 0);
            this.gameManager.startRace();
        });
        await this.delay(DELAY);
    }

    private async delay(ms: number): Promise<{}> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
