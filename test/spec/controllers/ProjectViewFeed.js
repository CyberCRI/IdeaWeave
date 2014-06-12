'use strict';

describe('Controller: ProjectViewFeedCtrl', function () {

  // load the controller's module
  beforeEach(module('jizhiApp'));

  var ProjectViewFeedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectViewFeedCtrl = $controller('ProjectViewFeedCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
