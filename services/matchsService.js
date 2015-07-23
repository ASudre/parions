// Module dependencies.
// load up the user model
var Match = require('../app/models/match'),
    match = {};


// ALL
match.getMatchList = function (callback) {
	Match.find({}).sort( { date: 1 } ).exec(function(err, result) {
		console.log(result);
		//result=...
		callback(null, result)
	});
};

match.saveMatch = function (userEmail, idMatch, equipe, mise, callback) {

	Match.find({ 
			idMatch: idMatch, "mises.emailUtilisateur": userEmail
		}).exec(function(err, resultQuery) {
			var error = false;
			var result = "";

			if(resultQuery.length == 0) {
				result = match.insertBet(userEmail, idMatch, equipe, mise);
			}
			else if (resultQuery.length == 1) {
				result = match.updateBet(userEmail, idMatch, equipe, mise);
			}
			else {
				error = true;
			}
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