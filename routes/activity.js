const express = require('express')
const router = express.Router();
const activitySms = require('../activity/sms');
const activityPush = require('../activity/push');

/**
 * SMS routes
 */
router.get("/sms", activitySms.ui);
router.post('/sms/journey/execute', activitySms.execute);
router.post('/sms/journey/save', activitySms.save);
router.post('/sms/journey/publish', activitySms.publish);
router.post('/sms/journey/validate', activitySms.validate);

/**
 * Push routes
 */
router.get("/push", activityPush.ui);
router.post('/push/journey/execute/', activityPush.execute);
router.post('/push/journey/save/', activityPush.save);
router.post('/push/journey/publish/', activityPush.publish);
router.post('/push/journey/validate/', activityPush.validate);

module.exports = router;