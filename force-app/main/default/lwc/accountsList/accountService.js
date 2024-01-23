import getAccountsRecords from '@salesforce/apex/AccountController.getAccountsRecords';
const getAccounts = () => {
    return getAccountsRecords().then((result) => {
        return result;
    }).catch((error) => {
        return error;
    });
};
export { getAccounts };