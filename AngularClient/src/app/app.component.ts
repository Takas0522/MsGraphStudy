import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { GraphService } from './graph.service';
import { User, Event as IEvent } from '@microsoft/microsoft-graph-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private user: User;

  get displayName() {
    return (typeof this.user) !== 'undefined' ? this.user.displayName : '';
  }
  events: IEvent[] = [];

  constructor(
    private authService: AuthService,
    private graphService: GraphService
  ) {}

  ngOnInit() {
    if (!this.authService.account) {
      this.authService.loginPopup();
    } else {
      this.graphService.initClient();
      this.graphService.getMe().subscribe(x => {
        this.user = x;
      });
    }
  }

  getMeEvent() {
    const fromDate = new Date();
    const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, fromDate.getDate());
    this.graphService.getMeEvent(fromDate, toDate).subscribe(x => {
      this.events = x.events;
    });
  }

  getMeMail() {
    this.graphService.getMail().subscribe(x => {
      console.log(x);
    });
  }
}
