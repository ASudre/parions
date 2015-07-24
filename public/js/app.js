var app = angular.module("parionsApp", []);


app.controller("listMatchController", function($scope){
    $scope.title = "Titre";
    $scope.matchs = listMatchs;

    $scope.saveBet = function(idMatch) {
        if(!idMatch || idMatch == "") {
            alert('Erreur de sauvegarde.');
            return;
        }
        else if(!equipe || equipe == "") {
            alert("Nom d'équipe non reconnu");
            return;
        }
        else if(!mise || mise == "") {
            alert('Valeur de la mise non valide');
            return;
        }

        // Appel à l'api
        $.ajax({
            type: 'POST',
            url: '/saveMatch',
            data: { 
                'idMatch': idMatch, 
                'equipe': equipe, 
                'mise': mise
            },
            dataType: 'json',
            success: function(msg){

                if(!msg.error) {
                    alert('Votre pari a été enregistré.');
                }
                else {
                    alert("L'enregistrement de votre pari a rencontré une erreur.");    
                }
            }
        });
    };



});

/**app.directive("expander", function(){
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {title: '=expanderTitle'},
        template: '<div>' +
        '<div class="title" ng-click="toggle()">{{title}}</div>' +
        '<div class="body" ng-show="showMe" ng-transclude></div>' +
        '</div>',
        link: function(scope, element, attrs){
            scope.showMe = false;
            scope.toggle = function toggle(){
                scope.showMe = !scope.showMe;
            };
        }
    };
});*/