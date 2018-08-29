import { browser, by, element } from 'protractor';
var path = require('path');
export class AppPage {
    navigateTo() {
        return browser.get('/');
    }

    getTitle() {
        return browser.getTitle();
    }

    username() {
        return element(by.xpath('//*[@id="pwd-container"]/div[2]/section/form/input[1]'));
    }
    password() {
        return element(by.xpath('//*[@id="password"]'));
    }
    clikLogin() {
        return element(by.xpath('//*[@id="pwd-container"]/div[2]/section/form/button')).click();
    }

    numberOfRows() {
        return element(by.xpath('//*[@id="fullPage"]/block-ui/app-dashboard/div[2]/div[3]/div[2]/form/div[1]/input'));
        
    }

    inputFileType() {
        return element(by.xpath('//*[@id="fileFormat"]'));
    }

    clickDownload() {
        return element(by.xpath('//*[@id="fullPage"]/block-ui/app-dashboard/div[2]/div[3]/div[2]/form/div[4]/button')).click();                                 
    }

    displayMessage() {
        element(by.buttonText("Show Tables")).click();
        var message = expect(element(by.xpath('//*[@id="exp"]/h4')).getText());
        expect(message.toEqual('Please upload the input file'));
    }

    uploadFile() {
        var fileToUpload = '../mysqlsampledatabase.sql'
        var absolutePath = path.resolve(__dirname, fileToUpload);
        var fileElem = element(by.xpath('//*[@id="inputFile"]'));
        fileElem.sendKeys(absolutePath);
        element(by.xpath('//*[@id="domain"]')).click().then(function() {
            element(by.css('option[value="HRMS"]')).click();
        });
        element(by.buttonText("Upload")).click();

        browser.driver.sleep(2000);
        element(by.buttonText("Show Mappings")).click();
        var tableName = element(by.xpath('//*[@id="table"]/div/div[1]/ul[1]/li/a'));
        browser.driver.sleep(2000);
        expect(tableName.getText()).toEqual('CUSTOMERS');
        var columnName = element(by.xpath('//*[@id="table"]/div/div[2]/table/tbody/tr[1]/td[1]/div[1]/span'));
        expect(columnName.getText()).toEqual('customerNumber');

    }
    displaySuccessMessage() {
        var successMessage = element(by.xpath('//*[@id="successMessage"]/strong'));
        expect(successMessage.getText()).toEqual('Success!');
        var availableData = element(by.xpath('//*[@id="successMessage"]'));
        expect(availableData.getText()).toContain('File Uploaded');

    }
    
    displayDownloadSuccessMessage(){
      var downloadSuccesss = element(by.xpath('//*[@id="successMessage"]/strong'));
      expect(downloadSuccesss.getText()).toEqual('Success!');
      var downloadMessage = element(by.xpath('//*[@id="successMessage"]'));
      browser.driver.sleep(2000);
      expect(downloadMessage.getText()).toContain('Data download complete.');  
    }

    previewFile() {
        element(by.xpath('//*[@id="fullPage"]/block-ui/app-dashboard/div[2]/div[3]/div[2]/form/div[3]/button')).click();
        browser.driver.sleep(2000);
        var content = element(by.xpath('//*[@id="Employee"]/table/thead/tr/td[1]'));
        expect(content.getText()).toEqual('emp_id');
        element(by.xpath('//*[@id="previewModal"]/div/div/div[3]/button')).click();

    }


    addDelay() {
        browser.sleep(2000);
    }

    logoutApplication() {
        element(by.xpath('//*[@id="fullPage"]/block-ui/app-dashboard/h4/a')).click();
        browser.driver.sleep(2000);
        var value = browser.executeScript("return window.localStorage.getItem('token');");
        expect(value).toEqual(null);
    }
}

