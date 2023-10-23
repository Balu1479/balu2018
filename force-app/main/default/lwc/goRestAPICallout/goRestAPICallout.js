import { LightningElement,track,api } from 'lwc';
import getGoRestUsers from '@salesforce/apex/goRestAPICallout.getGoRestUsers';
const column =[
    {label : 'Name', fieldName: 'name'},
    {label : 'Email', fieldName: 'email', type:'email'/*,wrapText:'wrap-text-min-lines'*/},
    {label : 'Gender', fieldName:'gender', type:'text'},
    {label : 'Status', fieldName: 'status',type:'text'},
];
export default class GoRestAPICallout extends LightningElement {
    data = [];
    columns = column;
    selectedValue = 'All';
    searchValue;
    @track initialRecords = [];
    connectedCallback(){
        this.getGorestUsersData();
    }
    getGorestUsersData(){
        getGoRestUsers({}).then((result) => {
            //console.log(result);
            this.data = JSON.parse(result);
            this.initialRecords = JSON.parse(result);
            //console.log(data);
        })
    }
    handleChange(event){
        this.selectedValue = event.detail.value;
        if(this.selectedValue === 'All')
        this.data = this.initialRecords;
        else
        this.filter(); 
    }
    get options(){
        return [
            { label: 'All', value: 'All' },
            {label: 'Inactive', value: 'inactive'},
            {label: 'Active', value: 'active'},
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'}
        ];
    }
    filter(){
        if(this.selectedValue){
            this.data = this.initialRecords;
            if(this.data){
                let filterRecords = [];
                for(let rec of this.data){
                    if(rec.status === this.selectedValue || rec.gender === this.selectedValue){
                        filterRecords.push(rec);
                    }
                }
                this.data = filterRecords;
            }
        }else{
            this.data = this.initialRecords;
        }
    }
    handleSearch(event){
        //const searchKey = event.target.value.toLowerCase();
        const searchKey = event.detail.toLowerCase();
        console.log('searchKey',searchKey);
        if(searchKey){
            this.data = this.initialRecords;
            if(this.data){
                let recsSearch = [];
                for(let rec of this.data){
                    let valuesArray = Object.values(rec);
                    for(let val of valuesArray){
                        let strVal = String(val);
                        if(strVal){
                            if(strVal.toLowerCase().includes(searchKey) ){
                                recsSearch.push(rec);
                                break;
                            }
                        }
                    }
                }
                this.data = recsSearch;
            }
        }else{
            this.data = this.initialRecords;
        }
    }
    btnhandler(event){
        alert('enter into btnhandler method');
        var fname = 'Bala';
        var lname = 'Gongolla';
        var selectedEvent = new CustomEvent('uploadevent', { detail : {fname: fname, lname:lname}});
        this.dispatchEvent(selectedEvent);
    }
}