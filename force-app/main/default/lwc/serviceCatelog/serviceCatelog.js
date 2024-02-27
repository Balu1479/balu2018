import { LightningElement, track } from "lwc";
import getServiceCatelogRecords from "@salesforce/apex/ServiceCatelogController.getServiceCatelogRecords";
//import preRequisiteRecords from "@salesforce/apex/ServiceCatelogController.preRequisiteRecords";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ServiceCatelogRecords from "@salesforce/label/c.ServiceCatelogRecords";
import Download from "@salesforce/label/c.Download";
import ShowServiceDetails from "@salesforce/label/c.ShowServiceDetails";
import PrerequisiteServices from "@salesforce/label/c.PrerequisiteServices";
import PrerequisiteServicesTable from "@salesforce/label/c.PrerequisiteServicesTable";
import Close from "@salesforce/label/c.Close";
import Cancel from "@salesforce/label/c.Cancel";
import Save from "@salesforce/label/c.Save";
const allValue = [{ label: "All", value: "All" }];
const columns = [
  { label: "Service Name", fieldName: "name" },
  { label: "Service Id", fieldName: "preServiceId" }
];
export default class ServiceCatelog extends LightningElement {
  label = {
    ServiceCatelogRecords,
    Download,
    ShowServiceDetails,
    PrerequisiteServices,
    PrerequisiteServicesTable,
    Close,
    Cancel,
    Save
  };
  columns = columns;
  @track error;
  @track catelogList = [];
  @track initialRecords = [];
  isShowModal = false;
  isDomain = false;
  isSubDomain = false;
  @track selectedServices;
  @track preRequisiteService = [];
  isPrereqisite = false;
  isPrereqisiteTable = false;
  isServices = false;
  @track prerequisiteCatalogues = [];
  selectedValue = "";
  subSelectedValue = "";
  domainselectedValue;
  @track domainOptions = [];
  @track subdomainOptions = [];
  @track domainOptionsFinal;
  @track subdomainOptionsFinal;
  prerequisiteRecordsCount;
  columnHeader = ["Service ID", "Name", "Domain Name", "Sub Domain Name"];
  connectedCallback() {
    this.fetchCatelogRecords();
  }
  fetchCatelogRecords() {
    getServiceCatelogRecords()
      .then((result) => {
        this.initialRecords = JSON.parse(result);
        this.catelogList = JSON.parse(result);
        let options = [];
        for (let key in this.catelogList) {
          if (key) {
            if (this.catelogList[key].obj.length !== 0) {
              this.preRequisiteService.push(this.catelogList[key].obj);
            }
            if (Object.hasOwn(this.catelogList, key)) {
              options.push({
                label: this.catelogList[key].domainName,
                value: this.catelogList[key].domainName
              });
            }
          }
        }
        console.log("this.preRequisiteService", this.preRequisiteService);
        let subOtions = [];
        for (let key in this.catelogList) {
          if (Object.hasOwn(this.catelogList, key)) {
            subOtions.push({
              label: this.catelogList[key].subDomainName,
              value: this.catelogList[key].subDomainName
            });
          }
        }
        this.subdomainOptions = subOtions;
        this.domainOptions = options;
        let newArray = [];
        let uniqueObject = {};
        for (let i in this.domainOptions) {
          if (Object.hasOwn(this.domainOptions, i)) {
            let objTitle = this.domainOptions[i].label;
            uniqueObject[objTitle] = this.domainOptions[i];
          }
        }
        for (let i in uniqueObject) {
          if (Object.hasOwn(uniqueObject, i)) {
            newArray.push(uniqueObject[i]);
          }
        }
        let items = newArray;
        let itemsFinal = JSON.parse(JSON.stringify(items));
        this.domainOptionsFinal = [...itemsFinal, ...allValue];
        let subnewArray = [];
        let subuniqueObject = {};
        for (let i in this.subdomainOptions) {
          if (Object.hasOwn(this.subdomainOptions, i)) {
            let subobjTitle = this.subdomainOptions[i].label;
            subuniqueObject[subobjTitle] = this.subdomainOptions[i];
          }
        }
        for (let i in subuniqueObject) {
          if (Object.hasOwn(subuniqueObject, i)) {
            subnewArray.push(subuniqueObject[i]);
          }
        }
        let subitems = subnewArray;
        let subItemsFinal = JSON.parse(JSON.stringify(subitems));
        this.subdomainOptionsFinal = [...subItemsFinal, ...allValue];
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error;
        this.catelogList = undefined;
      });
  }
  showModal() {
    this.isServices = true;
    this.isShowModal = true;
    this.isPrereqisite = false;
    this.selectedServices = [];
    let selectedRows = this.template.querySelectorAll("lightning-input");
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].checked && selectedRows[i].type === "checkbox") {
        this.selectedServices.push({
          name: selectedRows[i].value,
          Id: selectedRows[i].dataset.id
        });
      }
    }
    if (this.selectedServices.length === 0) {
      const evnt = new ShowToastEvent({
        title: "Services are not selected",
        message: "Atleast select one Catalogue Service",
        variant: "error"
      });
      this.dispatchEvent(evnt);
    }
  }
  hideModalBox() {
    this.isShowModal = false;
  }
  allSelected(event) {
    let selectedRows = this.template.querySelectorAll("lightning-input");
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].type === "checkbox") {
        selectedRows[i].checked = event.target.checked;
      }
    }
  }
  /* fetchPreRequisiteRecords() {
    this.isServices = false;
    this.isPrereqisite = true;
    preRequisiteRecords({
      serviceId: this.selectedServices[0].Id
    }).then(result => {
      console.log("pre--:", JSON.parse(result));
      this.prerequisiteCatalogues = JSON.parse(result);
      //this.prerequisiteCataloguesLength = this.prerequisiteCatalogues.length;
      if (this.prerequisiteCatalogues.length > 0) {
        this.prerequisiteCatalogues = JSON.parse(result);
      } else {
        const evnt = new ShowToastEvent({
          title: "Pre Requisite services are not available for this Serive",
          Variant: "Info",
          message: "Pre Requisite services are not available for this Serive"
        });
        this.dispatchEvent(evnt);
      }
    });
  } */
  fetchPreRequisiteRecords() {
    this.isServices = false;
    this.isPrereqisite = true;
    let prerequisiteCataloguesRecs = [];
    //let serid = event.target.dataset.id;
    let serviceId = this.selectedServices[0].Id;
    let items = [];
    items = JSON.parse(JSON.stringify(this.preRequisiteService));
    console.log("items", items);
    for (let key of items) {
      for (let val of key) {
        if (val.serviceId === serviceId) {
          prerequisiteCataloguesRecs.push(val);
        }
      }
    }
    if (prerequisiteCataloguesRecs.length > 0) {
      this.prerequisiteCatalogues = prerequisiteCataloguesRecs;
    } else {
      const evnt = new ShowToastEvent({
        title: "Pre Requisite services are not available for this Serive",
        Variant: "Info",
        message: "Pre Requisite services are not available for this Serive"
      });
      this.dispatchEvent(evnt);
    }
  }
  handleChange(event) {
    this.selectedValue = event.detail.value;
    if (this.selectedValue === "All") {
      this.catelogList = this.initialRecords;
      this.isSubDomain = false;
      this.isDomain = false;
      this.subSelectedValue = "";
    } else {
      this.filter();
      this.isSubDomain = true;
      this.isDomain = false;
    }
  }
  subhandleChange(event) {
    this.subSelectedValue = event.detail.value;
    if (this.subSelectedValue === "All") {
      this.catelogList = this.initialRecords;
      this.isDomain = false;
      this.isSubDomain = false;
      this.selectedValue = "";
    } else {
      this.subDomainfilter();
      this.isSubDomain = false;
      this.isDomain = true;
    }
  }
  filter() {
    if (this.selectedValue /* || this.subSelectedValue */) {
      this.catelogList = this.initialRecords;
      if (this.catelogList) {
        let recs = [];
        for (let rec of this.catelogList) {
          if (rec.domainName === this.selectedValue) {
            recs.push(rec);
          }
        }
        this.catelogList = recs;
      }
    } else {
      this.catelogList = this.initialRecords;
    }
  }
  subDomainfilter() {
    if (this.subSelectedValue) {
      this.catelogList = this.initialRecords;
      if (this.catelogList) {
        let recs = [];
        for (let rec of this.catelogList) {
          if (rec.subDomainName === this.subSelectedValue) {
            recs.push(rec);
          }
        }
        this.catelogList = recs;
      }
    } else {
      this.catelogList = this.initialRecords;
    }
  }
  handleSearch(event) {
    const searchKey = event.target.value.toLowerCase();
    if (searchKey) {
      this.catelogList = this.initialRecords;
      if (this.catelogList) {
        let recsSearch = [];
        for (let rec of this.catelogList) {
          let valuesArray = Object.values(rec);
          for (let val of valuesArray) {
            let strVal = String(val);
            if (strVal) {
              if (strVal.toLowerCase().includes(searchKey)) {
                recsSearch.push(rec);
                break;
              }
            }
          }
        }
        this.catelogList = recsSearch;
      }
    } else {
      this.catelogList = this.initialRecords;
    }
  }
  handleDownload() {
    // Prepare a html table
    let doc = "<table>";
    // Add styles for the table
    doc += "<style>";
    doc += "table, th, td {";
    doc += "    border: 1px solid black;";
    doc += "    border-collapse: collapse;";
    doc += "}";
    doc += "</style>";
    // Add all the Table Headers
    doc += "<tr>";
    this.columnHeader.forEach((element) => {
      doc += "<th>" + element + "</th>";
    });
    doc += "</tr>";
    // Add the data rows
    this.catelogList.forEach((record) => {
      doc += "<tr>";
      doc += "<th>" + record.id + "</th>";
      doc += "<th>" + record.name + "</th>";
      doc += "<th>" + record.domainName + "</th>";
      doc += "<th>" + record.subDomainName + "</th>";
      doc += "</tr>";
    });
    doc += "</table>";
    let element = "data:application/vnd.ms-excel," + encodeURIComponent(doc);
    let downloadElement = document.createElement("a");
    downloadElement.href = element;
    downloadElement.target = "_self";
    downloadElement.download = "Service Catalogue Data.xls";
    document.body.appendChild(downloadElement);
    downloadElement.click();
  }
  get domainOptionsNew() {
    return [
      { label: "Domain Name", value: "domainName" },
      { label: "Sub Domain Name", value: "subdomainName" }
    ];
  }
  handleDomainChange(event) {
    if (event.target.value === "domainName") {
      this.domainselectedValue = event.target.value;
    } else {
      this.domainselectedValue = event.target.value;
    }
    console.log("domainselectedvalue", this.domainselectedValue);
  }
  cancil() {
    this.isPrereqisiteTable = false;
  }
  fetchPreRequisiteRecordsForTable() {
    this.isServices = false;
    this.isPrereqisiteTable = true;
    let serviceId = [...this.template.querySelectorAll("lightning-input")]
      .filter((element) => element.checked)
      .map((element) => element.dataset.id);
    console.log("serviceId", serviceId);
    let items = [];
    let services = [];
    let preServices = [];
    items = JSON.parse(JSON.stringify(this.preRequisiteService));
    console.log("items", JSON.stringify(items));
    let map = new Map();
    serviceId.forEach((value) => {
      console.log("value", value);
      map.set(value, "value" + value);
    });
    console.log("map data", map);
    for (let i = 0; i < items.length; i++) {
      preServices = preServices.concat(items[i]);
    }
    for (let key of preServices) {
      console.log("key", key);
      if (map.has(key.serviceId)) {
        services.push(key);
      }
    }
    this.prerequisiteCatalogues = services;
    this.prerequisiteRecordsCount = this.prerequisiteCatalogues.length;
    if (this.prerequisiteCatalogues.length > 0) {
      //this.prerequisiteCatalogues = this.prerequisiteCatalogues;
      this.prerequisiteCatalogues = services;
    } else {
      const evnt = new ShowToastEvent({
        title: "Pre Requisite services are not available for this Serive",
        Variant: "Info",
        message: "Pre Requisite services are not available for this Serive"
      });
      this.dispatchEvent(evnt);
    }
  }
}