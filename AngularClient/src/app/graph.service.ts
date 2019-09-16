import { Injectable } from '@angular/core';
import * as graph from '@microsoft/microsoft-graph-client';
import { AuthService } from './auth.service';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { User, Calendar, Message } from '@microsoft/microsoft-graph-types';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GraphService {

    private client: graph.Client;
    get graphClient() {
        return this.client;
    }
    private roopCount = 0;

    constructor(
        private authService: AuthService
    ) {}

    myMessage: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    initClient() {
        this.client = graph.Client.init({
            authProvider: async (done) => {
                const token = await this.authService.acquireToken();
                if (token) {
                    done(null, token.accessToken);
                } else {
                    done('Can not Get Token', null);
                }
            }
        });
    }

    getMe(): Observable<User> {
        return from(this.client.api('/me').get());
    }

    getMeEvent(startDateTime: Date, endDateTime: Date): Observable<Calendar> {
        return from(this.client.api(`/me/calendarView?startDateTime=${startDateTime.toJSON}&endDateTime=${endDateTime.toJSON}`).get());
    }

    getMail() {
        this.roopCount = 0;
        this.client.api('/me/messages')
            .filter('isRead+eq+false')
            .select('subject, receivedDateTime')
            .get().then(x => {
            if (x['@odata.nextLink'] !== '') {
                const nextLink = x['@odata.nextLink'];
                this.getNextLinkData(nextLink);
            }
            const messageList = this.myMessage.value;
            (x.value as Message[]).forEach(element => {
                messageList.push(element);
            });
            this.myMessage.next(messageList);
        });
    }

    getNextLinkData(nextLink: string) {
        this.roopCount++;
        this.client.api(nextLink)
            .filter('isRead+eq+false')
            .select('subject, receivedDateTime')
            .get().then(x => {
            if (x['@odata.nextLink'] !== '' && this.roopCount < 10) {
                const nestNextLink = x['@odata.nextLink'];
                this.getNextLinkData(nestNextLink);
            }
            const messageList = this.myMessage.value;
            (x.value as Message[]).forEach(element => {
                messageList.push(element);
            });
            this.myMessage.next(messageList);
        });
    }
}
