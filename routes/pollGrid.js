var express = require('express');
var router = express.Router();
var helper = require('../bin/helper');

/* GET poll as JSON */
router.get('/', function(req, res) {
	res.render('pollGrid');
});

module.exports = router;
