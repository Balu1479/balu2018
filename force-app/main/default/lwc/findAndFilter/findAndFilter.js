import { LightningElement } from 'lwc';
const emp = [
    {
        name: 'Bala',
        empId: 101
    },
    {
        name: 'Rajee',
        empId: 102
    },
    {
        name: 'Bala',
        empId: 103
    },
    {
        name: 'Moksha',
        empId: 104
    },
];
export default class FindAndFilter extends LightningElement {
    filterValue;
    findValue;
    findValues() {
        //alert('findValues');
        this.findValue = emp.find(el => el.name === 'Bala');
        console.log('empName',this.findValue);
    }
    filterValues() {
        this.filterValue = emp.filter(el => el.name === 'Bala');
        console.log('empNames', this.filterValue);
    }
     
}