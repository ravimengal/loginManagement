// Common filters
var app= angular.module("app.filters", [])

//Number or null
app.filter('numberOrNull', function($filter) {
  return function(input) {
    return input == null ? '0.00' : $filter('number')(input, 2);
  };
});

//Number or blank
app.filter('numberOrBlank', function($filter,$rootScope) {
  return function(input) {
    return input == null  ? '  ' : $rootScope.currencyValue+' '+$filter('number')(input, 2) ;
  };
});

//Number or NAN
app.filter('numberOrNaN', function($filter) {
  return function(input) {
    return input == null || NaN ? 0 : parseFloat(input);
  };
});


