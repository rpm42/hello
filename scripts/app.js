var configure = function () {
  console.log("configure...");
}

var main = function (){
  console.log("main...");
}

angular.module('hello', [])
  .config([configure])
  .run([main])
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    }
  }).directive('contenteditable', [function() {
      return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, element, attrs, ngModel) {
          if (!ngModel) return; // do nothing if no ng-model

          console.log("LINK contenteditable");

          // Specify how UI should be updated
          ngModel.$render = function() {
            element.text(ngModel.$viewValue || '');
          };

          // Listen for change events to enable binding
          element.on('blur keyup change', function() {
            scope.$evalAsync(read);
          });
          read(); // initialize

          // Write data to the model
          function read() {
            console.log("READ contenteditable");
            var text = element.text();
            ngModel.$setViewValue(text);
          }
        }
      };
    }])
  .controller('MessageController', ['$scope', function($scope){
    $scope.messages = [];
    $scope.moment = moment;
    $scope.edit = {id: null, text: ""};

    $scope.getMessages = function() {
      $scope.messages = [{
        id: UUID.generate(),
        text: "Hello, this first message!",
        created_at: moment().valueOf()
      },{
        id: UUID.generate(),
        text: "Test 123 Test test ",
        created_at: moment().valueOf()
      }];
      console.log("getMessages", $scope.messages);
    };

    $scope.createMessage = function() {
      console.log("createMessage");
      $scope.message.id = UUID.generate();
      $scope.message.created_at = moment().valueOf();
      $scope.messages.push($scope.message);
      console.log("createMessage", $scope.message);
      $scope.message = {text: ""};

    };

    $scope.deleteMessage = function(id) {
      console.log("deleteMessage", id);
      _.remove($scope.messages, {id: id});
    };

    $scope.editId = null;

    $scope.startEdit = function(id, text) {
      $scope.edit.id = id;
      $scope.edit.text = text;
    };

    $scope.updateMessage = function(id) {
      console.log("updateMessage", id, $scope.edit.text);
      $scope.$evalAsync(updateCompletion, {id: $scope.edit.id, text: $scope.edit.text});
      $scope.edit.id = null;
      $scope.edit.text = "";
    };

    var updateCompletion = function(scope, edit) {
      console.log("updateCompletion", scope, edit);
      var i = _.findIndex($scope.messages, {id: edit.id});
      console.log("found", i, $scope.messages[i]);
      if (i) {
        scope.messages[i].text = edit.text;
      }
    }

    $scope.getMessages();

  }]);
