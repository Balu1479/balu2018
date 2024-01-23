import { LightningElement, track } from 'lwc';
import { getAccounts } from './accountService.js';
export default class AccountsList extends LightningElement {
    @track accountList;
    async connectedCallback() {
        this.accountList = await getAccounts();
        this.accountList = JSON.parse(this.accountList);
        console.log('AccountList',this.accountList);
    }
    async showAccounts() {
        this.accountList = await getAccounts();
        this.accountList = JSON.parse(this.accountList);
        console.log('AccountList',this.accountList);
    } 

}