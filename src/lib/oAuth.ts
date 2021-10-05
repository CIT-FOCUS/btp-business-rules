import axios from 'axios';
const HTTP_CLIENT_TIMEOUT = 5000;
const ACCESS_TOKEN_KEY = 'access_token';

interface OAuthConfig {
    username: string;
    password: string;
    /**
     * OAuth token url to call on retrieving token
     */
    oAuthTokenUrl: string;
}

async function getOAuthBearerToken(config: OAuthConfig): Promise<string>{
    if (!config) {
        throw new Error('OAuth configuration must be provided');
    }

    if (!config.username && !config.password) {
        throw new Error('Credentials must be provided');
    }

    if (!config.oAuthTokenUrl) {
        throw new Error('OAuthTokenUrl is missing.');
    }

    const destAuthConfig = {
        auth: {
            username: config.username,
            password: config.password
        },
        baseURL: config.oAuthTokenUrl,
        timeout: HTTP_CLIENT_TIMEOUT,
        params: {
            grant_type: 'client_credentials'
        },
        retryConfig: {
            maxRetries: 3,
            retryBackoff: 1000
        }
    };
    // Use destination service provided data to fetch bearer
    return await axios(destAuthConfig).then((resp) => {
        let bearer_token = resp.data[ACCESS_TOKEN_KEY];
        return Promise.resolve(`Bearer ${bearer_token}`);
    }).catch((error) => {
        throw Promise.reject(error);
    });        
}

export{
    getOAuthBearerToken, OAuthConfig
}