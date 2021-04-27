import { LightningElement, api, wire, track } from 'lwc';
import LOGO from '@salesforce/resourceUrl/htlf_logo';
import LOGO_2 from '@salesforce/resourceUrl/logo_2';

export default class WelcomeHeartland extends LightningElement {
  logo = LOGO;
  logo2 = LOGO_2;

  @api headerTitle;

  handleChildButtonClick(){
    this.dispatchEvent(new CustomEvent('childbuttonclicked', { detail: {
      id: '12343',
      name: 'Jami Gibbs'
    } }));
  }
}


