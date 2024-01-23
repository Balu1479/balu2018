import { LightningElement, wire, track } from 'lwc';
import retrieveStudentRecords from '@salesforce/apex/StudentController.retrieveStudentRecords';

export default class Student extends LightningElement {
    @track studentsRecords = [];
    @track studentsRecordsSort = [];
    error;
    //sortedColumn;
    sortedDirection = 'asc';
    sortDirection;
    nameUpBool;
    nameDWBool;
    marksUpBool;
    marksDWBool;
    upBool;
    dwBool;
    @wire(retrieveStudentRecords)
    getStudentRecords({ data, error }) {
        if (data) {
            console.log('data', data);
            this.studentsRecords = data;
            this.studentsRecordsSort = data;
            //this.studentsRecords = this.studentsRecordsSort.sort();
            this.error = undefined;
        } else {
            this.error = error;
            this.studentsRecords = undefined;
        }
    }
    sortingFruits() {
        var i = 2;
        const fruits = ['Banana', 'Mango', 'Orange', 'Apple'];
        console.log('fruits',fruits);
        fruits.sort();
        console.log('fruits', fruits);
        const mobiles = [
            {
                name: 'OnePlus',
                id: 3
            },
            {
                name: 'Xiomi',
                id: 4
            },
            {
                name: 'Apple',
                id: 1
            },
            {
                name: 'Samsung',
                id: 2
            }
        ];
        console.log('mobiles 43', mobiles);
        const sortMobiles = mobiles.sort(function (a, b) {
            return a.name.localeCompare( b.name );
        });
        console.log('sortMobiles 47', sortMobiles);
        for(i; i< fruits.length; i++){
            console.log('i value',i);
        }
        for(let j=0; j< fruits.length; j++){
            console.log('j+ value',j);
        }
    }
    sortingStudents() {
        console.log('sortingStudents', JSON.parse(JSON.stringify(this.studentsRecordsSort)));
        const sortStudentsRecords = JSON.parse(JSON.stringify(this.studentsRecordsSort));
        this.studentsRecords = sortStudentsRecords.sort((a, b) =>{
            return a.Name.localeCompare( b.Name );
        });
        console.log('sortStudents 54', this.studentsRecords);
    }
    sortingStudentsByMarks() {
        console.log('sortingStudents', JSON.parse(JSON.stringify(this.studentsRecordsSort)));
        const sortStudentsRecords = JSON.parse(JSON.stringify(this.studentsRecordsSort));
        this.studentsRecords = sortStudentsRecords.sort((a, b) => {
            console.log('sortStudents 62', a.Total_Marks__c);
            console.log('sortStudents 62', b.Total_Marks__c);
            return a.Total_Marks__c.localeCompare( b.Total_Marks__c );
        });
        console.log('sortStudents 65', this.studentsRecords);
    }
    /* sortRecs(event) { 
        let colName = event.target.name;
        console.log('colName 77',colName);
        this.studentsRecords = this.sortRecords(colName, this.studentsRecords);
    } */
    sortRecs(event) {
        this.nameUpBool = false;
        this.nameDWBool = false;
        this.marksDWBool = false;
        this.marksUpBool = false;
        let colName = event.target.name;
        if (colName) {
            this.sortedColumn = colName;
        } else {
            colName = this.sortedColumn;
        }
        if ( this.sortedColumn === colName ) {
            this.sortedDirection = ( this.sortedDirection === 'asc' ? 'desc' : 'asc' );
        }
        else {
            this.sortedDirection = 'asc';
        }
        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;
        switch (colName) {
            case "Name":
                if (this.sortedDirection === 'asc') {
                    this.nameUpBool = true
                } else {
                    this.nameDWBool = true;
                }
                break;
            case "Total_Marks__c":
                if (this.sortedDirection === 'asc') {
                    this.marksUpBool = true;
                } else {
                    this.marksDWBool = true;
                }
                break;
                default:
        }
        // sort the data
        const students = JSON.parse(JSON.stringify(this.studentsRecords)).sort((a, b) => {
            console.log('column name 85', typeof (colName));
            if (colName === 'Total_Marks__c') {
                a = a[ colName ] ? a[ colName ]:''; 
                b = b[ colName ] ? b[ colName ]: '';
            } else {
                a = a[ colName ] ? a[ colName ].toLowerCase() : ''; // Handle null values
                b = b[ colName ] ? b[ colName ].toLowerCase() : '';
            } 
            return a > b ? 1 * isReverse : -1 * isReverse;
        });
        this.studentsRecords = students;
    }
    /* sortRecords(colName, records) {
        let sortedDirection;
        let sortedColumn;
        //this.upBool = sortUPBool;
        //this.dwBool = sortDWBool;
        this.nameUpBool = false;
        this.nameDWBool = false;
        this.marksDWBool = false;
        this.marksUpBool = false;
        console.log('colName 139',colName);
        if (colName) {
            sortedColumn = colName;
        } else {
            colName = sortedColumn;
        }
        if ( sortedColumn === colName ) {
            sortedDirection = ( sortedDirection === 'asc' ? 'desc' : 'asc' );
        }
        else {
            sortedDirection = 'asc';
        }
        let isReverse = sortedDirection === 'asc' ? 1 : -1;
        switch (colName) {
            case "Name":
                if (sortedDirection === 'asc') {
                    console.log('sortedDirection 156',sortedDirection);
                    console.log('records 157',this.nameUpBool);
                    this.nameUpBool = true
                    console.log('records 159',this.nameUpBool);
                } else {
                    console.log('sortedDirection 160',sortedDirection);
                    console.log('records 161',this.nameDWBool);
                    this.nameDWBool = true;
                    console.log('records 163',this.nameDWBool);
                }
                break;
            case "Total_Marks__c":
                if (sortedDirection === 'asc') {
                    this.marksUpBool = true;
                } else {
                    this.marksDWBool = true;
                }
                break;
        }
        // sort the data
        const students = JSON.parse(JSON.stringify(records)).sort((a, b) => {
            if (colName === 'Total_Marks__c') {
                a = a[ colName ] ? a[ colName ]:''; 
                b = b[ colName ] ? b[ colName ]: '';
            } else {
                a = a[ colName ] ? a[ colName ].toLowerCase() : ''; // Handle null values
                b = b[ colName ] ? b[ colName ].toLowerCase() : '';
            } 
            return a > b ? 1 * isReverse : -1 * isReverse;
        });
        records = students;
        console.log('records 167',records);
        return records;
    } */
}