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
exports.BusinessRuleService = void 0;
const destination_1 = require("./lib/destination");
const direct_1 = require("./lib/direct");
const axios_1 = __importDefault(require("axios"));
/**
 * BusinesRuleService
 * @description Use this service to execute your Business Rule Service implemented Rule-Service
 */
class BusinessRuleService {
    constructor(config) {
        if (config.destinationConfig) {
            this.destConfig = config.destinationConfig;
        }
        else if (config.directConfig) {
            this.directConfig = config.directConfig;
        }
        else {
            throw ("No configuration supplied!");
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
    executeRuleService(vocabulary, ruleServiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            // check necessary objects
            if (!vocabulary) {
                throw new Error('Provide obligatory vocabulary to execute rule service');
            }
            if (!ruleServiceId && !this.ruleServiceId) {
                throw new Error('Provide ruleServiceId while setting up class OR calling this method');
            }
            // method-provided-ruleServiceId is winning
            var ruleID = this.ruleServiceId;
            if (ruleServiceId) {
                ruleID = ruleServiceId;
            }
            try {
                var accessBRS;
                if (this.destConfig) {
                    accessBRS = yield this._getBRSUrlAndBearerTokenFromDestination();
                }
                else {
                    accessBRS = yield this._getBRSUrlAndBearerTokenFromDirect();
                }
                const urlWithHandler = accessBRS.fullPath + '/workingset-rule-services';
                // we have all what we need, so let's do the request
                return yield (0, axios_1.default)({
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
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    /**
     * _getBRSUrlAndBearerTokenFromDestination
     * @description fetch necessary parameters from destination-service
     * @returns {AccessBRS} BearerToken and runtime-URL
     */
    _getBRSUrlAndBearerTokenFromDestination() {
        return __awaiter(this, void 0, void 0, function* () {
            const destService = new destination_1.Destination(this.destConfig);
            return yield destService.getBRSUrlAndBearerToken();
        });
    }
    /**
     * _getBRSUrlAndBearerTokenFromDirect
     * @description fetch necessary parameters from oAuth service
     * @returns {AccessBRS} BearerToken and runtime-URL
     */
    _getBRSUrlAndBearerTokenFromDirect() {
        return __awaiter(this, void 0, void 0, function* () {
            const directService = new direct_1.Direct(this.directConfig);
            return yield directService.getBRSUrlAndBearerToken();
        });
    }
}
exports.BusinessRuleService = BusinessRuleService;
//# sourceMappingURL=index.js.map