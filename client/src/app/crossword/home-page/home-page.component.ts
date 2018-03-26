import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
// import { Difficulty } from "../../../../../common/communication/types";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"]
})
export class HomePageComponent implements OnInit {

  public constructor(private router: Router) { }

  public ngOnInit(): void {
  }

  public play(form: NgForm): void {
    this.router.navigate(["/crossword/" + form.value.oneTwo + "/", { Difficulty: form.value.EasyMediumHard }]);
  }
}
