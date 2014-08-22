var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

//WARN: This is in a really shitty place and will lead to lots of code duplication. It's also in poll.js
function ensureAuthenticated(req, res, next) {
	var priv = req.priv;
	req.priv = undefined;
	console.log('ensureAuth: '+res.locals.session.passport.user);
	if (req.isAuthenticated() && typeof res.locals.session.passport.user.rights[priv] !== 'undefined' && res.locals.session.passport.user.rights[priv]) {
		//console.log('User is already authenticated. Continuing.');
		return next();
	}
	req.session.redirect_to = req.path;
	//console.log('User is not already authenticated. Redirecting.');
	//req.session.returnTo = req.path;
	res.redirect('/login');
}

function reqAnswerRight(req, res, next) {
	req.priv = 'answer';
	return next();
}
function reqOpenCloseRight(req, res, next) {
	req.priv = 'openClose';
	return next();
}
function reqDeleteRight(req, res, next) {
	req.priv = 'delete';
	return next();
}

function batchSanitize(items) {
	for(var tr in items) {
		for(var question in items[tr].question_list) {
			for(var response in items[tr].question_list[question].type.response_list) {
				console.log('Deleted '+items[tr].question_list[question].type.response_list[response].answers);
				delete items[tr].question_list[question].type.response_list[response].answers;
				console.log('Now it\s '+ items[tr].question_list[question].type.response_list[response].answers);
			}
		}
	}
	return items;
}

/* GET poll list */
router.get('/listpolls', function(req, res){
	var db = req.db;
	// WARN: SANITIZE THESE BEFORE SENDING THEM; THEY HAVE THE ANSWERS EMBEDDED
	// STUB: Paginate
	db.collection('polldb').find().toArray(function(err, items) {
		// WARN: The else in this conditional is probably unnecessary and bad
		if(typeof res.locals !== 'undefined' && typeof res.locals.session.passport.user !== 'undefined') {
		//	console.log('LISTPOLLS:' + res.locals.session.passport.user.rights);
			res.send({auth: req.isAuthenticated(), rights: res.locals.session.passport.user.rights, polls:JSON.stringify(batchSanitize(items))});
		//} else {
		//	res.send({auth: req.isAuthenticated(), polls:JSON.stringify(items)});	
		}
	});
});

router.post('/closepoll/:id', reqOpenCloseRight, ensureAuthenticated, function(req, res) {
	var db = req.db;
	var pollToClose = req.params.id;
	db.collection('polldb').update({_id: mongo.helper.toObjectID(pollToClose)}, { $set: {open: false}}, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
	});
});

router.post('/openpoll/:id', reqOpenCloseRight, ensureAuthenticated, function(req, res) {
	var db = req.db;
	var pollToClose = req.params.id;
	db.collection('polldb').update({_id: mongo.helper.toObjectID(pollToClose)}, { $set: {open: true}}, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
	});
});

/* POST to answer poll */
// STUB: AUTHENTICATE HERE?
router.post('/answerpoll', function(req, res) {
	try {
		var db = req.db;
		var tid = req.body._id;
		delete req.body._id;
		db.collection('polldb').findOne({_id: mongo.helper.toObjectID(tid)},
			function(err, result) {
				if(err) {
					console.log(err);
				}
				for (var question in req.body.question_list) {
					for (var response in req.body.question_list[question].type.response_list) {
						if(typeof req.body.question_list[question].type.response_list[response].answers !== 'undefined'
							&& typeof req.body.question_list[question].type.response_list[response].answers[0] !== 'undefined'
							&& typeof req.body.question_list[question].type.response_list[response].answers[0].value !== 'undefined'
							&& req.body.question_list[question].type.response_list[response].answers[0].value !== null) {
							//console.log('Appended question '+question+' and response '+response+ '.');
							//console.log('Appended: '+req.body.question_list[question].type.response_list[response].answers);
							//console.log(result.question_list);
							//console.log(req.body.question_list);
							if(typeof result.question_list[question].type.response_list[response].answers === 'undefined') {
								result.question_list[question].type.response_list[response].answers = [];
							}
							result.question_list[question].type.response_list[response].answers.push(req.body.question_list[question].type.response_list[response].answers[0]);
							//console.log(result.question_list[question].type.response_list[response].answers);
						}
					}
				}
				db.collection('polldb').update( {_id: mongo.helper.toObjectID(tid)}, result, function(err, result) {
					if(err) {
						console.log(err);
					} else {
						res.send((result === 1) ? { msg: '' } : { msg:'error: '+ err});
					}
				});
					//console.log(JSON.stringify(result, null, 4));
			});

	} catch (err) {
		console.log(err);
	}
});

/*
 * DELETE poll.
 */
router.delete('/deletepoll/:id', reqDeleteRight, ensureAuthenticated, function(req, res) {
	var db = req.db;
	var userToDelete = req.params.id;
	db.collection('polldb').removeById(userToDelete, function(err, result) {
		// WARN: THESE COULD LEAK STACK TRACES
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
	});
});

module.exports = router;
