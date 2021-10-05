/**
 * DestinationConfig
 * @description You can maintain your specific path here, if required. Otherwise leave blank.
 * The path can be used e.g. when using API-Management (APIM) and pointing to an ANS via APIM.
 * @param {string} name The name of the destionation you need to maintain
 * @param {string} path Use this to extend the destination url before pointing to the fixed part. The endpoint will be concatenated in this way: <url_in_destination><path>/producer/..
 */
export interface DestinationConfig {
    name: string;
    path?: string;
}
/**
 * AccessBRS
 * @description interface for response from destination
 * @param {string} fullPath concatenated URL with <destination_url><path>
 * @param {string} bearerToken the Bearer token, fetched and saved by the destination service
 */
export interface AccessBRS {
    fullPath: string;
    bearerToken: string;
}
/**
 * Destination
 */
export declare class Destination {
    private static readonly DESTINATION_READ_PATH;
    private static readonly HTTP_CLIENT_TIMEOUT;
    private destinationServiceBearerToken;
    private destinationServiceUrl;
    private destinationName;
    private destinationPath?;
    destinationFullUrl: string;
    /**
     * @description
     * @param {DestinationConfig} config interface of destination config
     */
    constructor(config: DestinationConfig);
    /**
     * getBRSUrlAndBearerToken
     * @return {Promise<DestinationBRS>} Necessary properties of our BRS destination
     */
    getBRSUrlAndBearerToken(): Promise<AccessBRS>;
    /**
     * _getDestinationServiceFromEnvironment
     * @return {Promise<string>} bearer token for the destination-service only
     */
    private _getDestinationServiceFromEnvironment;
    /**
     * _getDestination
     * @return {Promise<DestinationBRS>} Necessary properties of our BRS destination
     */
    private _getDestination;
}
