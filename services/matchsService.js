// Module dependencies.
// load up the user model
var Match = require('../app/models/match'),
    match = {};


// ALL
match.getMatchList = function (userEmail, callback) {
	Match.find({}).sort( { date: 1 } ).exec(function(err, result) {

		var retourMatchs = new Array();
		var sommeMisesUtilisateur = 0;

		for (matchIt of result) {

			var mises = matchIt.mises;
			var sommeMisesEq1 = 0;
			var sommeMisesNul = 0;
			var sommeMisesEq2 = 0;
		
			var idMatch = matchIt.idMatch;
			var equipe1 = matchIt.equipe1.nomEquipe;			
			var equipe2 = matchIt.equipe2.nomEquipe;		
			var date = matchIt.date;

			var miseUtilisateur = new Array();
			var pariAffiche="";

			// Ne pas afficher la possibilité de miser si la date de début de match est dépassée
			var dateCourante = new Date();
			var afficherInput = date > dateCourante;

			for (mise of mises) {

				switch(mise.equipe) {
					case equipe1:
						sommeMisesEq1+=mise.valeurMise;
						break;
					case equipe2:
						sommeMisesEq2+=mise.valeurMise;
						break;
					case 'Nul':
						sommeMisesNul+=mise.valeurMise;
						break;
					default:
						console.log("Mise ne correspondant pas au match " + idMatch);
				}

				if(mise.emailUtilisateur == userEmail) {

					pariAffiche = {
						"equipe": mise.equipe,
						"valeurMise": mise.valeurMise,
						"date": mise.date
					};

					miseUtilisateur.push(pariAffiche);
					sommeMisesUtilisateur+=mise.valeurMise;
 
				}

			}

			var mises = {};

			mises['equipe1'] = sommeMisesEq1;
			mises['nul'] = sommeMisesNul;
			mises['equipe2'] = sommeMisesEq2;

			matchRes = {
				"idMatch": idMatch,
				"equipe1": equipe1,
				"equipe2": equipe2,
				"date": date,
				"mises": mises,
				"misesUtilisateur": miseUtilisateur,
				"nouvelleMiseValeur": 0,
				"nouvelleMiseEquipe": "",
				"pariAffiche": pariAffiche,
				"afficherInput": afficherInput
			};

			retourMatchs.push(matchRes);
		}

		var retour = {"matchs": retourMatchs, "sommeMisesUtilisateur": sommeMisesUtilisateur};
		console.log(retour);
		//result=...
		callback(null, retour)
	});
};

match.getMatch = function (idMatch, callback) {
	Match.find(
	{
		"idMatch" : idMatch
	}).exec(function(err, result) {
		callback(result);
	});

}

match.saveMatch = function (userEmail, idMatch, equipe, mise, callback) {

	Match.find({ 
			idMatch: idMatch, "mises.emailUtilisateur": userEmail
		}).exec(function(err, resultQuery) {
			var error = false;
			var result = "";

			//if(resultQuery.length == 0) {
			result = match.insertBet(userEmail, idMatch, equipe, mise);
			/*}
			else if (resultQuery.length == 1) {
				result = match.updateBet(userEmail, idMatch, equipe, mise);
			}
			else {
				error = true;
			}*/
			//result=...
			callback('{"error": ' + error + ', "message": "Erreur de sauvegarde du pari."}');
	});
};

match.saveScore = function (idMatch, scoreEquipe1, scoreEquipe2, callback) {
	Match.update
	(
		{ 
			idMatch: idMatch
		},
		{
			"equipe1.score": scoreEquipe1,
			"equipe2.score": scoreEquipe2
		}
	).exec(function(err, result) {
		var error = false;
		callback('{"error": ' + error + '}');
	});
};


match.updateBet = function (userEmail, idMatch, equipe, mise) {
	Match.update
	(
		{ 
			idMatch: idMatch, "mises.emailUtilisateur": userEmail
		},
		{
			$set: { "mises.$.valeurMise": mise, "mises.$.equipe": equipe}
		}
	).exec(function(err, result) {
		return result;
	});
};

match.insertBet = function (userEmail, idMatch, equipe, mise) {
	Match.update
	(
		{ 
			idMatch: idMatch
		},
		{
			$push: { mises: {"emailUtilisateur": userEmail, "valeurMise": mise, "equipe": equipe} }
		}
	).exec(function(err, result) {
		return result;
	});
};

//router.get('/listMatchs', match.list);
/*router.route('/post/:id')
  .get(match.post)
  .put(match.editPost)
  .delete(match.deletePost);
*/

module.exports = match;