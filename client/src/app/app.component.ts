import { Component, OnInit } from "@angular/core";

import { BasicService } from "./basic.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {

    public constructor(private basicService: BasicService) { }

    public readonly title: string = "LOG2990";
    public message: string;
}
