import { Component, OnInit, Input, ElementRef} from '@angular/core';
import {UserService} from '../user.service';
import { DashboardService } from './dashboard.service';
import { AppConstants } from '../app.constants';
import {OauthService} from '../OAuth2/oauth.service';
import { HttpClient } from '../OAuth2/httpClient';
import {Router} from '@angular/router';
import { saveAs } from 'file-saver';
import {  BlockUI, NgBlockUI } from 'ng-block-ui';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { Observable } from 'rxjs/Observable';
import {SimpleTimer} from 'ng2-simple-timer';

import { TableList } from './tableList';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService, OauthService, HttpClient]
})
export class DashboardComponent implements OnInit {

  fileName: string;
  tableList: TableList;
  selectedTableIndex: number;
  errorMessage: string;
  successMessage: string;
  warningMessage: string;
  dependencyToggle: string;
  username: string;
  showHideButtonText: string;
  rowCount: string;
  preferredLocale: string;

  activeStepIndex: number;

  RowCountError: boolean;
  @BlockUI() blockUI: NgBlockUI;
  domains = AppConstants.domains;
  domain = AppConstants.dropDownDefaultValue;
  downloadType = AppConstants.dropDownDefaultValue;
  fileTypes = AppConstants.fileTypes;
  maxRowCountToDownload = AppConstants.maxRowCountToDownload;

  idleState;
  timedOut = false;
  lastPing?: Date = null;

  dasProcess = AppConstants.dasProcess;
  messageTimerId: string;
  skipTimerFirstCall: boolean;


    /*@Input dataObject;*/
  constructor(private router: Router, private dashboardService: DashboardService,
    private elem: ElementRef, private oauth: OauthService, private keepalive: Keepalive, private idle: Idle,
    private st: SimpleTimer) {
    const user = oauth.getLoggedUser();
    this.dashboardService.dummyRequest().subscribe(response => {this.blockUI.stop(); }, Error => {
          this.setMessage(Error, AppConstants.dummyRequestErrorMessage);
      });
    this.username = user.username;
    this.setIdleTimeout(AppConstants.keepAliveIdleTime);
  }

  setIdleTimeout(timeInSeconds) {
    this.idle.setIdle(timeInSeconds);
    this.idle.setTimeout(AppConstants.keepAliveTimeout);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => this.idleState = AppConstants.emptyString);
   this. idle.onTimeout.subscribe(() => {
      this.idleState = AppConstants.idleStateTimedOutMessage;
      this.timedOut = true;
      this.logout();
    });
    this.idle.onIdleStart.subscribe(() => this.idleState = AppConstants.idleStateMessage);
    this.idle.onTimeoutWarning.subscribe((countdown) => this.idleState =
      AppConstants.idleStateWarningMessageStart + countdown + AppConstants.idleStateWarningMessageEnd);
    this.keepalive.interval(timeInSeconds);

    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();
  }

   reset() {
    this.idle.watch();
    this.timedOut = false;
  }

  closeMessageBox(message) {
    if (this.skipTimerFirstCall) {
      this.skipTimerFirstCall = false;
    } else {
      if (message === AppConstants.successMessageType) {
        this.successMessage = AppConstants.emptyString;
      }else if ( message === AppConstants.errorMessageType) {
        this.errorMessage = AppConstants.emptyString;
      }else {
        this.warningMessage = AppConstants.emptyString;
      }
      this.st.unsubscribe(this.messageTimerId);
    }
  }

  toggleButtonText() {
    if (this.showHideButtonText === AppConstants.showMappingsButtonText) {
      this.showHideButtonText = AppConstants.hideMappingsButtonText;
    }else {
      this.showHideButtonText = AppConstants.showMappingsButtonText;
    }
  }

  uploadFile() {
    const file = this.elem.nativeElement.querySelector(AppConstants.inputFileHTMLElementId).files;
    if (file.length !== 1) {
      this.setMessage(AppConstants.selectFileErrorMessage, AppConstants.errorMessageType);
    }else if (this.domain === AppConstants.dropDownDefaultValue) {
      this.setMessage(AppConstants.selectDomainErrorMessage, AppConstants.errorMessageType);
    }else if (!file[0].name.includes('.sql') && !file[0].name.includes('.SQL')) {
      this.setMessage(AppConstants.inCorrectSQLFileErrorMessage, AppConstants.errorMessageType);
    }else {
      this.fileName = file[0].name;
      const formData = new FormData();
      formData.append(AppConstants.fileUploadFormField, file[0]);
      formData.append(AppConstants.domainUploadTypeFormField, this.domain);
      formData.append(AppConstants.dependencyToggleUploadFormField, this.dependencyToggle);
      this.dashboardService.dummyRequest().subscribe(dummyResponse => {
        this.dashboardService.getMappings(formData).subscribe(response => {
          this.dependencyToggle = AppConstants.setDependencyToggle;
          this.setMessage(AppConstants.fileUploadSucessMessage, AppConstants.successMessageType);
          this.tableList = response;
          this.selectedTableIndex = 0;
          this.processTableData();
          this.moveToStep(1);
        },
        Error => {
          this.blockUI.stop();
          this.dependencyToggle = AppConstants.setDependencyToggle;
          if (Error.includes(AppConstants.errorResponseCheck)) {
            this.setMessage(Error.substring(6), AppConstants.errorMessageType);
          }else if (Error.includes(AppConstants.warningResponseCheck)) {
            this.setMessage(Error.substring(8), AppConstants.warningMessageType);
          }else {
            this.setMessage(Error, AppConstants.errorMessageType);
          }
        });
      },
      Error => {
        this.dependencyToggle = AppConstants.setDependencyToggle;
        /*if(Error.status === 0){
                 return Observable.throw('Problem with servesssssr Please contact Administrator');
                }
        else*/
          // this.setMessage("Problem while logout please contact Administrator", AppConstants.errorMessageType);
          this.setMessage(Error, AppConstants.errorMessageType);
      });
    }
  }

  processTableData() {
    for (let i = 0; i < this.tableList.tables.length; i++) {
      for (let j = 0; j < this.tableList.tables[i].fields.length; j++) {
        if (this.tableList.tables[i].fields[j].mappingCategeries === null) {
          this.tableList.tables[i].fields[j].mappingCategeries = new Array();
          this.tableList.tables[i].fields[j].mappingCategeries.push({
            mappingCategory: this.tableList.tables[i].fields[j].columnName,
            mappingType: this.tableList.tables[i].fields[j].dataType
          });
        }
        this.tableList.tables[i].fields[j].mappedCategory = this.tableList.tables[i].fields[j].mappingCategeries[0].mappingCategory;
        this.tableList.tables[i].fields[j].mappedType = this.tableList.tables[i].fields[j].mappingCategeries[0].mappingType;
      }
    }
  }

  reUploadFile() {
    this.dependencyToggle = AppConstants.removeDependencyToggle;
    this.uploadFile();
  }

  tableClick( selectedTableIndex ) {
    this.selectedTableIndex = selectedTableIndex;
  }

  downloadFile(format) {
    const formData = new FormData();
    formData.append(AppConstants.fileTypeDownloadFormField, format);
    formData.append(AppConstants.rowCountDownloadFormField, this.rowCount);
    formData.append(AppConstants.domainTypeDownloadFormField, this.domain);
    formData.append(AppConstants.preferredLocaleDownloadFormField, this.preferredLocale);
    formData.append(AppConstants.updatedMappedDataDownloadFormField, JSON.stringify(this.tableList));
    this.idle.stop();
    this.setIdleTimeout(AppConstants.keepAliveIdleTimeForDownload);
    this.dashboardService.dummyRequest().subscribe(dummyResponse => {
    this.dashboardService.downloadFile(formData, this.downloadType).subscribe(response =>  {
      /*if (response.size == 0) {
          alert('File not found');
      } else {*/
      saveAs(response, AppConstants.fileNameToSave + new Date().getTime() + AppConstants.DefaultFileFormatToSave);
      this.setMessage(AppConstants.fileDownloadSucessMessage, AppConstants.successMessageType);
      this.dasProcess[2].imgUrl = this.dasProcess[2].imgUrls[2];
      this.idle.stop();
      this.setIdleTimeout(AppConstants.keepAliveIdleTime);
      // }
    }, error => {
        this.setMessage(AppConstants.fileDownloadErrorMessage, AppConstants.errorMessageType);
      this.idle.stop();
      this.setIdleTimeout(AppConstants.keepAliveIdleTime);
    });
    });
  }

  logout() {
    const formData = new FormData();
    formData.append(AppConstants.userNameLogoutFormField, this.username);
    this.dashboardService.dummyRequest().subscribe(dummyResponse => {
      this.oauth.logout(formData).subscribe(response =>  {
        if (response.status === 200) {
          window.localStorage.removeItem(AppConstants.localStorageTokenName);
          this.router.navigate([AppConstants.loginRoute]);
        }
      },
      Error => {
        this.setMessage(Error, AppConstants.errorMessageType);
      });
    },
    Error => {
      this.setMessage(Error, AppConstants.errorMessageType);
    });
  }

  setMessage(message, type) {
    this.errorMessage = AppConstants.emptyString;
    this.successMessage = AppConstants.emptyString;
    this.warningMessage = AppConstants.emptyString;
    if (type === AppConstants.errorMessageType) {
      this.errorMessage = message;
    }else if (type === AppConstants.successMessageType) {
      this.successMessage = message;
    }else if (type === AppConstants.warningMessageType) {
      this.warningMessage = message;
    }

    this.st.unsubscribe(this.messageTimerId);
    this.messageTimerId = this.st.subscribe(AppConstants.messageTimerName, () => this.closeMessageBox(type));
    this.skipTimerFirstCall = true;
  }

  ngOnInit(): void {
    this.moveToStep(0);
    this.fileName = null;
    this.setMessage(AppConstants.emptyString, AppConstants.successMessageType);
    this.dependencyToggle = AppConstants.setDependencyToggle;
    this.showHideButtonText = AppConstants.showMappingsButtonText;
    this.preferredLocale = navigator.language;
    this.RowCountError = false;
    this.st.newTimer(AppConstants.messageTimerName, AppConstants.messageAutoHideSec);
    this.skipTimerFirstCall = true;
  }

  checkRange() {
    if (Number.parseInt(this.rowCount) < 1 || Number.parseInt(this.rowCount) > this.maxRowCountToDownload) {
      this.RowCountError = true;
    } else {
      this.RowCountError = false;
    }
  }

  moveToStep(stepIndex) {
    this.activeStepIndex = stepIndex;
    if (stepIndex === 0) {
      this.dasProcess[0].active = true;
      this.dasProcess[0].imgUrl = this.dasProcess[0].imgUrls[1];
      this.dasProcess[1].active = false;
      this.dasProcess[1].imgUrl = this.dasProcess[1].imgUrls[0];
      this.dasProcess[2].active = false;
      this.dasProcess[2].imgUrl = this.dasProcess[2].imgUrls[0];
    } else if (stepIndex === 1 && this.tableList !== undefined) {
      this.dasProcess[0].active = false;
      this.dasProcess[0].imgUrl = this.dasProcess[0].imgUrls[2];
      this.dasProcess[1].active = true;
      this.dasProcess[1].imgUrl = this.dasProcess[1].imgUrls[1];
      this.dasProcess[2].active = false;
      this.dasProcess[2].imgUrl = this.dasProcess[2].imgUrls[0];
    } else if (stepIndex === 2 && this.tableList !== undefined) {
      this.dasProcess[0].active = false;
      this.dasProcess[0].imgUrl = this.dasProcess[0].imgUrls[2];
      this.dasProcess[1].active = false;
      this.dasProcess[1].imgUrl = this.dasProcess[1].imgUrls[2];
      this.dasProcess[2].active = true;
      this.dasProcess[2].imgUrl = this.dasProcess[2].imgUrls[1];
    } else {
      this.setMessage(AppConstants.nextStepErrorMessage, AppConstants.errorMessageType);
      this.activeStepIndex = 0;
    }
  }
}
