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
  $uibModal,
  Upload) {

// ==============================================================================

//                        LOGIN/LOGOUT FUNCTIONS

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

  $scope.logout = function() {
    store.remove('token');
    $window.location.href = "/dashboard";
  }

// ==============================================================================

//                        IMAGE UPLOAD FUNCTIONS

// ==============================================================================

$scope.uploadImage = function(id, url, file) {
  Upload.upload({
    url: url + id,
    data: {file: file}
  }).then(function() {
    getEverything();
  }, function(err) {
    console.log('Upload failure.');
    console.log(err);
  }, function(evt) {
    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    console.log($scope.progressPercentage);
  });
}

// ==============================================================================

//                        IMAGE DELETE FUNCTIONS

// ==============================================================================

$scope.deleteNewsPhoto = function(id, photo) {
  var token = store.get('token');
  NewsService.deleteNewsPhoto(id, photo, token).then(function(data) {
    console.log("Success.");
    console.log(data);
    getAllNews();
  });
}

$scope.deleteFrontPhoto = function(id) {
  var token = store.get('token');
  WatchService.deleteFrontPhoto(id, token).then(function(data) {
    console.log("Success.");
    console.log(data);
    getWatches();
  });
}

$scope.deleteBackPhoto = function(id) {
  var token = store.get('token');
  WatchService.deleteBackPhoto(id, token).then(function(data) {
    console.log("Success.");
    console.log(data);
    getWatches();
  });
}

$scope.deleteQuarterPhoto = function(id) {
  var token = store.get('token');
  WatchService.deleteQuarterPhoto(id, token).then(function(data) {
    console.log("Success.");
    console.log(data);
    getWatches();
  });
}

$scope.deleteExtraPhoto = function(id, photo) {
  var token = store.get('token');
  WatchService.deleteExtraPhoto(id, photo, token).then(function(data) {
    console.log("Success.");
    console.log(data);
    getWatches();
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

  var getEverything = function() {
    getWatches();
    getAllNews();
    getAllPressPhotos();
    getAllCalendarElements();
    getAllAmbassadors();
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
// opens modal screen allowing to add new News objects
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
// opens modan screen allowing to modify chosen News object
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
// opens modal screen allowing to delete chosen News object
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
// opens modal screen allowing to add new Ambassador objects
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
// opens modan screen allowing to modify chosen Ambassador object
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
// opens modal screen allowing to delete chosen Ambassador object
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

//                        PRESS PHOTO MODAL FUNCTIONS

// ==============================================================================

$scope.openPressModal = function() {
// opens modal screen allowing to add new PressPhoto objects
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_press-modal.html',
    controller: PressModalCtrl
  }).result.then(function() {
  // renew watch list to show changes
    getAllPressPhotos();
  });
}

$scope.modifyPressModal = function(id) {
// opens modan screen allowing to modify chosen PressPhoto object
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_modify-press-modal.html',
    controller: ModifyPressModalCtrl,
  // sends id to modal
    resolve: {
      id: function() {
        return id;
      }
    }
  }).result.then(function() {
  // renew watch list to show changes
    getAllPressPhotos();
  });
}

$scope.deletePressModal = function(id) {
// opens modal screen allowing to delete chosen PressPhoto object
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_delete-press-modal.html',
    controller: DeletePressCtrl,
  // sends id to modal
    resolve: {
      id: function() {
        return id;
      }
    }
  }).result.then(function() {
  // renew watch list to show changes
    getAllPressPhotos();
  });
}

// ==============================================================================

//                        CALENDAR ELEMENT MODAL FUNCTIONS

// ==============================================================================

$scope.openCalendarModal = function() {
// opens modal screen allowing to add new CalendarElement objects
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_calendar-modal.html',
    controller: CalendarModalCtrl
  }).result.then(function() {
  // renew watch list to show changes
    getAllCalendarElements();
  });
}

$scope.modifyCalendarModal = function(id) {
// opens modan screen allowing to modify chosen CalendarElement object
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_modify-calendar-modal.html',
    controller: ModifyCalendarModalCtrl,
  // sends id to modal
    resolve: {
      id: function() {
        return id;
      }
    }
  }).result.then(function() {
  // renew watch list to show changes
    getAllCalendarElements();
  });
}

$scope.deleteCalendarModal = function(id) {
// opens modal screen allowing to delete chosen CalendarElement object
  $uibModal.open({
    animation: true,
    templateUrl: 'partials/_delete-calendar-modal.html',
    controller: DeleteCalendarCtrl,
  // sends id to modal
    resolve: {
      id: function() {
        return id;
      }
    }
  }).result.then(function() {
  // renew watch list to show changes
    getAllCalendarElements();
  });
}

// ==============================================================================

//                        RUN 'GET ALL' FUNCTIONS

// ==============================================================================

  getEverything();
}
