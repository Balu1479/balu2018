import { LightningElement, track, wire } from "lwc";
import getAccountsRecords from "@salesforce/apex/AccountController.getAccountsRecords";
import ListofAccountRecords from '@salesforce/label/c.ListofAccountRecords';
export default class DynamicRendering extends LightningElement {
  label = {
    ListofAccountRecords
  };
  error;
  @track accounts = [];
  @track accountsForDynamic = [];
  @track cities = [];
  @track citiesMap = [];
  @track cityValues = [];
  @track cityNames = [];
  @track industries = [];
  @track industryNames = [];
  siteMap;
  industriesMap;
  isCitiesAvailable = false;
  isIndustriesAvailable = false;
  isCitiesNamesAvailable = false;
  isIndustiesAvailable = false;
  isTrue = true;
  isFalse = true;
  /* connectedCallback() {
        //this.fetchAccountRecords();
    }
    fetchAccountRecords() {
        getAccountsRecords().then((result) => {
            this.accounts = JSON.parse(result);
            this.accountsForDynamic = this.accounts;
        })
        .catch((error) => {
            this.error = error;
        })
    } */
  //By wire method
  @wire(getAccountsRecords)
  account({ error, data }) {
    if (data) {
      this.accounts = JSON.parse(data);
      this.accountsForDynamic = this.accounts;
      this.siteMap = new Map();
      let siteSet = new Set();
      this.industriesMap = new Map();
      let industriesSet = new Set();
      this.accountsForDynamic.forEach((element) => {
        if (element.Site !== undefined && element.Site !== null) {
          this.siteMap.set(element.Site, element.Industry);
          siteSet.add(element.Site);
        }
        if (element.Industry !== undefined && element.Industry !== null) {
          this.industriesMap.set(element.Industry, element);
          industriesSet.add(element.Industry);
        }
      });
      this.cities = [...siteSet];
      this.industryNames = [...industriesSet];
      this.cities.forEach((element) => {
        if (element !== undefined && element !== null) {
          this.cityValues.push(element);
        }
      });
      this.isCitiesAvailable = true;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.accounts = undefined;
    }
  }
  showAccounts() {
    this.accountsForDynamic = [];
    /* let account = [];
        this.accounts.forEach((element) => {
            if (element.Industry != 'Agriculture') {
                account.push(element);
            }
        }); */
    let account = this.accounts.filter(
      (element) => element.Industry !== "Agriculture"
    );
    this.accountsForDynamic = account;
  }
  //for wire method to show all accounts
  fetchAccountRecords() {
    this.accountsForDynamic = this.accounts;
  }
  //it will show account records which are not empty industry
  notEmptyIndustryAccounts() {
    let emptyInstryAccounts = this.accounts.filter(
      (element) => element.Industry
    );
    this.accountsForDynamic = emptyInstryAccounts;
  }
  emptyIndustryAccounts() {
    let emptyInstryAccounts = this.accounts.filter(
      (element) => !element.Industry
    );
    this.accountsForDynamic = emptyInstryAccounts;
    /* let account = [];
        this.accounts.forEach((element) => {
            if (!element.Industry) {
                account.push(element);
            }
        });
        this.accountsForDynamic = account; */
  }
  handleCityChange(event) {
    let isChecked = event.target.checked;
    this.isCitiesNamesAvailable = true;
    if (isChecked) {
      this.cityNames = this.cityValues;
    } else {
      this.isCitiesNamesAvailable = false;
      this.accountsForDynamic = this.accounts;
    }
  }
  /*  handleCityNameChange(event) {
    let isChecked = event.target.checked;
    let cityName = event.target.label;
    if (isChecked) {
      let availableAccounts = this.accounts.filter(
        (element) => element.Site === cityName
      );
      this.accountsForDynamic = availableAccounts;
    }
  } */
  showMultipleSiteAccounts() {
    let multipleAccounts = [];
    let siteMap = new Map();
    const checkBoxIds = [...this.template.querySelectorAll("lightning-input")]
      .filter((element) => element.checked)
      .map((element) => element.dataset.name);
    for (let site of Object.values(checkBoxIds)) {
      if (site !== undefined) {
        siteMap.set(site, "Value" + site);
      }
    }
    if (checkBoxIds) {
      this.accounts.forEach((element) => {
        if (element.Site !== undefined) {
          if (siteMap.has(element.Site)) {
            multipleAccounts.push(element);
          }
        }
      });
      console.log("multipleAccounts", multipleAccounts);
      this.accountsForDynamic = multipleAccounts;
    }
  }
  handleAllCities(event) {
    let isChecked = event.target.checked;
    let isSelected = this.template.querySelectorAll('[data-id="checkbox1"]');
    let cityName = event.target.label;
    let accountsForCities = [];
    if (isChecked && cityName) {
      for (let name of isSelected) {
        name.checked = event.target.checked;
      }
      this.accounts.forEach((element) => {
        if (this.siteMap.has(element.Site)) {
          accountsForCities.push(element);
        }
      });
      this.accountsForDynamic = accountsForCities;
    } else {
      for (let name of isSelected) {
        name.checked = event.target.unchecked;
      }
      this.accountsForDynamic = this.accounts;
    }
  }
  handleIndustryChange(event) {
    this.isIndustiesAvailable = true;
    let isChecked = event.target.checked;
    if (isChecked) {
      this.industries = this.industryNames;
    } else {
        this.isIndustiesAvailable = false;
        this.accountsForDynamic = this.accounts;
    }
  }
  handleIndustryAll(event) {
    let isChecked = event.target.checked;
    let isSelected = this.template.querySelectorAll('[data-id="checkbox2"]');
    let industry = event.target.label;
    if (isChecked && industry) {
      for (let eachIndustry of isSelected) {
        eachIndustry.checked = event.target.checked;
      }
      let industryAccounts = [];
      this.accounts.forEach((element) => {
        if (this.industriesMap.has(element.Industry)) {
          industryAccounts.push(element);
        }
      });
      this.accountsForDynamic = industryAccounts;
    } else {
      for (let each of isSelected) {
        each.checked = event.target.unchecked;
      }
      this.accountsForDynamic = this.accounts;
    }
  }
    handleEachIndustryChange(event) {
        /* let selectedCheckBox = this.template.querySelectorAll('[lightning-input]');
        console.log('selectedCheckBox 201',selectedCheckBox);
        for (let i = 0; i < selectedCheckBox.length; i++){
            if (selectedCheckBox[i].checked) {
                console.log('label 203',event.target.label);
            }
        } */
        let isChecked = event.target.checked;
        let selectedIndustry = event.target.label;
        let selectedIndustryAccounts = [];
        if (isChecked && selectedIndustry) {
        selectedIndustryAccounts = this.accounts.filter(
            (element) => element.Industry === selectedIndustry
        );
        this.accountsForDynamic = selectedIndustryAccounts;
        }
    }
}