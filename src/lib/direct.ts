import { getOAuthBearerToken, OAuthConfig } from './oAuth';

export interface DirectConfig {
    runtimeUrl: string;
    auth: OAuthConfig;
}

/**
 * AccessBRS
 * @description Necessary parameters to access BRS
 * @param {string} fullPath concatenated URL
 * @param {string} bearerToken the Bearer token, fetched and saved by the token provider
 */
export interface AccessBRS {
    fullPath: string;
    bearerToken: string;
}

/**
 * Direct Access
 */
export class Direct {
    private config: DirectConfig;
    private static readonly apiPath: string = '/rules-service/rest/v2';

    /**
     * @description
     * @param {DirectConfig} config interface of direct config
     */
    constructor(config: DirectConfig) {
        if (!config) {
            throw new Error('Provide all parameters from DirectConfig');
        }
        this.config = config;
        
        // Add path to oAuth token provider, if not provided manual
        if(!this.config.auth.oAuthTokenUrl.match(/\/oauth\/token/gm)){
            this.config.auth.oAuthTokenUrl = this.config.auth.oAuthTokenUrl + "/oauth/token";
        }
    }

    /**
     * getBRSUrlAndBearerToken
     * @return {Promise<AccessBRS>} Necessary properties of our BRS target
     */
    public async getBRSUrlAndBearerToken(): Promise<AccessBRS> {
        // Fetch bearer token from tokenProvider
        return await getOAuthBearerToken(this.config.auth).then((bearerToken) => {
            return {
                bearerToken: bearerToken,
                fullPath: this.config.runtimeUrl + Direct.apiPath
            }
        }).catch((err) => {
            var temp = err;
            temp.message = 'Error while bearer fetch: ' + temp.message;
            throw(temp);
        });
    }
}