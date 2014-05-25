var Reddit = angular.module('Reddit', ['ngRoute','angularTree'])


Reddit.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  	.when('/', {
    	templateUrl: 'views/entries.html', 
    	controller: 'EntryCtrl'
  	})
  	.when('/r/:subreddit', {
    	templateUrl: 'views/entries.html', 	
    	controller: 'EntryCtrl'
  	})
  	.when('/r/:cat/comments/:id/:article', {
    	templateUrl: 'views/coments.html', 	
    	controller: 'EntryCtrl'
  	})
  $routeProvider.otherwise({redirectTo: '/'})
}])


Reddit.controller('EntryCtrl', function($scope, $http, $routeParams, $reddit) {
  $scope.links = []
  $scope.coments = []
  $scope.loading = true
  $scope.subreddit = null
  $scope.cat = null
  var base_url = 'http://www.reddit.com/'
  var url = ''
  var comments = false
  
  if($routeParams.cat) {
  	url = 'r/'+$routeParams.cat+'/comments/'+$routeParams.id+'/'+$routeParams.article
  	comments = true
  }else if ($routeParams.subreddit) {
    url = $routeParams.subreddit
  }

  $http.get(base_url + (url || '') + '/.json').success(function(res, status) {
     $scope.loading = false
     if(comments){
     	$scope.links = res[0].data.children
        $scope.coments = res[1].data.children
     }else{
       $scope.links = res.data.children
     }
  });
})

Reddit.service('$reddit', function($http) {})

Reddit.filter('thumbs', function() {
  return function(link) {
    if (link.indexOf('/') != -1) {
      return link
    }else {
      return ''
    }
  }
})


Reddit.filter('repies', function() {
  return function(repies) {
    if (repies != undefined && repies != "" && typeof repies != 'Object') {
    	return true;
  	}else{
  		return false;
  	}
  }
})