import { DestinationConfig, AccessBRS, Destination } from './lib/destination';
import { DirectConfig, Direct } from './lib/direct';
import axios from 'axios';

export { DestinationConfig, DirectConfig }

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
export class BusinessRuleService {
    private destConfig: DestinationConfig;
    private directConfig: DirectConfig;
    private ruleServiceId: string;  

    constructor(config: BRSConfiguration){
        if(config.destinationConfig){
            this.destConfig = config.destinationConfig;    
        }else if(config.directConfig){
            this.directConfig = config.directConfig;
        }else{
            throw("No configuration supplied!");
        }        
        this.ruleServiceId = config.ruleServiceId || '';
    }

    /**
     * executeRuleService
     * @description Execute your implemented Rule-Service of your BRS-Project within your configured vocabulary
     * @param {any} vocabulary The importing structure you did define within your BRS Project
     * @param {string} ruleServiceId The ID of your implemented BRS Rule-Service
     * @returns {any} your exporting structure as result object
     */
    public async executeRuleService(vocabulary: any, ruleServiceId?: string): Promise<any>{
        // check necessary objects
        if(!vocabulary){
            throw new Error('Provide obligatory vocabulary to execute rule service');
        }
        if(!ruleServiceId && !this.ruleServiceId){
            throw new Error('Provide ruleServiceId while setting up class OR calling this method');
        }

        // method-provided-ruleServiceId is winning
        var ruleID = this.ruleServiceId;
        if(ruleServiceId){
            ruleID = ruleServiceId;
        }

        try {
            var accessBRS: AccessBRS;
            if(this.destConfig){
                accessBRS = await this._getBRSUrlAndBearerTokenFromDestination();
            }else{
                accessBRS = await this._getBRSUrlAndBearerTokenFromDirect();
            }
            const urlWithHandler = accessBRS.fullPath + '/workingset-rule-services';

            // we have all what we need, so let's do the request
            return await axios({
                method: 'POST',
                url: urlWithHandler,                
                headers: {
                    Authorization: accessBRS.bearerToken
                },
                data: {
                    "RuleServiceId": ruleID,
                    "Vocabulary": vocabulary
                }
            }).then((resp) => {    
                return Promise.resolve(resp.data.Result);
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * _getBRSUrlAndBearerTokenFromDestination
     * @description fetch necessary parameters from destination-service
     * @returns {AccessBRS} BearerToken and runtime-URL
     */
    private async _getBRSUrlAndBearerTokenFromDestination(): Promise<AccessBRS> {        
        const destService = new Destination(this.destConfig);
        return await destService.getBRSUrlAndBearerToken();
    }
    
    /**
     * _getBRSUrlAndBearerTokenFromDirect
     * @description fetch necessary parameters from oAuth service
     * @returns {AccessBRS} BearerToken and runtime-URL
     */
    private async _getBRSUrlAndBearerTokenFromDirect(): Promise<AccessBRS> {        
        const directService = new Direct(this.directConfig);
        return await directService.getBRSUrlAndBearerToken();
    }  
}