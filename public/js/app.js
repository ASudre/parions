var app = angular.module("parionsApp", []);


app.controller("listMatchController", function($scope){
    $scope.title = "Titre";
    $scope.matchs = listMatchs;
    $scope.sommeMisesUtilisateur = sommeMisesUtilisateur;
    $scope.cagnotte = cagnotte;

    $scope.saveBet = function(index, idMatch) {

        console.log($scope.matchs[index]);

        var equipeMise = $scope.matchs[index].nouvelleMiseEquipe;
        var valeurMise = $scope.matchs[index].nouvelleMiseValeur;

        if((!idMatch || idMatch == "") || (!$scope.matchs[index] || $scope.matchs[index] == "")) {
            alert('Erreur de sauvegarde.');
            return;
        }
        else if(!equipeMise || equipeMise == ""
            || ($scope.matchs[index].equipe1 != equipeMise
                && $scope.matchs[index].equipe2 != equipeMise
                && equipeMise != 'Nul'
                )
            ) {
            alert("Nom d'équipe non reconnu");
            return;
        }
        else if(!valeurMise || valeurMise == "") {
            alert('Valeur de la mise non valide');
            return;
        }

        // Appel à l'api
        $.ajax({
            type: 'POST',
            url: '/saveMatch',
            data: { 
                'idMatch': idMatch, 
                'equipe': equipeMise, 
                'mise': valeurMise
            },
            dataType: 'json',
            success: function(msg){

                if(!msg.error) {

                    var nouvelleMise = {"valeurMise": valeurMise, "equipe": equipeMise, "date": new Date()};

                    $scope.$apply(function(){
                        $scope.matchs[index].misesUtilisateur.push(nouvelleMise);
                        $scope.sommeMisesUtilisateur += valeurMise;
                    });

                    alert('Votre pari a été enregistré.');
                }
                else {
                    alert(msg.message);    
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