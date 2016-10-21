//import angular module
var	myAppModule = angular.module('myApp', ['ngRoute', 'angularMoment', 'angularUtils.directives.dirPagination', 'ui.bootstrap', 'rzModule', 'ngCookies']);
myAppModule.config(function ($routeProvider) {
	$routeProvider
	.when('/',{
		templateUrl: 'partials/main.html'
	})
	.when('/wishlist/:user_id',{
		templateUrl:'partials/wishlist.html',
		controller:'wishlistController'
	})
	.when('/search/:keywords',{
		templateUrl:'partials/items.html',
		controller: 'itemsController'
	})
	.otherwise({
		redirectTo: '/'
	});
});

myAppModule.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

// myAppModule.filter('to_trusted', ['$sce', function($sce){
// 	return function(text) {
// 		return $sce.trustAsHtml(text);
// 	};
// }]);

// myAppModule.filter('htmlToPlaintext', function(){
// 	return function(text) {
// 		return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
// 	};
// });

// Custom validator based on expressions.
myAppModule.directive("passwordVerify", function() {
  return {
    require: "ngModel",
    scope: {
      passwordVerify: '='
    },
    link: function(scope, element, attrs, ctrl) {
      scope.$watch(function() {
        var combined;
        if (scope.passwordVerify || ctrl.$viewValue) {
           combined = scope.passwordVerify + '_' + ctrl.$viewValue;
        }
        return combined;
      }, function(value) {
        if (value) {
          ctrl.$parsers.unshift(function(viewValue) {
            var origin = scope.passwordVerify;
            if (origin !== viewValue) {
              ctrl.$setValidity("passwordVerify", false);
              return undefined;
            } else {
              ctrl.$setValidity("passwordVerify", true);
              return viewValue;
            }
          });
        }
      });
     }
   };
});
