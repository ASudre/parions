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
        var equipe1 = $scope.matchs[index].equipe1;
        var equipe2 = $scope.matchs[index].equipe2;

        if((!idMatch || idMatch == "") || (!$scope.matchs[index] || $scope.matchs[index] == "")) {
            alert('Erreur de sauvegarde.');
            return;
        }
        else if(!equipeMise || equipeMise == ""
            || (equipe1 != equipeMise
                && equipe2 != equipeMise
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

                        if(equipeMise == equipe1) {
                            $scope.matchs[index].mises['equipe1'] += valeurMise;
                        }
                        else if(equipeMise == equipe1) {
                            $scope.matchs[index].mises['equipe2'] += valeurMise;
                        }
                        else if(equipeMise == 'Nul') {
                            $scope.matchs[index].mises['nul'] += valeurMise;
                        }

                    });

                    alert('Votre pari a été enregistré.');
                }
                else {
                    alert(msg.message);    
                }
            }
        });
    };


    $scope.calculeCote = function(index, equipe) {
        var mises = $scope.matchs[index].mises;
        misesNul = mises['nul'];
        misesEq1 = mises['equipe1'];
        misesEq2 = mises['equipe2'];

        var cote = "*";

        if(equipe == "equipe1") {
           cote = (misesEq1 == 0) ? "*" : (misesEq2 + misesNul) / misesEq1;
        }
        else if(equipe == "nul") {
            cote = (misesNul == 0) ? "*" : (misesEq1 + misesEq2) / misesNul;
        }
        else if(equipe == "equipe2") {
            cote = (misesEq2 == 0) ? "*" : (misesEq1 + misesNul) / misesEq2;
        }
        else {

        }

        return cote;

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