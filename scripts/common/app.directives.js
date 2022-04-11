"use strict";
angular.module("app.directives", [])


//****************************************Do not change this directive*********************//
.directive("imgHolder", [
  function() {
    return {
      restrict: "A",
      link: function(scope, ele, attrs) {
        return Holder.run({
          images: ele[0]
        });
      }
    };
  }
])

.directive("panelToggle", [
  function() {
    return {
      restrict: "A",
      link: function(scope, element) {
        element.click(function() {
           $(this).parent().parent().next().slideToggle("fast"), $(this).toggleClass("fa-chevron-down fa-chevron-up")
        });
      }
    };
  }
])

.directive("widgetClose", [
  function() {
    return {
      restrict: "A",
      link: function(scope, element) {
        element.click(function() {
          $(this).parent().parent().parent().fadeOut();
        });
      }
    };
  }
])

.directive("toggleProfile", [
  function() {
    return {
      restrict: 'A',
      template: '<a href="javascript:void(0)" ng-click="toggleProfile()"> <i class="fa fa-user"></i> </a>',
      controller: function($scope, $element) {
        $scope.toggleProfile = function() {
          $('#settings').slideToggle();
        };
      }
    };
  }
])
  
.directive("customPage", function() {
  return {
    restrict: "A",
    controller: [
      "$scope", "$element", "$location", function($scope, $element, $location) {
        var addBg, path;
        path = function() {
          return $location.path();
        };
        addBg = function(path) {
          $element.removeClass("body-wide body-lock");
          switch (path) {
            case "/404":
            case "/components/common/views/404":
            case "/components/common/views/500":
            case "/components/common/views/signin":
            //case "/components/common/views/change-password":
            case "/components/common/views/forgot-password":
		    case "/components/common/views/two-step-verification":
			//case "/components/common/views/organization-list":
              return $element.addClass("body-wide");
            case "/components/common/views/lock-screen":
              return $element.addClass("body-wide body-lock");
          }
        };
        addBg($location.path());
        return $scope.$watch(path, function(newVal, oldVal) {
          if (newVal === oldVal) {
            return;
          }
          return addBg($location.path());
        });
      }
    ]
  };
})

.directive("rightSidebar", [
function () {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.click(function() {
                if ($(this).hasClass('open')) {
                    $('.rsidebar').animate({
                        "right": "-250px"
                    }, 150);
                    $(this).removeClass('open').addClass('closed');
                } else {
                    $(".rsidebar").animate({
                        "right": "0px"
                    }, 150);
                    $(this).removeClass('closed').addClass('open');
                }
            });
         }
      }
   }
])

.directive("toggleSettings", [
function () {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.click(function() {
                if ($(this).hasClass('open')) {
                    $('#config').animate({
                        "right": "-300px"
                    }, 150);
                    $(this).removeClass('open').addClass('closed');
                } else {
                    $("#config").animate({
                        "right": "0px"
                    }, 150);
                    $(this).removeClass('closed').addClass('open');
                }
            });
        }
    }
  }
])

.directive("goBack", [
  function() {
    return {
      restrict: "A",
      controller: [
        "$scope", "$element", "$window", function($scope, $element, $window) {
          return $element.on("click", function() {
            return $window.history.back();
          });
        }
      ]
    };
  }
]);


// Another `$drag` usage example:
app.directive('uiRequired', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.required = function(modelValue, viewValue) {
          return !((viewValue && viewValue.length === 0 || false) && attrs.uiRequired === 'true');
        };

        attrs.$observe('uiRequired', function() {
          ctrl.$setValidity('required', !(attrs.uiRequired === 'true' && ctrl.$viewValue && ctrl.$viewValue.length === 0));
        });
      }
    };
  });
  
  
//Javascript execution
app.directive('script', function() {
     return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr) {
            if (attr.type === 'text/javascript-lazy') {
                var code = elem.text();
                /*jslint evil: true */
                var f = new Function(code);
                f();
            }
        }
    }
});



// Reset password validation	
app.directive('nxEqual', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqual) {
                console.error('nxEqual expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqual, function (value) {
                model.$setValidity('nxEqual', value === model.$viewValue);
            });
            model.$parsers.push(function (value) {
                var isValid = value === scope.$eval(attrs.nxEqual);
                model.$setValidity('nxEqual', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});
 
   

//Route loading indicator
app.directive('routeLoadingIndicator', function($rootScope) {
  return {
    restrict: 'E',
    template: "<div ng-show='isRouteLoading' class='loading-indicator'>" +
    "<div class='loading-indicator-body'>" +
    "<h3 class='loading-title'>Loading...</h3>" +
    "<div class='spinner'><rotating-plane-spinner></rotating-plane-spinner></div>" +
    "</div>" +
    "</div>",
    replace: true,
    link: function(scope, elem, attrs) {
      scope.isRouteLoading = false;
 
      $rootScope.$on('$routeChangeStart', function() {
        scope.isRouteLoading = true;
      });
      $rootScope.$on('$routeChangeSuccess', function() {
        scope.isRouteLoading = false;
      });
    }
  };
});

//UI grid dropdown 
 app.directive('myCustomDropdown', function() {
  return {
    template: '<select class="form-control" style="font-size:11px" ng-model="colFilter.term" ng-options="option.id as option.value for option in colFilter.options"  ng-change="grid.appScope.changedValue(colFilter.term)" ></select>'
  };
});

 

//disable button on second click
app.directive('disableDoubleClick', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function(){
                $timeout(function(){
                    elem.attr('disabled','disabled');
                }, 20);

                $timeout(function(){
                    elem.removeAttr('disabled');
                }, 500);
            });
        }
    };
});
	

//Google button
app.directive('googleSignInButton', function() {
        return {
          scope: {
            buttonId: '@',
            options: '&'
          },
          template: '<div ></div>',
          link: function(scope, element, attrs) {
            var div = element.find('div')[0];
            div.id = attrs.buttonId;
            gapi.signin2.render(div.id, scope.options()); //render a google button, first argument is an id, second options
          }
        };
      });
	  
	  
/*Move focus on maxlength of input */
app.directive("moveNextOnMaxlength", function() {
    return {
        restrict: "A",
        link: function($scope, element) {
            element.on("input", function(e) {
                if(element.val().length == element.attr("maxlength")) {
                    var $nextElement = element.next();
                    if($nextElement.length) {
                        $nextElement[0].focus();
                    }
                }
            });
        }
    }
});	

/*Set focus on load page*/
app.directive('ngSetFocus', ['$timeout' ,function ($timeout) {
  	return {
  	  restrict: 'A',
  	  link: function(scope, element, attrs) {
        
        var delay= 300;
        
        // set focus on broadcast
        scope.$on(attrs.ngSetFocus, function(e) {
          $timeout(function(){
            element[0].focus();
          }, delay);

        });   
        
        // apply default focus after other events have complete
  	    $timeout(function(){          
          if(attrs.hasOwnProperty('setFocusDefault')){
            element[0].focus();
          }
        }, delay);
        
        // fix for default focus on iOS. Does not show keyboard
        element.on('touchstart', function(event) {
          element[0].blur();
        });

  	  }	  
  	};
  }]);
  
  
app.directive("uiNotCloseOnClick", [
   function() {
     return {
       restrict: "A",
       compile: function(ele) {
          return ele.on("click", function(event) {
            return event.stopPropagation()
           })
         }
      }
   }
])
		
app.directive("slimScroll", [
  function() {
    return {
      restrict: "A",
      link: function(scope, ele, attrs) {
        return ele.slimScroll({
          height: attrs.scrollHeight || "100%"
        });
      }
    };
  }
]);
//************************************Custom Directive*******************************************//

//Email Validation
app.directive('validateEmail', function() {

 var EMAIL_REGEXP = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
 
  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});
 

//Email,mobile or custom name Validation
app.directive('validateEmailMobileCustomName', function() {

   var EMAIL_REGEXP = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
   var MOBILE_REGEXP =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
   var CUSTOMNAME_REGEXP = /^[s|S]{1}[0-9]+(-[a-zA-Z0-9]+)+/;

  return {
    require: 'ngModel',
   restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
      
	       ctrl.$validators.email = function(modelValue) {   	 
              var result=false;		   
		              if( (ctrl.$isEmpty(modelValue)  || EMAIL_REGEXP.test(modelValue))){
						  result=true
					  }else if((ctrl.$isEmpty(modelValue) || MOBILE_REGEXP.test(modelValue))){
						  result=true
						  
					  }else if((ctrl.$isEmpty(modelValue) || CUSTOMNAME_REGEXP.test(modelValue))){
						  result=true
						  
					  }
					//  console.log('validate custom '+CUSTOMNAME_REGEXP.test(modelValue))
                return result; 
            }
			
	     /*  ctrl.$validators.mobile = function(modelValue) {      
                return ctrl.$isEmpty(modelValue) || MOBILE_REGEXP.test(modelValue);       
            }
     
		  ctrl.$validators.customID = function(modelValue) {  				 
		     return ctrl.$isEmpty(modelValue)  ||CUSTOMNAME_REGEXP.test(modelValue);
		   }	 */
	 
    }
  };
});
