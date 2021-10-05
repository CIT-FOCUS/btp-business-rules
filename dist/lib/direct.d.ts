import { OAuthConfig } from './oAuth';
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
export declare class Direct {
    private config;
    private static readonly apiPath;
    /**
     * @description
     * @param {DirectConfig} config interface of direct config
     */
    constructor(config: DirectConfig);
    /**
     * getBRSUrlAndBearerToken
     * @return {Promise<AccessBRS>} Necessary properties of our BRS target
     */
    getBRSUrlAndBearerToken(): Promise<AccessBRS>;
}
