angular.module('KronosDashboard').controller('DeleteWatchCtrl', DeleteWatchCtrl);

function DeleteWatchCtrl(
  $scope,
  WatchService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

    var getWatchToDelete = function(id) {
      WatchService.getWatch(id).then(function(data) {
        console.log('Got the watch: ');
        console.log(data);
        $scope.watch = data;
      });
    }

    getWatchToDelete(id);

    $scope.confirmDeleteWatch = function(id) {
      var id = id;
      var token = store.get('token');

      $('#delete-button').text('');
      $('#delete-button').add('span');
      $('#delete-button').children().addClass('fa fa-lg fa-spin fa-spinner');

      WatchService.deleteWatch(id, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $uibModalInstance.close('Success!');
      }, function(data) {
        console.log("Failure!");
        console.log(data);
      })
    }

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }
  }
