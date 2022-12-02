const JWT = require('../utils/jwtDecoder');
const token = require('../utils/message/getAccessToken');
const send = require('../utils/message/sendMessage');
const logger = require('../utils/logger');

/**
 * The Journey Builder calls this method for display the user interface.
 * @param req
 * @param res
 * @returns Render UI
 */
exports.ui = (req, res) => {
  res.render('pages/sms', {
    title: 'Atividade Customizada',
    dropdownOptions: [
        {
            name: 'Envio de SMS',
            value: 'envioSms',
        },
    ],
  });
}

/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.execute = async (req, res) => {
  // decode data
  const data = JWT(req.body);

  logger.info('=====>');
  logger.info(data);

  let messagePhone = data.inArguments[0].phoneNumber;
      messagePhone = messagePhone.toString().substring(2);
  const messageText = data.inArguments[0].Text;

  try {
    const accessToken = await token.generateToken();
    const responseMessage = await send.sendSMS(accessToken, messagePhone, messageText).then((response) => response);
    if (responseMessage.status === 204) {
      logger.info('Created');
    } else {
      logger.error('Error');
    }
  } catch (error) {
    logger.error(error);
  }

  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user saves the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.save = async (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 *  Endpoint that receives a notification when a user publishes the journey.
 * @param req
 * @param res
 */
exports.publish = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.validate = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};
