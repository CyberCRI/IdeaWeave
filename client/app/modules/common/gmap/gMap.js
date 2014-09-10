angular.module('cri.common')
.factory('Gmap',['$q','users','Project','Challenge',function($q,users,Project,Challenge){
        var service = {
            getAdress : function(address){
                var defered = $q.defer();
                var xhr = new XMLHttpRequest();
                xhr.open('GET','http://maps.googleapis.com/maps/api/geocode/json?address='+address+"&sensor=false");
                xhr.send();
                xhr.onreadystatechange = function(){
                    if(xhr.status == 200 && xhr.readyState == 4){
                        defered.resolve(JSON.parse(xhr.responseText).results);
                    }
                }
                return defered.promise;
            },
            getAllPositions : function(){
                var defered = $q.defer();
                $q.all([
                    users.fetch({type : 'position'}),
                    Project.fetch({type : 'position'}),
                    Challenge.fetch({type : 'position'})
                ]).then(function(data){
                    defered.resolve(data);
                }).catch(function(err){
                    defered.reject(err)
                })
                return defered.promise;
            }
        };
        return service;
    }])
