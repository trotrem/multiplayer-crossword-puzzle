import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"]
})
export class HomePageComponent implements OnInit {

  public constructor( private router: Router) { }

  public ngOnInit(): void {
  }

  public play(form: NgForm): void {
    console.warn(form.value.EasyMediumHard);
    this.router.navigateByUrl("/crossword/" + form.value.EasyMediumHard);
  }
}
