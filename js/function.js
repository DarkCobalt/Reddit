var Reddit = angular.module('Reddit', ['ngRoute'])



Reddit.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  	.when('/', {
    	templateUrl: 'views/entries.html', 
    	controller: 'EntryCtrl'
  	})
  	.when('/:category', {
    	templateUrl: 'views/entries.html', 	
    	controller: 'EntryCtrl'
  	})
  	.when('/r/:subreddit', {
    	templateUrl: 'views/entries.html', 	
    	controller: 'EntryCtrl'
  	})
  	.when('/domain/:domain', {
    	templateUrl: 'views/entries.html', 
    	controller: 'EntryCtrl'
  	})
  	.when('/comments/:comments', {
    	templateUrl: 'views/comments.html', 
    	controller: 'CommentsCtrl'
  	})
  $routeProvider.otherwise({redirectTo: '/'})
}])


Reddit.controller('EntryCtrl', function($scope, $routeParams, $reddit) {
  $scope.links = []
  $scope.loading = true
  $scope.startRank = 1

  $scope.subreddit = null
  $scope.domain = null

  window.onLinksReceived = function(res) {
    $scope.loading = false
    $scope.links = res.data.children
   // console.log($scope.links)
  }
  $reddit.callbackName = 'onLinksReceived'

  if ($routeParams.subreddit) {
    $scope.subreddit = $routeParams.subreddit
  }
  else if ($routeParams.domain) {
    if ($routeParams.domain.indexOf('self.') == 0) {
      $scope.subreddit = $routeParams.domain.substring(5)
    }
    else {
      $scope.domain = $routeParams.domain
    }
  }
	
  if ($scope.category) {
    $reddit.category($scope.category)
  }else if ($scope.subreddit) {
    $reddit.subreddit($scope.subreddit)
  }
  else if ($scope.domain) {
    $reddit.domain($scope.domain)
  }
  else {
    $reddit.index()
  }
 
})


Reddit.service('$reddit', function($http) {
  var base_url = 'http://www.reddit.com/'

  var jsonp = function(url) {
	$http.jsonp(base_url + (url || '') + '.json?jsonp=' + this.callbackName)
  }.bind(this)
  

  this.callbackName = null

  this.index = function() {
    jsonp()
  }
  this.category = function(category) {
    jsonp(category)
  }

  this.subreddit = function(subreddit) {
    jsonp('r/' + subreddit)
  }

  this.domain = function(domain) {
    jsonp('domain/' + domain)
  }
})


Reddit.filter('domainURL', function() {
  return function(domain) {
    if (domain.indexOf('self.') == 0) {
      return '/r/' + domain.substring(5)
    }
    else {
      return '/domain/' + domain
    }
  }
})

Reddit.filter('thumbs', function() {
  return function(link) {
    if (link.indexOf('/') != -1) {
      return link;
    }
    else {
      return '';
    }
  }
})
