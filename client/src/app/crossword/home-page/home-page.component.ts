import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Difficulty } from "../../../../../common/communication/types";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"]
})
export class HomePageComponent implements OnInit {

  private difficulty: Difficulty;

  public constructor( private router: Router) { }

  public ngOnInit(): void {
  }

  public play(form: NgForm): void {
    // this.router.navigateByUrl("/crossword/" + form.value.EasyMediumHard);
    this.difficulty = form.value.EasyMediumHard;
    console.warn(form.value.EasyMediumHard);
    this.router.navigate(["/crossword/", { Difficulty: form.value.EasyMediumHard }]);
  }
}
