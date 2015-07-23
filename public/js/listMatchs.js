$( document ).ready(function() {

    $('.nav li').click(function(event){
        $('#content').load($(this).find('a').attr('href'), function() {
			$('.active').removeClass('active');
			$(this).addClass('active');
		});      

    });

	// Mise en place des boutons de mise
	$('table.listMatchs tr').each(
		function(index) {
			var idMatch = $( this ).attr('id');
			$( this ).find("input[name='valider']").on('click', function() {
				saveBet(idMatch, $('tr#' + idMatch + ' select option:selected').val(), $('tr#' + idMatch + ' input[name="mise"]').val());
			})
		}
	)

	// Mise en place des boutons d'enregistrement des scores
	$('table.listMatchs tr').each(
		function(index) {
			var idMatch = $( this ).attr('id');
			$( this ).find("input[name='validerScore']").on('click', function() {
				saveScore(idMatch, $('tr#' + idMatch + ' input[name="scoreEquipe1"]').val(), $('tr#' + idMatch + ' input[name="scoreEquipe2"]').val());
			})
		}
	)

});

/**
* Sauvegarde d'un match en base
*/
function saveBet(idMatch, equipe, mise) {
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
}

/**
* Sauvegarde d'un score en base
*/
function saveScore(idMatch, scoreEquipe1, scoreEquipe2) {
	if(!scoreEquipe1 || scoreEquipe1 == "") {
		alert("Score de l'équipe 1 invalide.");
		return;
	}
	else if(!scoreEquipe2 || scoreEquipe2 == "") {
		alert("Score de l'équipe 2 invalide.");
		return;
	}

	// Appel à l'api
	$.ajax({
	    type: 'POST',
	    url: '/saveScore',
	    data: { 
	    	'idMatch': idMatch,
	        'scoreEquipe1': scoreEquipe1, 
	        'scoreEquipe2': scoreEquipe2
	    },
	    dataType: 'json',
	    success: function(msg){

	        if(!msg.error) {
	        	alert('Le score a été enregistré.');
	        }
	        else {
	        	alert("L'enregistrement du score a rencontré une erreur.");	
	        }
	    }
	});
}