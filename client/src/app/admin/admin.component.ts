import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AdminServices } from "./admin.services";
//import { Response } from "@angular/http";
import { Track } from "../editeur/track";


@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  private adminServices: AdminServices;

  private tracks: Track[];

  public constructor(private http: HttpClient) {
    this.adminServices = new AdminServices(this.http);
  }

  public ngOnInit(): void {
    this.getTracks();
  }

  private getTracks(): void {
    this.adminServices.getTracksService()
      .subscribe((res: Array<Track>) => this.tracks = res);
  }





}
