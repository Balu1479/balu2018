import { LightningElement, wire, track} from 'lwc';
import getAccountsRecords from '@salesforce/apex/AccountController.getAccountsRecords';
const columns = [
    {
        label: 'Account Name', fieldName: 'Name', type: 'text', cellAttributes: {
            class: { fieldName: 'accountColor' }
        }
    },
    {
        label: 'Industry', fieldName: 'Industry', type: 'Picklist', cellAttributes: {
            class: { fieldName: 'industryColor' }
        }
    },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Site', fieldName: 'Site', type: 'text' },
    {
        label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency', cellAttributes: {
            class: { fieldName: 'amountColor' }, iconName: { fieldName: 'iconName' }, iconPosition: 'right'
        }
    }
];

export default class DataTableStyling extends LightningElement {
    columns = columns;
    @track accountRecords = [];
    error;
    @wire(getAccountsRecords)
    accountRecords({ data, error }) {
        if (data) {
            this.accountRecords = JSON.parse(data).map(item => {
                let amountColor = item.AnnualRevenue <500000 ? "slds-text-color_error":"slds-text-color_success"
                let iconName = item.AnnualRevenue <500000 ? "utility:down" : "utility:up";
                return {
                    ...item, 'amountColor': amountColor, 'iconName': iconName,
                    "industryColor": "slds-icon-custom-custom12 slds-text-color_default",
                    "accountColor": "orange" };
            });
            console.log('account records', JSON.stringify(this.accountRecords));
        } else if (error) {
            this.error = error;
            console.log('error',this.error);
        }
    }
}