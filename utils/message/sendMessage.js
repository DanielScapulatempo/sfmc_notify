/* eslint-disable func-names */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable padded-blocks */
/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
const axios = require('axios').create({
  baseURL: 'https://api-supergasbras.sensedia.com',
});

const sendSMS = async (accessToken, to, message) => {
  const data = JSON.stringify({
    "destinatario": to,
    "mensagem": message,
  });

  const config = {
    method: 'post',
    url: '/hml/mensageria/v1/sms',
    headers: { 
      'Content-Type': 'application/json', 
      'client_id': process.env.SGB_CLIENT_ID, 
      'access_token': accessToken,
    },
    data: data,
  };
    
  const response = axios(config)
    .then((response) => response)
    .catch((error) => error);
  return response;
       
};

const sendPush = async (accessToken, message, action, silence, messageTags, appName) => {

  let tagsList = messageTags;
  tagsList = tagsList
    .split(",").map((item) => item.trim())
    .filter((item) => item);

  const data = JSON.stringify([
    {
      "texto": message,
      "acao": action,
      "silenciar": silence,
      "tags": tagsList,
      "appName": appName,
    },
  ]);

  const config = {
    method: 'post',
    url: '/mensageria/v1/notificacoes',
    headers: { 
      'Content-Type': 'application/json', 
      'client_id': process.env.SGB_CLIENT_ID, 
      'access_token': accessToken,
    },
    data: data,
  };
    
  const response = axios(config)
    .then((response) => response)
    .catch((error) => error);
  return response;
       
};

module.exports = {
  sendSMS,
  sendPush,
};
