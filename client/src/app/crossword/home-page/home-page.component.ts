import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { SocketsService } from "../sockets.service";
import { inject } from "inversify";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"]
})
export class HomePageComponent implements OnInit {

    public constructor(private router: Router, @inject(SocketsService) private socketsService: SocketsService ) { }

  public ngOnInit(): void {
  }

  public play(form: NgForm): void {
    this.router.navigate(["/crossword/" + form.value.oneTwo + "/", { Difficulty: form.value.EasyMediumHard }]);
      this.socketsService.initSocket();
      this.socketsService.send({title: "such", body: "wows"});
  }
}
