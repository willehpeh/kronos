angular.module('KronosDashboard').controller('CalendarModalCtrl', CalendarModalCtrl);

function CalendarModalCtrl(
  $scope,
  CalendarService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance) {

    $scope.addNewCalendarElement = function() {
      var calendarelement = $scope.newCalendarElement;
      var token = store.get('token');
      $('#add-button').text('');
      $('#add-button').add('span');
      $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');
      CalendarService.newCalendarElement(calendarelement, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $scope.newCalendarElement = {};
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
