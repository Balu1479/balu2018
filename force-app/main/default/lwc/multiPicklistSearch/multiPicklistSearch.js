import { LightningElement, track } from 'lwc';

export default class MultiPicklistSearch extends LightningElement {
    @track selectedValues = [];
    @track selected = [];
    selectedLength;
    selectedAll = [];
    remainingAvailable = [];
    data = [
        { label: 'English', value: 'en' },
        { label: 'German', value: 'de' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'Italian', value: 'it' },
        { label: 'Japanese', value: 'ja' },
    ];
    options = this.data;
    /* get options(){
        return [
            { label: 'English', value: 'en' },
            { label: 'German', value: 'de' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'Italian', value: 'it' },
            { label: 'Japanese', value: 'ja' },
        ];
    } */
    handleChange(event){
        this.selectedValues = event.detail.value;
        this.selectedAll = [];
        //Maintain selected values array with label and value
        this.selectedLength = this.selectedValues.length;
        this.selected = this.selectedValues.length ? this.selectedValues : 'none';
        this.options.forEach((element) =>{
            this.selectedValues.forEach((selectedElement) =>{
                if(element.value === selectedElement){
                    this.selectedAll.push(element)
                }
            })
        });
        console.log('selectedAll',JSON.stringify(this.selectedAll));
        //maintain non selcted values
        this.remainingAvailable = [];
        this.options.forEach((element) =>{
            if(this.selectedAll.filter(e => e.value === element.value).length === 0){
                this.remainingAvailable.push(element);
            }
        });
        console.log('remainingAvailable',JSON.stringify(this.remainingAvailable));
    }
    /* get selected(){
        console.log('data',this.selectedValues.length);
        this.selectedLength = this.selectedValues.length;
        return this.selectedValues.length ? this.selectedValues : 'none';
    } */
    handleAvailableSearch(event){
        let searchValue = event.detail.value;
        if (searchValue) {
            let selectedValues = [];
            let selectedOptions = this.searchData(this.data, searchValue, false);
            this.data.forEach((element) => {
                //console.log('value',element.value);
                if (this.selectedValues.filter(each => each === element.value).length === 1) {
                    selectedOptions.push(element);
                    //selectedValues.push(element.value);
                } 
            });
            console.log('ava',JSON.stringify(selectedValues));
            this.options = selectedOptions;
            /* this.selected = selectedValues;
            console.log('ava',JSON.stringify(this.selected));
            this.selectedLength = this.options.length; */
        } else {
            this.options = this.data;
        }
    }
    handleSelectedSearch(event) {
        let searchValue = event.detail.value;
        if (searchValue) {
            let selectedOptions = []; 
            this.selectedValues = this.searchData(this.selectedAll, searchValue, true);
            this.data.forEach((element) => {
                if (this.selectedValues.filter(e => e === element.value).length === 1) {
                    console.log('element', element);
                    selectedOptions.push(element);
                }
            });
            this.remainingAvailable.forEach((element) => {
                selectedOptions.push(element);
            });
            this.options = selectedOptions;
            /* this.selected = this.selectedValues;
            this.selectedLength = this.selectedValues.length; */
        } else {
            let removeSearchValues = [];
            this.selectedAll.forEach((element) => {
                removeSearchValues.push(element);
            })
            this.selectedValues = removeSearchValues;
            this.options = this.data;
            /* this.selected = this.selectedValues;
            this.selectedLength = this.selectedValues.length; */
        }
    }
    searchData(allData, searchValue, returnValue){
        let filterData = [];
        allData.forEach((element) =>{
            if (element.label.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                if(returnValue){
                    console.log('handle search',element.value);
                    filterData.push(element.value);
                }else {
                    filterData.push(element);
                }
            }
        })
        return filterData;
    }
}