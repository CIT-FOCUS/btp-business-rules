import { DestinationConfig } from './lib/destination';
import { DirectConfig } from './lib/direct';
export { DestinationConfig, DirectConfig };
/**
 * BRSConfiguration
 * @description Provide destinationConfig OR directConfig within a ruleServiceId to initialize
 * @param {DestinationConfig} destinationConfig Name and optional path of your configured and bound destination
 * @param {DirectConfig} directConfig RuntimeURL and auth-credentials from your Business Rules Service-Key
 * @param {string} ruleServiceId You can provide your target ruleServiceId already while initialization or later
 */
export interface BRSConfiguration {
    destinationConfig?: DestinationConfig;
    directConfig?: DirectConfig;
    ruleServiceId?: string;
}
/**
 * BusinesRuleService
 * @description Use this service to execute your Business Rule Service implemented Rule-Service
 */
export declare class BusinessRuleService {
    private destConfig;
    private directConfig;
    private ruleServiceId;
    constructor(config: BRSConfiguration);
    /**
     * executeRuleService
     * @description Execute your implemented Rule-Service of your BRS-Project within your configured vocabulary
     * @param {any} vocabulary The importing structure you did define within your BRS Project
     * @param {string} ruleServiceId The ID of your implemented BRS Rule-Service
     * @returns {any} your exporting structure as result object
     */
    executeRuleService(vocabulary: any, ruleServiceId?: string): Promise<any>;
    /**
     * _getBRSUrlAndBearerTokenFromDestination
     * @description fetch necessary parameters from destination-service
     * @returns {AccessBRS} BearerToken and runtime-URL
     */
    private _getBRSUrlAndBearerTokenFromDestination;
    /**
     * _getBRSUrlAndBearerTokenFromDirect
     * @description fetch necessary parameters from oAuth service
     * @returns {AccessBRS} BearerToken and runtime-URL
     */
    private _getBRSUrlAndBearerTokenFromDirect;
}
