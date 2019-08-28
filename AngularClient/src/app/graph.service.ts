import { Injectable } from '@angular/core';
import * as graph from '@microsoft/microsoft-graph-client';
import { AuthService } from './auth.service';
import { Observable, from } from 'rxjs';
import { User, Calendar } from '@microsoft/microsoft-graph-types';

@Injectable({
    providedIn: 'root'
})
export class GraphService {

    private client: graph.Client;
    constructor(
        private authService: AuthService
    ) {}

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
}
