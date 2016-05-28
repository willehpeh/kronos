angular.module('KronosDashboard').controller('AmbassadorModalCtrl', AmbassadorModalCtrl);

function AmbassadorModalCtrl(
  $scope,
  AmbassadorService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance) {

    $scope.addNewAmbassador = function() {
      var ambassador = $scope.newAmbassador;
      var token = store.get('token');
      $('#add-button').text('');
      $('#add-button').add('span');
      $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');
      AmbassadorService.newAmbassador(ambassador, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $scope.newAmbassador = {};
        $uibModalInstance.close('Success!');

      }, function(data) {
        console.log("Failure!");
        console.log(data);
      });
    }

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }

  }
