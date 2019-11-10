softhouseWebApp.controller("NavCtrl",function($rootScope, $scope, $http, $location,$translate) {
    $scope.logout = function() {
        $http.post("/logout")
            .success(function() {
                $rootScope.currentUser = null;
                $location.url("/home");
            });
    }
    $scope.changeLanguage = function(lang){
        $translate.use(lang);
    }
});
softhouseWebApp.controller("LoginCtrl", function($location, $scope, $http, $rootScope) {
    $scope.login = function(user) {
        $http.post('/login', user)
            .success(function(response) {
                $rootScope.currentUser = response;
                $location.url("/profile");
            });
    }
});

softhouseWebApp.controller("ProfileCtrl",function($rootScope,$scope,$http, $rootScope,moment){
    $scope.friends = $rootScope.currentUser.facebook.friends;
    $scope.feed = $rootScope.currentUser.facebook.feed;

    $scope.parseDate = function(date){
        return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
    };

    $scope.saveChangesToFile = function() {
        $http.post('/writeToFile', $scope.feed)
            .success(function(response) {
                console.log("The file was saved");
            });
    };
    $scope.deleteFeed = function(index){
        $scope.feed.splice( index, 1 );
        $scope.saveChangesToFile();
    };
});

softhouseWebApp.controller("SignUpCtrl", function($scope, $http, $rootScope, $location) {
    $scope.signup = function(user) {

        if (user.password == user.password2) {
            $http.post('/signup', user)
                .success(function(user) {
                    $rootScope.currentUser = user;
                    $location.url("/profile");
                });
        }
    }
});