
// Common services
var app= angular.module("login-service", [])
// Data services
app.service('LoginService',['$http', '$rootScope','$cookies','$window','$filter', function($http,$rootScope,$cookies,$window,$filter) {
	
	/**************User Section API **************/
	
	// Login  
	this.login = function (data,config) {
        return $http.post($rootScope.gatewayRouter+'/iam/authenticate/passwordLogin',data,config);	  
	};
	

	// Two Step Otp  
	this.validateOTP = function (data,config) {
        return $http.post($rootScope.gatewayRouter+'/iam/authenticate/validateOTP?strOTP='+data.strOTP,data,config);	  
	};
	
	//Social login Auth
	this.socialLogin = function (data,config) {
        return $http.post($rootScope.gatewayRouter+'/userPassword/socialLoginAuthenticate',data,config);	  
	};

	
	// Forgot password     
	this.forgotPassword = function (data,config) {
        return $http.get($rootScope.gatewayRouter+'/iam/authenticate/getNewPassword?loginID='+data.loginID+"&appID="+data.appID,data,config);
	};
	
	// Reset password     
	this.resetPassword = function (data,config) {
        return $http.post($rootScope.gatewayRouter+'/secure/user/userPassword/reset',data,config);
	};
	
	// Set password  
	this.setPassword = function (data,config) {
        return $http.post($rootScope.gatewayRouter+'/secure/user/setUserPassword/',data,config);
	};
	
	// Changed password     
	this.changePassword = function (data,config) {
        return $http.post($rootScope.gatewayRouter+'/secure/user/changePassword?password='+data.password,data,config);
	};	
		
	
	
}]);
