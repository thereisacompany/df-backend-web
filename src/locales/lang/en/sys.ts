export default {
  api: {
    operationFailed: 'Operation failed',
    errorTip: 'Error Tip',
    errorMessage: 'The operation failed, the system is abnormal!',
    timeoutMessage: 'Login timed out, please log in again!',
    apiTimeoutMessage: 'The interface request timed out, please refresh the page and try again!',
    apiRequestFailed: 'The interface request failed, please try again later!',
    networkException: 'network anomaly',
    networkExceptionMsg:
      'Please check if your network connection is normal! The network is abnormal',
    loginError: 'The job id or password is incorrect!',

    errMsg401: 'The user does not have permission (token, user name, password error)!',
    errMsg403: 'The user is authorized, but access is forbidden!',
    errMsg404: 'Network request error, the resource was not found!',
    errMsg405: 'Network request error, request method not allowed!',
    errMsg408: 'Network request timed out!',
    errMsg500: 'Server error, please contact the administrator!',
    errMsg501: 'The network is not implemented!',
    errMsg502: 'Network Error!',
    errMsg503: 'The service is unavailable, the server is temporarily overloaded or maintained!',
    errMsg504: 'Network timeout!',
    errMsg505: 'The http version does not support the request!',
  },
  app: {
    logoutTip: 'Reminder',
    logoutMessage: 'Confirm to exit the system?',
    menuLoading: 'Menu loading...',
    updateWebsite: 'New Version is Now Available',
    updateWebsiteMsg:
      'This new version you have access to more features. Do you want to update now? ',
    contactAdministrator: 'If you have any question, please contact the administrator!',
  },
  errorLog: {
    tableTitle: 'Error log list',
    tableColumnType: 'Type',
    tableColumnDate: 'Time',
    tableColumnFile: 'File',
    tableColumnMsg: 'Error message',
    tableColumnStackMsg: 'Stack info',

    tableActionDesc: 'Details',

    modalTitle: 'Error details',

    fireVueError: 'Fire vue error',
    fireResourceError: 'Fire resource error',
    fireAjaxError: 'Fire ajax error',

    enableMessage: 'Only effective when useErrorHandle=true in `/src/settings/projectSetting.ts`.',
  },
  exception: {
    backLogin: 'Back Login',
    backHome: 'Back Home',
    subTitle403: "Sorry, you don't have access to this page.",
    subTitle404: 'Sorry, the page you visited does not exist.',
    subTitle500: 'Sorry, the server is reporting an error.',
    noDataTitle: 'No data on the current page.',
    networkErrorTitle: 'Network Error',
    networkErrorSubTitle:
      'Sorry，Your network connection has been disconnected, please check your network!',
  },
  lock: {
    unlock: 'Click to unlock',
    alert: 'Lock screen password error',
    backToLogin: 'Back to login',
    entry: 'Enter the system',
    placeholder: 'Please enter the lock screen password or user password',
  },
  login: {
    backSignIn: 'Back sign in',
    mobileSignInFormTitle: 'Mobile sign in',
    qrSignInFormTitle: 'Qr code sign in',
    accountLoginTitle: 'Account login',
    signInFormTitle: 'Sign in',
    signUpFormTitle: 'Sign up',
    forgetFormTitle: 'Reset password',

    notLoginedTitle: 'You have not logined',
    signInTitle: 'Backstage management system',
    signInDesc: 'Enter your personal details and get started!',
    policy: 'I agree to the xxx Privacy Policy',
    scanSign: `scanning the code to complete the login`,
    pleaseLoginFirst: 'Please login first',

    loginButton: 'Sign in',
    registerButton: 'Sign up',
    rememberMe: 'Remember me',
    forgetPassword: 'Forget Password?',
    otherSignIn: 'Sign in with',

    // notify
    loginSuccessTitle: 'Login successful',
    loginSuccessDesc: 'Welcome back',
    logoutSuccessTitle: 'Logout successful',

    // placeholder
    accountPlaceholder: 'Please input username',
    countryPlaceholder: 'Please select a country',
    countryPlaceholderRequire: 'Please select a country',
    passwordPlaceholder: 'Please input password',
    smsPlaceholder: 'Please input sms code',
    mobilePlaceholder: 'Please input mobile',
    policyPlaceholder: 'Register after checking',
    diffPwd: 'The two passwords are inconsistent',

    userName: 'Username',
    country: 'Country',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    email: 'Email',
    smsCode: 'SMS code',
    mobile: 'Mobile',
    invitationCode: 'Invitation Code',

    //闲置登出
    sessionTimeout: 'Session Timeout!',
    continue: 'Continue',
    logout: 'Logout',
    sessionTimeoutMsg: 'You will be logged out in {0}s.',
    continueSessionMsg: 'Do you want to stay singed in?',
    accountDeactivated: 'This account has been deactivated!',
    accountResign: 'This account already has resign',
    loginExpired: 'Login Expired',
  },
};
