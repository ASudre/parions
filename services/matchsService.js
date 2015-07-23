// Module dependencies.
// load up the user model
var Match = require('../app/models/match'),
    match = {};


// ALL
match.getMatchList = function (userEmail, callback) {
	Match.find({}).sort( { date: 1 } ).exec(function(err, result) {

		var retourMatchs = new Array();
		var sommeMisesUtilisateur = 0;

		console.log(result);

		for (matchIt of result) {

			// calcul de la somme des cotes
			//val.cotes = calculeCote
			var mises = matchIt.mises;
			var sommeMisesEq1 = 0;
			var sommeMisesNul = 0;
			var sommeMisesEq2 = 0;
		
			var idMatch = matchIt.idMatch;
			var equipe1 = matchIt.equipe1.nomEquipe;			
			var equipe2 = matchIt.equipe2.nomEquipe;		
			var date = matchIt.date;

			var miseUtilisateur = new Array();

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
						console.log("Mise ne conrespondant pas au match " + idMatch);
				}

				if(mise.emailUtilisateur == userEmail) {
					miseUtilisateur.push({
						"equipe": mise.equipe,
						"valeurMise": mise.valeurMise
					});
					sommeMisesUtilisateur+=mise.valeurMise;
				}

			}

			var cotes = match.calculeCote(sommeMisesEq1, sommeMisesEq2, sommeMisesNul);

			matchRes = {
				"idMatch": idMatch,
				"equipe1": equipe1,
				"equipe2": equipe2,
				"date": date,
				"cotes": cotes,
				"misesUtilisateur": miseUtilisateur
			};

			retourMatchs.push(matchRes);
		}

		var retour = {"matchs": retourMatchs, "sommeMisesUtilisateur": sommeMisesUtilisateur};
		console.log(retour);
		//result=...
		callback(null, retour)
	});
};

match.calculeCote = function(misesEq1, misesEq2, misesNul) {
	var cotes = new Array();
	cotes['equipe1'] = (misesEq1 == 0) ? "" : (misesEq2 + misesNul) / misesEq1;
	cotes['equipeNul'] = (misesNul == 0) ? "" : (misesEq1 + misesEq2) / misesNul;
	cotes['equipe2'] = (misesEq2 == 0) ? "" : (misesEq1 + misesNul) / misesEq2;

	return cotes;

};

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
			callback('{"error": ' + error + '}');
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