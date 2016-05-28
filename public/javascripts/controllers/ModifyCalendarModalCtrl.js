angular.module('KronosDashboard').controller('ModifyCalendarModalCtrl', ModifyCalendarModalCtrl);

function ModifyCalendarModalCtrl(
  $scope,
  CalendarService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

  var getCalendarElementToModify = function(id) {
    CalendarService.getCalendarElement(id).then(function(data) {
      console.log('Got the element: ');
      console.log(data);
      $scope.calendarElementToModify = data;
    });
  }

  getCalendarElementToModify(id);

  $scope.saveChanges = function(id) {
    var id = id;
    var calendarelement = $scope.calendarElementToModify;
    var token = store.get('token');

    $('#add-button').text('');
    $('#add-button').add('span');
    $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');

    CalendarService.modifyCalendarElement(id, calendarelement, token).then(function(data) {
      console.log("Success!");
      console.log(data);
      $uibModalInstance.close('Success!');
    });
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
}
