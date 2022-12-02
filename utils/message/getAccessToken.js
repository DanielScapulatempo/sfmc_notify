const NodeCache = require('node-cache');

const tokenCache = new NodeCache({
  checkperiod: 80000,
  useClones: false,
});

const axios = require('axios').create({
  baseURL: 'https://api-supergasbras.sensedia.com',
});

let firstToken = true;
let refreshToken = null;

const getGrantCode = async () => {
  const data = JSON.stringify({
    "client_id": process.env.SGB_CLIENT_ID,
    "redirect_uri": "https://www.supergasbras.com.br",
  });

  const config = {
    method: 'post',
    url: '/oauth/grant-code',
    headers: { 
      'Content-Type': 'application/json',
    },
    data: data,
  };
  
  const response = axios(config)
    .then((response) => {
      const currentUrl = new URL(response.data.redirect_uri);
      const searchParams = currentUrl.searchParams;
      return searchParams.get('code');
    })
    .catch((error) => error);

  return response;

};
const getAccessToken = async (grantCode) => {
  const data = JSON.stringify({
    "grant_type": "authorization_code",
    "code": grantCode,
  });
  
  const config = {
    method: 'post',
    url: '/oauth/access-token',
    headers: { 
      'Authorization': 'Basic ' + Buffer.from(process.env.SGB_CLIENT_ID + ":" + process.env.SGB_CLIENT_SECRET).toString('base64'), 
      'Content-Type': 'application/json',
    },
    data: data,
  };
  
  const response = axios(config)
    .then((response) => JSON.stringify(response.data))
    .catch((error) => error);

  return response;
};
const getRefreshToken = async (_refreshToken) => {
  const data = JSON.stringify({
    "grant_type": "refresh_token",
    "refresh_token": _refreshToken,
  });
  
  const config = {
    method: 'post',
    url: '/oauth/access-token',
    headers: { 
      'Authorization': 'Basic ' + Buffer.from(process.env.SGB_CLIENT_ID + ":" + process.env.SGB_CLIENT_SECRET).toString('base64'), 
      'Content-Type': 'application/json',
    },
    data: data,
  };
  
  const response = axios(config)
    .then((response) => JSON.stringify(response.data))
    .catch((error) => error);

  return response;
};

tokenCache.on("expired", async function (key, value) {
  const expiredToken = await JSON.parse(value);
  await getRefreshToken(expiredToken.refresh_token).then((result) => {
    const tokenObj = JSON.parse(result);
    refreshToken = tokenObj.refresh_token;
    tokenCache.set(key, result, tokenObj.expires_in);
  });
});

const generateToken = async () => {
  
  /**
   * Verify and return cache
   */
  if (tokenCache.has('tokenSFMC')) {
    console.log("cache");
    const tokenObj = JSON.parse(tokenCache.get("tokenSFMC"));
    return tokenObj.access_token;
  }
  
  /**
   * Generate token and cache
   */
  if (!tokenCache.has('tokenSFMC')) {
    let responseToken = null;

    if (firstToken) {
      console.log("init - first");
      const grantCode = await getGrantCode();
      responseToken = await getAccessToken(grantCode).then((result) => {
        const tokenResult = JSON.parse(result);
        tokenCache.set("tokenSFMC", result, tokenResult.refresh_token);
        return result;
      });
      firstToken = false;
      
    } else {
      console.log("init - second");
      responseToken = await getRefreshToken(refreshToken).then((result) => {
        const tokenResult = JSON.parse(result);
        tokenCache.set("tokenSFMC", result, tokenResult.refresh_token);
        return result;
      });
    }

    const tokenObj = JSON.parse(responseToken);
    refreshToken = tokenObj.refresh_token;
    return tokenObj.access_token;
  }

  return true;
};

module.exports = {
  generateToken,
};
