angular.module('cri.message')
 .config(['$stateProvider','$locationProvider',function ($stateProvider,$locationProvider) {
     $locationProvider.html5Mode(true);
     $stateProvider
         .state('message',{
            url :'/message',
             views : {
                 mainView : {
                     templateUrl : 'modules/message/templates/message.tpl.html',
                     controller :'MessageCtrl'
                 }
             }
         })
        .state('message.send',{
            url:'/send',
             views : {
                 messageView : {
                     templateUrl: 'modules/message/templates/send-message.tpl.html',
                     controller: 'SendMessagesCtrl'
                 }
             }
      })
         .state('message.inbox',{
             url :'/inbox',
             views : {
                 messageView : {
                     templateUrl : 'modules/message/templates/inbox.tpl.html',
                     controller : 'InboxCtrl'
                 }
             },
             resolve : {
                messages :['Message','loggedUser',function(Message,loggedUser){
                    return Message.fetch({ to : loggedUser.profile.id});
                }]
            }
         })
  }]);