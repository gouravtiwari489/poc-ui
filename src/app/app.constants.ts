export class AppConstants {
  public static appUrl = 'http://localhost:9080/datagenerator/';
  public static oauthRefreshUrl = 'oauth/token?grant_type=refresh_token&refresh_token=';
  public static oauthUrl = 'oauth/token?grant_type=password&username=';
  public static uploadUrl = 'upload';
  public static downloadUrl = 'download';
  public static dummyUrl = 'dummy';
  public static loginRoute = '/';
  public static registrationRoute = 'userRegistration';
  public static dashboardRoute = 'dashboard';
  public static loggedUserUrl = 'currentlyLoggedIn';
  public static logoutUrl = 'oauth/logout';
  public static registerUrl = AppConstants.appUrl + 'users';

  public static domains = [{value : 'HRMS', desc : 'HRMS', disabled : false},
    {value : 'CRM', desc : 'CRM', disabled : true},
    {value : 'SupplyChain', desc : 'Supply Chain', disabled : false},
    {value : 'Manufacturing', desc : 'Manufacturing', disabled : true},
    {value : 'Purchase', desc : 'Purchase', disabled : true},
    {value : 'Other', desc : 'Other', disabled : true}];

  public static fileTypes = [{
      value : 'xml',
      desc : 'XML (eXtensible Markup Language)',
      disabled : false,
      imgUrl: 'assets/images/xml-download.png'
    }, {
      value : 'csv',
      desc : 'CSV (Comma delimited)',
      disabled : false,
      imgUrl: 'assets/images/csv-download.png'
    }, {
      value : 'xlsx',
      desc : 'Microsoft Excel Workbook',
      disabled : false,
      imgUrl: 'assets/images/xlsx-download.png'
    }, {
      value : 'sql',
      desc : 'SQL (Structured Query Language)',
      disabled : false,
      imgUrl: 'assets/images/sql-download.png'
    }, {
      value : 'json',
      desc : 'JSON (JavaScript Object Notation)',
      disabled : false,
      imgUrl: 'assets/images/json-download.png'
     }];

  public static dasProcess = [{
      name: 'model',
      active: true,
      desc: 'click to upload .sql file',
      imgUrl: 'assets/images/model_active.png',
      imgUrls: ['', 'assets/images/model_active.png', 'assets/images/model_past.png']
    },
    {
      name: 'mapping',
      active: false,
      desc: 'click to see Input & Mapped MetaData',
      imgUrl: 'assets/images/mapping_normal.png',
      imgUrls: ['assets/images/mapping_normal.png', 'assets/images/mapping_active.png', 'assets/images/mapping_past.png']
    },
    {
      name: 'download',
      active: false,
      desc: 'click to download data',
      imgUrl: 'assets/images/download.png',
      imgUrls: ['assets/images/download_normal.png', 'assets/images/download_active.png', 'assets/images/download_past.png']
    }];

  public static messageTimerName = 'messageTimerName';
  public static messageAutoHideSec = 5;

  public static dropDownDefaultValue = 'select';

  public static idleStateMessage = 'You\'ve gone idle!';
  public static idleStateWarningMessageStart = 'You will get logged out in ';
  public static idleStateWarningMessageEnd = ' seconds! Click anywhere to continue...';
  public static idleStateTimedOutMessage = 'Timed out!';
  public static keepAliveInterval = 300;
  public static keepAliveIdleTime = 300;
  public static keepAliveTimeout = 10;
  public static keepAliveIdleTimeForDownload = 600;

  public static showMappingsButtonText = 'Show Mappings';
  public static hideMappingsButtonText = 'Hide Mappings';
  public static inputFileHTMLElementId = '#inputFile';

  public static fileUploadFormField = 'file';
  public static domainUploadTypeFormField = 'domainType';
  public static dependencyToggleUploadFormField = 'dependencyToggle';
  public static setDependencyToggle = 'true';
  public static removeDependencyToggle = 'false';

  public static fileTypeDownloadFormField = 'fileType';
  public static rowCountDownloadFormField = 'rowCount';
  public static domainTypeDownloadFormField = 'domainType';
  public static preferredLocaleDownloadFormField = 'preferredLocale';
  public static updatedMappedDataDownloadFormField = 'tableList';
  public static fileNameToSave = 'DAS-';
  public static DefaultFileFormatToSave = '.zip';
  public static fileDownloadContentType = 'application/octet-stream';
  public static fileDownloadResponseType = 'blob';
  public static contentType = 'Content-type';
  public static JSONContentType = 'application/json';

  public static maxRowCountToDownload = 50000;

  public static userNameLogoutFormField = 'userName';
  public static localStorageTokenName = 'token';
  public static localStorageRefreshTokenName = 'refreshToken';
  public static localStorageUserTokenName = 'Me';
  public static  authorizationToken = 'Basic Y2xpZW50OmNsaWVudHBhc3N3b3Jk';

  public static successMessageType = 'success';
  public static RegistrationSucessMessage = 'Successfully registered';
  public static errorMessageType = 'error';
  public static warningMessageType = 'warning';
  public static errorResponseCheck = 'Error!';
  public static warningResponseCheck = 'Warning!';
  public static defaultErrorMessage = 'Please contact Administrator';
  public static invalidCredentialsErrorMessage = 'Invalid Credentials';
  public static authenticationProblemErrorMessage = 'Problem while authentication Please contact Administrator';
  public static nextStepErrorMessage = 'Please upload SQL file first to process further...';
  public static selectFileErrorMessage = 'Please select file to upload';
  public static selectDomainErrorMessage = 'Please select Domain';
  public static inCorrectSQLFileErrorMessage = 'Please select correct sql file';
  public static fileUploadSucessMessage = 'File Uploaded sucessfully.';
  public static fileDownloadSucessMessage = 'Data download complete.';
  public static logoutErrorMessage = 'Problem while logout';
  public static fileDownloadErrorMessage = 'Problem while downloading Please contact Administrator';
  public static serverErrorMessage = 'Problem with server Please contact Administrator';
  public static dummyRequestErrorMessage = 'error';

  public static emptyString = '';

  public static blockUIStartMessage = 'Loading..';
  public static blockUIFileUploadStartMessage = 'Uploading file...';
  public static blockUIDownloadStartMessage = 'Downloading data...';

}
