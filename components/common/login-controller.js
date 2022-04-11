
var app=angular.module("login-controller", []);

// 
  //Login Controller
  // 
app.controller('LoginController',function($rootScope,$scope,$location,$http,LoginService,$base64,$cookies,$window,$filter ) {
    

		//Login Function 
	   $scope.login = function( ) {
		
									
			
			//local storage clear
		$window.localStorage.removeItem('loginToken'); 
		$window.localStorage.removeItem('userName'); 
		$window.localStorage.removeItem('useremail'); 
		
		//session storage clear
               $window.sessionStorage.removeItem('orgID');
		$window.sessionStorage.removeItem('orgName'); 
		$window.sessionStorage.removeItem("authToken");
		
		
		//rootScope storage clear
            $rootScope.orgID="";
            $rootScope.userName ="";
	    $rootScope.orgName="";	    
	    $rootScope.useremail="";	    
      
					
		  $scope.loaderMessage = 'Logining....';	
	      $scope.promise = null;
		  
		 if($scope.loginform.$invalid) return false;
		 
	   else{
		  //Basic Authentication
          $scope.email=$filter('lowercase')($scope.email);
		  var encodedUserName =  $base64.encode($scope.email);
		  var encodedPassword =  $base64.encode($scope.password);
	      var config = {headers:  {
			 'Authorization': 'Basic ' +encodedUserName,
			 'Accept': 'application/json;','Content-Type':'application/json;',
			 'X-AuthToken':''
          }};
	
		
var userVO ={
    "appID": $rootScope.appID,
    "deviceID": "",
    "ipaddress": "",
    "loginID": encodedUserName,
    "password": encodedPassword,
    "socialSite": "",
    "socialToken": ""
};
	   	  
         var data=userVO;
		 	
		 $scope.promise=LoginService.login(data,config)
		   
			.success(function(response, status, headers, config) {
				//console.log(response);
$rootScope.setHeader(null,null,null,null);

				if(response.data.passwordType=='T'){
				    $location.path("/components/common/views/change-password");
											
				}else if(response.data.isOTPVerifyRequired==1){
					console.log("OTP verify"+response.data.isOTPVerifyRequired);
					/*$cookies.put('isVerified',0,{'expires': expireDate});
					$cookies.put('otpToken',response.data.otpToken,{'expires': expireDate});*/		
					$location.path("/components/common/views/two-step-verification");
				}else{
					console.log("otp not required");
					//console.log(data);
				//$rootScope.resultModal('1','Success',response.message,'',true,false);
				
				// local storage		
				$window.localStorage.setItem('loginToken',response.data.authToken);
				$window.localStorage.setItem('userName',response.data.fullName);
				$window.localStorage.setItem('useremail',response.data.loginName);
				
				//session stoarge			 
				$window.sessionStorage.setItem('orgID',response.data.orgVO.orgID);
                                $window.sessionStorage.setItem('orgName',response.data.orgVO.orgName);
                                $window.sessionStorage.setItem('authToken',response.data.authToken);
				
			     //rootScope varible storage
			    $rootScope.orgName=$window.sessionStorage.getItem('orgName');
                            $rootScope.orgID=$window.sessionStorage.getItem('orgID');	
				$rootScope.userName=$window.localStorage.getItem('userName');	
                $rootScope.useremail=$window.localStorage.getItem('useremail'); 
				$rootScope.loading = false;	
	            $location.path("/components/dashboard/views/dashboard-v1");
					
				}
		
			})
			.error(function(data,status) {
				$rootScope.resultModal('2','Error',data.message,'',true,false);		
				$scope.wrongCredentials = false;				 	
				
			});
			}
        }
    
	
	
	/************************************Social Login Google ********************/
	
	$scope.options = {
         'scope': 'profile email',
        'width': 360,
        'height': 35,
		'longtitle': true,
        'theme': 'dark',
        'onsuccess': socialLogin,
        'onfailure': onFailure
          }
		  
$scope.updateSocialFlag=function(){
   $window.localStorage.setItem('socialLoginStatus','true');
	
  }	
	
	

	
	//Social Login Method
	function socialLogin(googleUser){		
	
	 if( ($window.localStorage.getItem('socialLoginStatus')=='false')) {
		 
	 }else{
		 $scope.loaderMessage = 'Processing....';	
	     $scope.promise = null;

	      var config = {headers:  {
			 'Accept': 'application/json;','Content-Type':'application/json;',
			 'X-AuthToken':undefined
          }};
	   	  
         var data={appID:$rootScope.appID,loginName:googleUser.getBasicProfile().getEmail()};
		 $scope.promise=LoginService.socialLogin(data,config)
		   
			.success(function(data, status, headers, config) {
				 //$rootScope.successResponseHandler(status,data.statusCode,data.message);
				 var expireDate = new Date();
                expireDate.setYear(expireDate.getFullYear()+1);
				$cookies.put('userID',data.user.userID,{'expires': expireDate});			
			    $cookies.put('authToken',data.user.authToken,{'expires': expireDate});
                $cookies.put('name',data.user.fullName,{'expires': expireDate});	
                $cookies.put('useremail',data.user.loginName,{'expires': expireDate});		
               	$cookies.put('isOTPVerifyRequired',data.user.isOTPVerifyRequired,{'expires': expireDate});
                $cookies.put('loginSuccess',data.user.loginSuccess,{'expires': expireDate});					
			   	$http.defaults.headers.common['X-AuthToken'] =  data.user.authToken;
			    $window.localStorage.setItem('token',data.user.authToken);

			$window.localStorage.setItem('userID',$cookies.get('userID'));
			$window.localStorage.setItem('orgID',data.user.orgVO.orgID);
			$window.localStorage.setItem('societyName',data.user.orgVO.orgName);
			
			$window.localStorage.setItem('accessRoleID',data.user.role.roleID);
			$window.localStorage.setItem('name',$cookies.get('name'));
            $window.localStorage.setItem('useremail',$cookies.get('useremail'));
	        $window.localStorage.setItem('orgSettings',angular.toJson(data.user.orgVO));
			
			$rootScope.name=$window.localStorage.getItem('name');
            $rootScope.useremail=$window.localStorage.getItem('useremail');
			$rootScope.societyName= $window.localStorage.getItem('societyName');
			$rootScope.userID=$window.localStorage.getItem('userID');
			$rootScope.orgID=$window.localStorage.getItem('orgID');
			$rootScope.accessRoleID=$window.localStorage.getItem('accessRoleID');
		    $rootScope.orgSettings=angular.fromJson($window.localStorage.getItem('orgSettings'));				
			
				$rootScope.loading = false;				
				$scope.wrongCredentials = true;
				if(data.user.passwordType=='T'){
						$location.path("/components/common/views/change-password");
											
				}else if(data.user.appVO.isOTPVerify==1){
					console.log("OTP verify"+data.user.appVO.isOTPVerify);
					$cookies.put('isVerified',0,{'expires': expireDate});
					$location.path("/components/common/views/two-step-verification");
				}else{
					console.log("In else loop");
					
					$cookies.put('isVerified',1,{'expires': expireDate});	
					$location.path("/request/assigned-me");
					
				}
		
				
				
			}).error(function(data,status) {				
				 $rootScope.resultModal('2','Error',data.message,'',true,false);	     
				 $rootScope.loading = false;
							
			});
	 }
	}
	
    function onFailure(error) {
     // console.log(error);
	 // $rootScope.errorResponseHandler(status,data.statusCode,data.message);	
	 // $location.path("/");
	  $rootScope.logout();
    }


	/************************************Social Login Google ********************/
	
	//show get login screen
	$scope.getLoginScreen=function(){
		$location.path("/");			
	}
	
	//show get password screen
	$scope.getPasswordScreen=function(){
			$location.path("/forgot");
	}
		
	//Get Password Method
	$scope.getPassword=function(){		 
		 $scope.loaderMessage = 'Processing....';	
	     $scope.promise = null;

         $scope.emailID=$filter('lowercase')($scope.emailID);
		 // var encodedemailID =  $base64.encode($scope.emailID);
         var config1 = {headers: { 'Accept': 'application/json;odata=verbose'}};
	     var data = {loginID:$scope.emailID,appID:$rootScope.appID};		 
		  	  
		$scope.promise=LoginService.forgotPassword(data,config1)
		   
			.success(function(data, status, headers, config1) {
			   $rootScope.resultModal('1','Success',data.message,'',true,false);			
			   $scope.emailID='';
			   $rootScope.loading = false;
				
			}).error(function(data,status) {				
				$rootScope.resultModal('2','Error',data.message,'',true,false);			       
				 $rootScope.loading = false;
							
			});			
	}
	
	
	//init otp
	$scope.initOTP=function(){
		$scope.otp={};
	}
	
	//Verify Login Otp
	$scope.verifyLoginOtpToken=function(){		 
	
	   var loginToken;
	     loginToken=$scope.otp.firstDigit+$scope.otp.secondDigit+$scope.otp.thirdDigit+$scope.otp.fourthDigit+$scope.otp.fifthDigit+$scope.otp.sixDigit;
		 
		 
		 $scope.loaderMessage = 'Processing....';	
	     $scope.promise = null;
		  console.log($cookies.get("otpToken"));
        var config = {headers: {'Accept': 'application/json;','Content-Type':'application/json;','X-OTPToken':$cookies.get("otpToken")}};
 //var config = {headers: {'Accept': 'application/json;','Content-Type':'application/json;', 'X-AuthToken' : $cookies.get("authToken")}};	
	     var data = {strOTP:loginToken};		 
		  	  
		$scope.promise=LoginService.validateOTP(data,config)
		   
			.success(function(data, status, headers, config) {
				$cookies.put('userID',data.user.userID,{'expires': expireDate});			
			    $cookies.put('authToken',data.user.authToken,{'expires': expireDate});
                $cookies.put('name',data.user.fullName,{'expires': expireDate});	
                $cookies.put('useremail',data.user.loginName,{'expires': expireDate});		
               	$cookies.put('isOTPVerifyRequired',data.user.isOTPVerifyRequired,{'expires': expireDate});
                $cookies.put('loginSuccess',data.user.loginSuccess,{'expires': expireDate});					
			   	$http.defaults.headers.common['X-AuthToken'] =  data.user.authToken;
			    $window.localStorage.setItem('token',data.user.authToken);

			$window.localStorage.setItem('userID',$cookies.get('userID'));
			$window.localStorage.setItem('orgID',data.user.orgVO.orgID);
			$window.localStorage.setItem('societyName',data.user.orgVO.orgName);
			
			$window.localStorage.setItem('accessRoleID',data.user.role.roleID);
			$window.localStorage.setItem('name',$cookies.get('name'));
            $window.localStorage.setItem('useremail',$cookies.get('useremail'));
	        $window.localStorage.setItem('orgSettings',angular.toJson(data.user.orgVO));
			
			$rootScope.name=$window.localStorage.getItem('name');
            $rootScope.useremail=$window.localStorage.getItem('useremail');
			$rootScope.societyName= $window.localStorage.getItem('societyName');
			$rootScope.userID=$window.localStorage.getItem('userID');
			$rootScope.orgID=$window.localStorage.getItem('orgID');
			$rootScope.accessRoleID=$window.localStorage.getItem('accessRoleID');
		    $rootScope.orgSettings=angular.fromJson($window.localStorage.getItem('orgSettings'));		
	        $window.localStorage.setItem('orgID',data.user.orgVO.orgID);
			$window.localStorage.setItem('societyName',data.user.orgVO.orgName);
			$window.localStorage.setItem('orgSettings',angular.toJson(data.user.orgVO));
			$window.localStorage.setItem('accessRoleID',data.user.role.roleID);				
			    //$rootScope.datalink='/society';
			$rootScope.orgID=$window.localStorage.getItem('orgID');
			$rootScope.accessRoleID=$window.localStorage.getItem('accessRoleID');
		    $rootScope.orgSettings=angular.fromJson($window.localStorage.getItem('orgSettings'));				
				 	
			  $cookies.remove('isVerified');
	           var expireDate = new Date();
               expireDate.setYear(expireDate.getFullYear()+1);
		      $cookies.put('isVerified',1,{'expires': expireDate});	
		     $location.path("/request/assigned-me");
				
			   $rootScope.loading = false;
				
			}).error(function(data,status) {				
				 $rootScope.resultModal('2','Error',data.message,'',true,false);		       
				 $rootScope.loading = false;
				  $rootScope.logout();
							
			});			
	}
  
   
    
	  //Get page
	$rootScope.getPage=function(accessName,pageName){	
	    var isAccess=$rootScope.accessHandler(accessName);
	    if(isAccess){
			var templateUrl=pageName;
			$location.path(templateUrl);
		}
	 
	 }
 
});

