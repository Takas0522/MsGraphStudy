import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ShowMail } from './models/show-mail.model';
import { MailingListService } from './mailing-list.service';

@Component({
  selector: 'app-mailing-list',
  templateUrl: './mailing-list.component.html',
  styleUrls: ['./mailing-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailingListComponent implements OnInit, OnDestroy {

  dataSource: ShowMail[];
  hoge = 'hoge';
  readonly displayedColumns = ['receivedDateTime', 'subject', 'toRecipients'];

  constructor(
    private service: MailingListService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.service.dataSource$.subscribe(x => {
      console.log(x);
      this.dataSource = x.slice(0, x.length - 1);
      this.changeDetectorRef.detectChanges();
      this.hoge = x.length.toString();
    });
    this.service.getMailData();
  }

  ngOnDestroy(): void {
    this.service.dispose();
  }

}
