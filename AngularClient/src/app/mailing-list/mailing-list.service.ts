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

  getDataWithFilter() {
    this.dataSource.next([]);
    this.getFilter(this.apiEndPoint);
  }

  private getFilter(api: string) {
    this.graphService.graphClient.api(api).filter('isRead+eq+false').get().then(x => {
      if (x['@odata.nextLink'] !== '' && this.dataSource.getValue().length < 100) {
        const nextLink = x['@odata.nextLink'];
        this.getFilter(nextLink);
      }
      this.adjustMessageToComponent(x.value);
    });
  }

  getDataWithOrder() {
    this.dataSource.next([]);
    this.getOrderData(this.apiEndPoint);
  }

  private getOrderData(api: string) {
    this.graphService.graphClient.api(api).orderby('sender/emailAddress/address%20desc').get().then(x => {
      if (x['@odata.nextLink'] !== '' && this.dataSource.getValue().length < 100) {
        const nextLink = x['@odata.nextLink'];
        this.getOrderData(nextLink);
      }
      this.adjustMessageToComponent(x.value);
    });
  }

  getDataWithSelect() {
    this.dataSource.next([]);
    this.getSelectData(this.apiEndPoint);
  }

  private getSelectData(api: string) {
    this.graphService.graphClient.api(api).select('sender').get().then(x => {
      if (x['@odata.nextLink'] !== '' && this.dataSource.getValue().length < 100) {
        const nextLink = x['@odata.nextLink'];
        this.getSelectData(nextLink);
      }
      this.adjustMessageToComponent(x.value);
    });
  }

  getExpand() {
    this.graphService.graphClient.api('/me').expand('message').get().then(x => {
      console.log(x);
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
