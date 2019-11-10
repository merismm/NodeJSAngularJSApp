var softhouseWebApp = angular.module("SofthouseWebApp",["ngRoute","pascalprecht.translate","angularMoment"]);

softhouseWebApp.config(["$routeProvider","$translateProvider","$locationProvider",function($routeProvider,$translateProvider,$locationProvider){
    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'LoginCtrl'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html',
            resolve: {
                logincheck: checkLoggedin
            }
        })
        .otherwise({
            redirectTo: '/home'
        });
    $translateProvider.preferredLanguage(navigator.language);
    $translateProvider.registerAvailableLanguageKeys(['en','tr'],{
        "en-*":'en',
        "bs-*":"bs"
    });
    $translateProvider.useStaticFilesLoader({
        prefix:"data/",
        suffix:".json"
    });
    $translateProvider.useSanitizeValueStrategy(null);
 

}]);

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user) {
        $rootScope.errorMessage = null;
       
        if (user !== '0') {
            $rootScope.currentUser = user;
            deferred.resolve();
        } else { 
            $rootScope.errorMessage = 'You need to log into to access your account';
            deferred.reject();
            $location.url('/login');
        }
    });
    return deferred.promise;
};