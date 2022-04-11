
var app=angular.module("org-controller", []);

// 
  //Login Controller
  // 
app.controller('OrgController',function($rootScope,$scope,$location,$http,AuthService,$base64,$cookies,$window,$filter ) {
    
 $scope.getOrgList = function() {
				
		  $scope.loaderMessage = 'Fetching organizations ....';	
	      $scope.promise = null; 
              $rootScope.setHeader($window.localStorage.getItem('loginToken'),null,null,null);

		  var config = {headers: { 'Accept': 'application/json;','X-AuthToken':$window.localStorage.getItem('loginToken')}};
  	      var requestData={};	
		  $scope.promise=AuthService.getOrgList(requestData,config)

		 .success(function(data, status, headers, config) { 
			$scope.societylist = data.data;
		   	$rootScope.loading = false; 
			$rootScope.setHeader(null,null,null,null);

		  }).error(function(data,status) {	
                   $scope.logout();		  
			  $rootScope.resultModal('2','Error',data.message,'',true,false);		
			    
		  });
		
	 
      };
	
	  
	    $rootScope.changeOrg = function(orgID,societyName,memberGroupMailID,roleID,roleName) {
		 
		  $scope.loaderMessage = 'Processing....';	
	      $scope.promise = null;
	     $rootScope.setHeader($window.localStorage.getItem('loginToken'),null,null,null);
		  var config = {headers: { 'Accept': 'application/json;','X-AuthToken':$window.localStorage.getItem('loginToken')}};
		  var requestData={orgID: orgID};	  
		 $scope.promise=AuthService.changeOrg(requestData,config)

		 .success(function(response, status, headers, config) {
                      $location.path("/components/dashboard/views/dashboard-v1");
                   //console.log(response.data.orgVO.orgName);
                 //$rootScope.resultModal('1','Success',"Your now logged into "+response.data.orgVO.orgName,'',true,false);
				 //session storage
				 $window.sessionStorage.setItem('authToken',response.data.authToken);
				 $window.sessionStorage.setItem('orgName',response.data.orgVO.orgName);
				
			    //rootScope storage
			     $rootScope.orgName=$window.sessionStorage.getItem('orgName');
				 
					
	             $rootScope.loading = false;	
	 
		  }).error(function(data,status) {
                         console.log("in else");		
			  $rootScope.loading = false;
			  $rootScope.resultModal('2','Error',data.message,'',true,false);	
			   $rootScope.logout();
		  });
		
	 
      };
	  	
 
}); 

 