angular.module('KronosDashboard').controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl(
  $scope,
  AuthService,
  WatchService,
  NewsService,
  PressPhotoService,
  CalendarService,
  AmbassadorService,
  store,
  $window,
  $timeout,
  $uibModal) {

// ==============================================================================

//                        LOGIN FUNCTION

// ==============================================================================


  $scope.login = function() {
  // login function calls AuthService login on username and password entered in login screen
    var user = {username: $scope.username, password: $scope.password};
    AuthService.login(user).then(function(data) {
      console.log(data);
      store.set('token', data.token);
      $window.location.href = '/dashboard?token=' + store.get('token');
    }, function(data) {
      console.log(data);
    });
  }

// ==============================================================================

//                        "GET ALL" FUNCTIONS

// ==============================================================================

  var getWatches = function() {
  // attributes all watches to watchArray
    WatchService.getWatches().then(function(data) {
      console.log("getWatches Success!");
      $scope.watchArray = data;
    });
  }

  var getAllNews = function() {
  // attributes all news posts to newsArray
    NewsService.getNewsPosts().then(function(data) {
      console.log("getNews Success!");
      $scope.newsArray = data;
    }, function(data) {
      console.log("getNews went wrong!");
      console.log(data);
    });
  }

  var getAllPressPhotos = function() {
  // attributes all press photos to pressPhotoArray
    PressPhotoService.getPressPhotos().then(function(data) {
      console.log("getPressPhotos Success!");
      $scope.pressPhotoArray = data;
    }, function(data) {
      console.log("getPressPhotos went wrong!");
      console.log(data);
    });
  }

  var getAllCalendarElements = function() {
  // attributes all calendar elements to calendarElementArray
    CalendarService.getCalendarElements().then(function(data) {
      console.log("getAllCalendarElements Success!");
      $scope.calendarElementArray = data;
    }, function(data) {
      console.log("getAllCalendarElements went wrong!");
      console.log(data);
    });
  }

  var getAllAmbassadors = function() {
  // attributes all ambassadors to ambassadorArray
    AmbassadorService.getAmbassadors().then(function(data) {
      console.log("getAllAmbassadors Success!");
      $scope.ambassadorArray = data;
    }, function(data) {
      console.log("getAllAmbassadors went wrong!");
      console.log(data);
    });
  }

// ==============================================================================

//                        WATCH MODAL FUNCTIONS

// ==============================================================================

  $scope.openWatchModal = function() {
  // opens modal screen allowing to add new Watch objects
    $uibModal.open({
      animation: true,
      templateUrl: 'partials/_watch-modal.html',
      controller: WatchModalCtrl
    }).result.then(function() {
    // renew watch list to show changes
      getWatches();
    });
  }

  $scope.modifyWatchModal = function(id) {
  // opens modan screen allowing to modify chosen Watch object
    $uibModal.open({
      animation: true,
      templateUrl: 'partials/_modify-watch-modal.html',
      controller: ModifyWatchModalCtrl,
    // sends id to modal
      resolve: {
        id: function() {
          return id;
        }
      }
    }).result.then(function() {
    // renew watch list to show changes
      getWatches();
    });
  }

  $scope.deleteWatchModal = function(id) {
  // opens modal screen allowing to delete chosen Watch object
    $uibModal.open({
      animation: true,
      templateUrl: 'partials/_delete-watch-modal.html',
      controller: DeleteWatchCtrl,
    // sends id to modal
      resolve: {
        id: function() {
          return id;
        }
      }
    }).result.then(function() {
    // renew watch list to show changes
      getWatches();
    });
  }

// ==============================================================================

//                        NEWS MODAL FUNCTIONS

// ==============================================================================

$scope.openNewsModal = function() {
// opens modal screen allowing to add new Watch objects
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_news-modal.html',
    controller: NewsModalCtrl
  }).result.then(function() {
  // renew watch list to show changes
    getAllNews();
  });
}

$scope.modifyNewsModal = function(id) {
// opens modan screen allowing to modify chosen Watch object
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_modify-news-modal.html',
    controller: ModifyNewsModalCtrl,
  // sends id to modal
    resolve: {
      id: function() {
        return id;
      }
    }
  }).result.then(function() {
  // renew watch list to show changes
    getAllNews();
  });
}

$scope.deleteNewsModal = function(id) {
// opens modal screen allowing to delete chosen Watch object
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_delete-news-modal.html',
    controller: DeleteNewsCtrl,
  // sends id to modal
    resolve: {
      id: function() {
        return id;
      }
    }
  }).result.then(function() {
  // renew watch list to show changes
    getAllNews();
  });
}

// ==============================================================================

//                        AMBASSADOR MODAL FUNCTIONS

// ==============================================================================

$scope.openAmbassadorModal = function() {
// opens modal screen allowing to add new Watch objects
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_ambassador-modal.html',
    controller: AmbassadorModalCtrl
  }).result.then(function() {
  // renew watch list to show changes
    getAllAmbassadors();
  });
}

$scope.modifyAmbassadorModal = function(id) {
// opens modan screen allowing to modify chosen Watch object
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_modify-ambassador-modal.html',
    controller: ModifyAmbassadorModalCtrl,
  // sends id to modal
    resolve: {
      id: function() {
        return id;
      }
    }
  }).result.then(function() {
  // renew watch list to show changes
    getAllAmbassadors();
  });
}

$scope.deleteAmbassadorModal = function(id) {
// opens modal screen allowing to delete chosen Watch object
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_delete-ambassador-modal.html',
    controller: DeleteAmbassadorCtrl,
  // sends id to modal
    resolve: {
      id: function() {
        return id;
      }
    }
  }).result.then(function() {
  // renew watch list to show changes
    getAllAmbassadors();
  });
}

// ==============================================================================

//                        RUN 'GET ALL' FUNCTIONS

// ==============================================================================

  getWatches();
  getAllNews();
  getAllPressPhotos();
  getAllCalendarElements();
  getAllAmbassadors();
}
