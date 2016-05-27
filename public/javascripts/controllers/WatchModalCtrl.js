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
      $('#add-button').text('');
      $('#add-button').add('span');
      $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');
      WatchService.newWatch(watch, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $scope.newWatch = {};
        $uibModalInstance.close('Success!');

      }, function(data) {
        console.log("Failure!");
        console.log(data);
        $scope.newWatch = store.get('watchTemp');
      });
    }

    $scope.ok = function() {
      $uibModalInstance.close('close');
    }

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }
  }
