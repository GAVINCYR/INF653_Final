const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyURL = require('../../middleware/verifyURL');

router.route('/')
    .get(statesController.getAllStateData);

router.route('/:state')
    .get(statesController.getState);

router.route('/:state/capital')
    .get(verifyURL, statesController.getCapital);

router.route('/:state/nickname')
    .get(verifyURL, statesController.getNickname);

router.route('/:state/population')
    .get(verifyURL, statesController.getPopulation);

router.route('/:state/admission')
    .get(verifyURL, statesController.getAdmission);

router.route('/:state/funfact')
    .get(verifyURL, statesController.getRandomFunFact)
    .post(verifyURL, statesController.createNewFunFact)
    .patch(verifyURL, statesController.replaceFunFact)
    .delete(verifyURL, statesController.deleteFunFact);
    
module.exports = router;