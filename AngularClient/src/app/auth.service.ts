import { Injectable } from '@angular/core';
import * as msal from 'msal';
import { environment } from 'src/environments/environment';
import { AuthenticationParameters } from 'msal';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private authClient: msal.UserAgentApplication;

    constructor() {
        this.authClient = new msal.UserAgentApplication(environment.msalConf);
        this.authClient.handleRedirectCallback((err, res) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                console.log(res);
            }
        });
    }

    get account(): msal.Account {
        return this.authClient.getAccount();
    }

    async loginPopup(): Promise<msal.AuthResponse> {
        const accessScopes = environment.graphConf.scopes;
        const param: AuthenticationParameters = { scopes: accessScopes };
        await this.authClient.loginPopup(param);
        return this.acquireToken();
    }

    acquireToken(): Promise<msal.AuthResponse> {
        const accessScopes = environment.graphConf.scopes;
        const param: AuthenticationParameters = { scopes: accessScopes };
        return this.authClient.acquireTokenSilent(param);
    }

}
