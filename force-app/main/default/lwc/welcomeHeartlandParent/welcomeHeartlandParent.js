import { LightningElement, api, wire } from 'lwc';
// import { fireEvent, registerListener } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

const data = ['first', 'second', 'third'];

export default class WelcomeHeartlandParent extends LightningElement {
  @api headerTitle;

  @wire(CurrentPageReference) pageRef;

  connectedCallback(){
    console.log('pageRef', pageRef);
  }

  handleButtonClick(){
    this.headerTitle = 'Hello world again!!'
  }

  handleChildButtonClick(event){
    this.headerTitle = event.detail.name;
  }
}