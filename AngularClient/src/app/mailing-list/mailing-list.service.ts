import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShowMail } from './models/show-mail.model';
import { GraphService } from '../graph.service';
import { Message } from '@microsoft/microsoft-graph-types';

@Injectable({
  providedIn: 'root'
})
export class MailingListService {

  private dataSource: BehaviorSubject<ShowMail[]> = new BehaviorSubject<ShowMail[]>([]);
  get dataSource$() {
    return this.dataSource.asObservable();
  }
  private apiEndPoint = '/me/messages';

  constructor(
    private graphService: GraphService
  ) { }

  getMailData() {
    this.dataSource.next([]);
    this.getMail(this.apiEndPoint);
  }

  private getMail(api: string) {
    this.graphService.graphClient.api(api).get().then(x => {
      if (x['@odata.nextLink'] !== '' && this.dataSource.getValue().length < 100) {
        const nextLink = x['@odata.nextLink'];
        this.getMail(nextLink);
      }
      this.adjustMessageToComponent(x.value);
    });
  }

  private adjustMessageToComponent(messages: Message[]) {
    const pushMessages: ShowMail[] = this.dataSource.getValue();
    messages.forEach(x => {
      const toRecipientsSt = `${x.sender.emailAddress.name}(${x.sender.emailAddress.address})`;
      pushMessages.push({ subject: x.subject, receivedDateTime: x.receivedDateTime, toRecipients: toRecipientsSt });
    });
    this.dataSource.next(pushMessages);
  }

  dispose() {
    this.dataSource.complete();
  }

}
