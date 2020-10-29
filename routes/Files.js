const express = require('express');
const router  = express.Router();

const {createTutorial,getTutorial,getTutorials,findByTitle,deleteTutorial} = require('../controllers/File');

router.route('/')
.post(createTutorial)
.get(getTutorials);

router.route('/:id')
.get(getTutorial)
.delete(deleteTutorial);


router.route('/query')
.get(findByTitle);

module.exports = router;