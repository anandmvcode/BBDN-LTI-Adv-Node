import config from "../config/config";
import axios from "axios";
import redisUtil from "../util/redisutil";

exports.getLearnRestToken = async (learnUrl, nonce) => {
  const auth_hash = new Buffer.from(`${config.appKey}:${config.appSecret}`).toString('base64');
  const auth_string = `Basic ${auth_hash}`;
  console.log(`Auth string: ${auth_string}`);
  const options = {
    headers: {
      Authorization: auth_string,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  console.log(`Getting REST bearer token at ${learnUrl}`);
  try {
    const response = await axios.post(learnUrl, 'grant_type=authorization_code', options);
    const token = response.data.access_token;
    console.log(`Got bearer token`);

    // Cache the nonce
    redisUtil.redisSave(nonce, 'nonce');

    // Cache the REST token
    redisUtil.redisSave(`${nonce}:rest`, token);
    return token;
  } catch (exception) {
    console.log(`Failed to get token with response ${JSON.stringify(exception)}`);
    return '';
  }
};

exports.getCachedToken = async (nonce) => {
  const token = await redisUtil.redisGet(`${nonce}:rest`);
  if (!token) {
    console.log(`Couldn't get token for nonce ${nonce}:rest`);
  }
  return token;
}
