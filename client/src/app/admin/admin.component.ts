import { Component, OnInit } from "@angular/core";
import * as THREE from "three";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  private tracks: THREE.Line3[] ;
  public constructor( ) { this.tracks = new Array();
  }

  public ngOnInit(): void {
    this.getTracks();
  }
  private getTracks(): THREE.Line3[] {return this.tracks;
 }
}
