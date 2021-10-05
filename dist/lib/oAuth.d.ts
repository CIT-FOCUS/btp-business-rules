interface OAuthConfig {
    username: string;
    password: string;
    /**
     * OAuth token url to call on retrieving token
     */
    oAuthTokenUrl: string;
}
declare function getOAuthBearerToken(config: OAuthConfig): Promise<string>;
export { getOAuthBearerToken, OAuthConfig };
