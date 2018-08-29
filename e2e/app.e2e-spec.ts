import { AppPage  } from './app.po';
import { browser, element, by } from "protractor/built";

describe('das-ui App', () => {

    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
        browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = true;
     });

    it('should check data simulator title', () => {
        page.navigateTo();
        expect(page.getTitle()).toEqual('DasUi');
    });

    it('should sign in when user enters correct login credentials', function() {
        page.navigateTo();
        page.username().sendKeys('user');
        page.password().sendKeys('user');
        page.clikLogin();
        page.addDelay();
        expect(browser.getCurrentUrl()).toContain('dashboard');
    });

    it('should upload a file', function() {
        page.uploadFile();

    });

    it('should display success message on file upload', function() {

        page.displaySuccessMessage();
    });

    xit('should preview a file', function() {
        page.numberOfRows().sendKeys('5');
        element(by.css('option[value="xlsx"]')).click();
        page.previewFile();
        page.addDelay();

    });


    xit('should download file', function() {
        page.addDelay();
        page.numberOfRows().sendKeys('5');
        element(by.css('option[value="csv"]')).click();
        page.clickDownload();
        page.addDelay();
        page.displayDownloadSuccessMessage();
        page.addDelay();
    });

    it('should get logout from application', function() {
        page.addDelay();
        page.logoutApplication();
        page.addDelay();
    });


});
