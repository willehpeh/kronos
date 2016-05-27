angular.module('KronosDashboard').controller('WatchModalCtrl', WatchModalCtrl);

function WatchModalCtrl(
  $scope,
  WatchService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance) {
    $scope.addNewWatch = function() {
      var watch = $scope.newWatch;
      var token = store.get('token');
      store.set('watchTemp', watch);
      $scope.newWatch = {};
      WatchService.newWatch(watch, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $scope.newWatch = {};
        $scope.watchmessage = "Watch successfully added!"
        $timeout(function() {
          $scope.watchmessage = "";
        }, 5000);
        getWatches();

      }, function(data) {
        console.log("Failure!");
        console.log(data);
        $scope.newWatch = store.get('watchTemp');
        $scope.watchmessage = "Uh-oh, something went wrong!"
      });
    }

    $scope.beginModifyWatch = function(id) {
      WatchService.getWatch(id).then(function(data) {
        console.log('Got the watch: ');
        console.log(data);
      });
    }

    $scope.deleteWatch = function(id) {
      var token = store.get('token');
      $('#'+id).css({
        'color': '#AAA'
      });
      WatchService.deleteWatch(id, token).then(function(data) {
        console.log('Watch deleted.');
        console.log(data);
        getWatches();
      })
    }

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }
  }
