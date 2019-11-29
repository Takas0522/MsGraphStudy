import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as msal from 'msal';
import { AuthOptions } from 'msal/lib-commonjs/Configuration';

const SETTING_STORAGE_KEY = 'ad-access-setting';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  fg: FormGroup;
  msalClient: msal.UserAgentApplication;
  account: msal.Account;
  accessToken = '';

  constructor(
    private fb: FormBuilder
  ) {
    this.formInit();
    this.valueInit();
  }

  get isLogin() {
    return (typeof(this.account) !== 'undefined' && this.account !== null);
  }

  private formInit() {
    this.fg = this.fb.group({
      clientId: ['', Validators.required],
      scopes: ['', Validators.required]
    });
  }

  private valueInit() {
    const val = localStorage.getItem(SETTING_STORAGE_KEY);
    if (typeof(val) !== 'undefined' && val !== null && val !== '') {
      this.fg.patchValue(JSON.parse(val));
      this.authInit();
    }
  }

  private authInit() {
    const options: AuthOptions = {
      clientId: this.fg.value.clientId
    };
    this.msalClient = new msal.UserAgentApplication({ auth: options });
  }

  async auth() {
    this.saveSetting();
    this.authInit();
    const scopes = (this.fg.value.scopes as string).split(',');
    await this.msalClient.loginPopup({ scopes });
    this.account = this.msalClient.getAccount();
  }

  private saveSetting() {
    const val = JSON.stringify(this.fg.value);
    localStorage.setItem(SETTING_STORAGE_KEY, val);
  }

  async aquireToken() {
    const scopes = (this.fg.value.scopes as string).split(',');
    const res = await this.msalClient.acquireTokenSilent({scopes});
    this.accessToken =  res.accessToken;
  }

  copyClipBoard() {
    const copyTarget: any = document.getElementById('access-token');
    copyTarget.select();
    document.execCommand('copy');
  }
}
