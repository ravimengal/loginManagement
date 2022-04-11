
var app=angular.module("password-controller", []);

//Change Password  Controller
app.controller('ChangePasswordController', function($rootScope,$scope, $http,$location,$routeParams, $cookies, $window,LoginService  ) {

  //var isAvailable=$rootScope.checkTokenAvailable();
  
 if( $cookies.get('userID') != undefined && $window.localStorage.getItem('orgID')!=undefined) {
		
	  
 $scope.changePassword = function(newPassword) {
	 $scope.loaderMessage = 'Updating password....';	
	 $scope.promise = null;
	 $scope.message = '';
	 	 
   
	var requestData= {'password':newPassword};		

	$scope.promise=LoginService.changePassword(requestData,$rootScope.requestHeaders)
		  
		   .success(function(data, status, headers, config) { 				 
			 $rootScope.resultModal('1','Success','Your password has been changed successfully. please login with new credentials','logout',true,false);
        	 $rootScope.loading = false;
             $scope.newPassword='';
			 $scope.confirmPassword='';
			 
					  
		  }).error(function(data,status) {	
			   $rootScope.loading = false;
			   $rootScope.resultModal('2','Error',responseData.message,'',true,false);		
			   $scope.newPassword='';
			   $scope.confirmPassword='';
			   
			  
		 });
 };
 
     
 
 }  
 
}); 

 