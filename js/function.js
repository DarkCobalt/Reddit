var Reddit = angular.module('Reddit', ['ngRoute','RecursionHelper'])



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
  	.when('/domain/:domain', {
    	templateUrl: 'views/entries.html', 
    	controller: 'EntryCtrl'
  	})
  	.when('/r/:cat/comments/:id/:article', {
    	templateUrl: 'views/coments.html', 	
    	controller: 'EntryCtrl'
  	})
  $routeProvider.otherwise({redirectTo: '/'})
}])


var new_comments = [];
var root = 0;

Reddit.controller('EntryCtrl', function($scope, $http, $routeParams, $reddit) {
  $scope.links = []
  $scope.coments = []
  $scope.loading = true
  $scope.startRank = 1

  $scope.subreddit = null
  $scope.cat = null
  $scope.domain = null
  var base_url = 'http://www.reddit.com/'
  var url = ''
  var comments = false
  
	
  if($routeParams.cat) {
  	url = 'r/'+$routeParams.cat+'/comments/'+$routeParams.id+'/'+$routeParams.article
  	comments = true
  }else if ($routeParams.subreddit) {
    url = $routeParams.subreddit
  } else if ($routeParams.domain) {
    if ($routeParams.domain.indexOf('self.') == 0) {
      url = $routeParams.domain.substring(5)
    }
    else {
      url = $routeParams.domain
    }
  }

  
  $http.get(base_url + (url || '') + '/.json').success(function(res, status) {
     $scope.loading = false
     if(comments){
     	$scope.links = res[0].data.children
        $scope.coments = res[1].data.children
        
        angular.forEach($scope.coments, function(value, key) {
			
			new_comments.push({'autor' : value.data.author, 'comment':value.data.body, 'root':root});

			if (value.data.replies != "") 
				searchTree(value.data.replies.data.children);

	    }, new_comments);
	    $scope.new_comments = new_comments;
     }else{
       $scope.links = res.data.children
     }
      
});


function searchTree(currChild){
	  root++;
    for(var i=0; i < currChild.length; i ++){
		new_comments.push({'autor' : currChild[i].data.author, 'comment':currChild[i].data.body,'root':root});

    	if (currChild[i].data.replies != "") {
    		searchTree(currChild[i].data.replies.data.children);
    	}
     }
     root--;	
     return null;
}
	
})


Reddit.service('$reddit', function($http) {})


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