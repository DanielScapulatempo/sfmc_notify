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
  res.render('pages/push', {
    title: 'Atividade Customizada',
    dropdownOptions: [
        {
        name: 'Envio de Push Notification',
        value: 'envioPush',
        },
    ],
    dropdownOptionsSilence: [
        {
        name: 'Sim',
        value: 'true',
        },
        {
        name: 'Não',
        value: 'false',
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

  const messageText = data.inArguments[0].Text;
  const messageAction = data.inArguments[0].Action;
  const messageSilence = (data.inArguments[0].Silence === 'true') ? true : false;
  const messageTags = data.inArguments[0].Tags;
  const appName = data.inArguments[0].AppName;

  try {
    const accessToken = await token.generateToken();
    const responseMessage = await send.sendPush(accessToken, messageText, messageAction, messageSilence, messageTags, appName).then((response) => response);
    if (responseMessage.status === 204) {
      logger.info('Created');
    } else {
      logger.error('Error');
    }
  } catch (error) {
    logger.error(error);
  }

  res.status(204).send({
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
