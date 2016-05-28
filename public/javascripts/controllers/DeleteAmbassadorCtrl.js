angular.module('KronosDashboard').controller('DeleteAmbassadorCtrl', DeleteAmbassadorCtrl);

function DeleteAmbassadorCtrl(
  $scope,
  AmbassadorService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

    var getAmbassadorToDelete = function(id) {
      AmbassadorService.getAmbassador(id).then(function(data) {
        console.log('Got the ambassador: ');
        console.log(data);
        $scope.ambassador = data;
      });
    }

    getAmbassadorToDelete(id);

    $scope.confirmDeleteAmbassador = function(id) {
      var id = id;
      var token = store.get('token');

      $('#delete-button').text('');
      $('#delete-button').add('span');
      $('#delete-button').children().addClass('fa fa-lg fa-spin fa-spinner');

      AmbassadorService.deleteAmbassador(id, token).then(function(data) {
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
