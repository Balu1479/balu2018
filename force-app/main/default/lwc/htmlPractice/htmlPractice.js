import { LightningElement,track } from 'lwc';
const columns = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Roll Number', fieldName: 'rollNumber' },
];
export default class HtmlPractice extends LightningElement {
    columns = columns;
    selectedRecordsCount;
    selectedValues;
    @track studentName = [];
    @track studentNamesArary = ['Bala', 'Rajee', 'Moksha', 'Lavanya', 'Meena'];
    @track studentNamesObject = [
        {
            name: 'Bala',
            rollNumber:'1',
        },
        {
            name: 'Rajee',
            rollNumber:'2',
        },
        {
            name: 'Moksha',
            rollNumber:'3',
        },
        {
            name: 'Lavanya',
            rollNumber:'4',
        },
        {
            name: 'Meena',
            rollNumber:'5',
        }
    ];
    connectedCallback() {
        this.studentNames();
    }
    studentNames() {
        for(let value of this.studentNamesArary) {
            this.studentName.push({
              name:value
            })
        }
    }
    getSelectedNames(){
        const selectedValue = this.template.querySelector('lightning-datatable').getSelectedRows();
        console.log("getSelectedRows => ",selectedValue );
        console.log("length => ",selectedValue.length );
        this.selectedRecordsCount = selectedValue.length;
        this.selectedValues = selectedValue;
        console.log("selectedValues => ",this.selectedValues );
    }
}