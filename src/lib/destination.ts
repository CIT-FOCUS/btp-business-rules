import axios from 'axios';
import xsenv from '@sap/xsenv';
import { getOAuthBearerToken, OAuthConfig } from './oAuth';

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
export class Destination {
    private static readonly DESTINATION_READ_PATH = '/destination-configuration/v1/destinations/';
    private static readonly HTTP_CLIENT_TIMEOUT = 5000;

    private destinationServiceBearerToken: string;
    private destinationServiceUrl: string;
    private destinationName: string;
    private destinationPath?: string;
    public destinationFullUrl: string;

    /**
     * @description
     * @param {DestinationConfig} config interface of destination config
     */
    constructor(config: DestinationConfig) {
        if (!config) {
            throw new Error('Provide destination name and the target-path to your BRS API');
        }
        
        this.destinationServiceBearerToken = '';
        this.destinationServiceUrl = '';
        this.destinationName = config.name;
        this.destinationPath = config.path || '';
        this.destinationFullUrl = '';
        
    }
    /**
     * getBRSUrlAndBearerToken
     * @return {Promise<DestinationBRS>} Necessary properties of our BRS destination
     */
    public async getBRSUrlAndBearerToken(): Promise<AccessBRS> {
        // Get destination-service access via environment
        this.destinationServiceBearerToken =
            await this._getDestinationServiceFromEnvironment().catch((err) => {
                var errTemp = err;
                errTemp.message = 'Error while destination-service fetch: ' + errTemp.message;
                throw errTemp;
            });

        // Get the details of the destination we're searching for
        return await this._getDestination();
    }

    /**
     * _getDestinationServiceFromEnvironment
     * @return {Promise<string>} bearer token for the destination-service only
     */
    private async _getDestinationServiceFromEnvironment(): Promise<string> {
        // if this is running localy on a device, we can use .env data supplied
        // to simulate the environment around us.
        xsenv.loadEnv();
        const dest = xsenv.getServices({
            dest: {
                tag: 'destination'
            }
        }).dest;

        this.destinationServiceUrl =
            dest.uri + Destination.DESTINATION_READ_PATH + this.destinationName;

        // prepare oAuthToken fetch
        const destOAuthConfig: OAuthConfig = {
            oAuthTokenUrl: dest.url + '/oauth/token',
            password: dest.clientsecret,
            username: dest.clientid
        };
        // request oAuthToken for destination-service
        return await getOAuthBearerToken(destOAuthConfig);
    }

    /**
     * _getDestination
     * @return {Promise<DestinationBRS>} Necessary properties of our BRS destination
     */
    private async _getDestination(): Promise<AccessBRS> {
        return await axios({
            method: 'get',
            url: this.destinationServiceUrl,
            timeout: Destination.HTTP_CLIENT_TIMEOUT,
            headers: {
                Authorization: this.destinationServiceBearerToken
            }
        }).then((resp) => {    
            const destBRS: AccessBRS = {
                bearerToken: `Bearer ${resp.data.authTokens[0].value}`,                
                fullPath: resp.data.destinationConfiguration.URL + this.destinationPath
            };
            return destBRS;
        });
    }


}
