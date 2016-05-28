angular.module('KronosDashboard').controller('ModifyAmbassadorModalCtrl', ModifyAmbassadorModalCtrl);

function ModifyAmbassadorModalCtrl(
  $scope,
  AmbassadorService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

  var getAmbassadorToModify = function(id) {
    AmbassadorService.getAmbassador(id).then(function(data) {
      console.log('Got the watch: ');
      console.log(data);
      $scope.ambassadorToModify = data;
    });
  }

  getAmbassadorToModify(id);

  $scope.saveChanges = function(id) {
    var id = id;
    var ambassador = $scope.ambassadorToModify;
    var token = store.get('token');

    $('#add-button').text('');
    $('#add-button').add('span');
    $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');

    AmbassadorService.modifyAmbassador(id, ambassador, token).then(function(data) {
      console.log("Success!");
      console.log(data);
      $uibModalInstance.close('Success!');
    });
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
}
