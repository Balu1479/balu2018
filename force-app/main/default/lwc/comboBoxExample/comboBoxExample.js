import { LightningElement, track } from 'lwc';
export default class ComboBoxExample extends LightningElement {
    student = [
        {
            name: 'Test',
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            status: 'New',
        },
        {
            name: 'Test1',
            fatherName: 'Test1 Father',
            motherName: 'Test1 Mother',
            status: 'Finish',
        },
        {
            name: 'Test1',
            fatherName: 'Test1 Father',
            motherName: 'Test1 Mother',
            status: 'In Progress',
        },
        {
            name: 'Test1',
            fatherName: 'Test1 Father',
            motherName: 'Test1 Mother',
            status: 'Blocker',
        }
    ];
    columns = [
        { label: 'Name', fieldName: 'name' },
        { label: 'Father Name', fieldName: 'fatherName', type: 'string' },
        { label: 'Mother Name', fieldName: 'motherName', type: 'string' },
        { label: 'Status', fieldName: 'status', type: 'string' },

    ];
    selectedValue = 'test';
    get options() {
        return [
            { label: 'New', value: 'New' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Finish', value: 'Finish' },
            { label: 'Blocker', value: 'Blocker' },
        ];
    }
    initialRecords = this.student;
    columnsNew = this.columns;
    //@track initialRecords = [];
    @track records = [];

    connectedCallback() {
        this.records = this.initialRecords;
    }
    handleChange(event) {
        console.log('initialRecords type--:',typeof(this.initialRecords));
        console.log('student type--:',typeof(this.student));
        this.selectedValue = event.detail.value;
        console.log('value--:', this.selectedValue);
        if (this.selectedValue === 'test')
            this.records = this.initialRecords;
        else
            this.filter();
    }
    filter() {
        if (this.selectedValue) {
            this.records = this.initialRecords;
            if (this.records) {
                let recs = [];
                for (let rec of this.records) {
                    console.log( 'Rec is ' + JSON.stringify(rec));
                    if (rec.status === this.selectedValue) {
                        recs.push(rec);
                    }
                }
                console.log( 'Recs are ' + JSON.stringify(recs));
                this.records = recs;
            }
        } else {
            this.records = this.initialRecords;
        }
    }
}