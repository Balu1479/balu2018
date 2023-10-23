import { LightningElement } from 'lwc';

export default class SearchGorestUsers extends LightningElement {
    searchValue;
    handleSearch(event){
        this.searchValue = event.target.value;
        var searchEvent = new CustomEvent('search', { detail : this.searchValue});
        this.dispatchEvent(searchEvent);
    }
    /* handleSearch(event){
        const searchKey = event.target.value.toLowerCase();
        //console.log('searchKey',searchKey);
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
    } */
}