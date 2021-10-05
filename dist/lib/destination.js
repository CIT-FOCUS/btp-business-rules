"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Destination = void 0;
const axios_1 = __importDefault(require("axios"));
const xsenv_1 = __importDefault(require("@sap/xsenv"));
const oAuth_1 = require("./oAuth");
/**
 * Destination
 */
class Destination {
    /**
     * @description
     * @param {DestinationConfig} config interface of destination config
     */
    constructor(config) {
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
    getBRSUrlAndBearerToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get destination-service access via environment
            this.destinationServiceBearerToken =
                yield this._getDestinationServiceFromEnvironment().catch((err) => {
                    var errTemp = err;
                    errTemp.message = 'Error while destination-service fetch: ' + errTemp.message;
                    throw errTemp;
                });
            // Get the details of the destination we're searching for
            return yield this._getDestination();
        });
    }
    /**
     * _getDestinationServiceFromEnvironment
     * @return {Promise<string>} bearer token for the destination-service only
     */
    _getDestinationServiceFromEnvironment() {
        return __awaiter(this, void 0, void 0, function* () {
            // if this is running localy on a device, we can use .env data supplied
            // to simulate the environment around us.
            xsenv_1.default.loadEnv();
            const dest = xsenv_1.default.getServices({
                dest: {
                    tag: 'destination'
                }
            }).dest;
            this.destinationServiceUrl =
                dest.uri + Destination.DESTINATION_READ_PATH + this.destinationName;
            // prepare oAuthToken fetch
            const destOAuthConfig = {
                oAuthTokenUrl: dest.url + '/oauth/token',
                password: dest.clientsecret,
                username: dest.clientid
            };
            // request oAuthToken for destination-service
            return yield (0, oAuth_1.getOAuthBearerToken)(destOAuthConfig);
        });
    }
    /**
     * _getDestination
     * @return {Promise<DestinationBRS>} Necessary properties of our BRS destination
     */
    _getDestination() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, axios_1.default)({
                method: 'get',
                url: this.destinationServiceUrl,
                timeout: Destination.HTTP_CLIENT_TIMEOUT,
                headers: {
                    Authorization: this.destinationServiceBearerToken
                }
            }).then((resp) => {
                const destBRS = {
                    bearerToken: `Bearer ${resp.data.authTokens[0].value}`,
                    fullPath: resp.data.destinationConfiguration.URL + this.destinationPath
                };
                return destBRS;
            });
        });
    }
}
exports.Destination = Destination;
Destination.DESTINATION_READ_PATH = '/destination-configuration/v1/destinations/';
Destination.HTTP_CLIENT_TIMEOUT = 5000;
//# sourceMappingURL=destination.js.map