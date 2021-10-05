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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direct = void 0;
const oAuth_1 = require("./oAuth");
/**
 * Direct Access
 */
class Direct {
    /**
     * @description
     * @param {DirectConfig} config interface of direct config
     */
    constructor(config) {
        if (!config) {
            throw new Error('Provide all parameters from DirectConfig');
        }
        this.config = config;
        // Add path to oAuth token provider, if not provided manual
        if (!this.config.auth.oAuthTokenUrl.match(/\/oauth\/token/gm)) {
            this.config.auth.oAuthTokenUrl = this.config.auth.oAuthTokenUrl + "/oauth/token";
        }
    }
    /**
     * getBRSUrlAndBearerToken
     * @return {Promise<AccessBRS>} Necessary properties of our BRS target
     */
    getBRSUrlAndBearerToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch bearer token from tokenProvider
            return yield (0, oAuth_1.getOAuthBearerToken)(this.config.auth).then((bearerToken) => {
                return {
                    bearerToken: bearerToken,
                    fullPath: this.config.runtimeUrl + Direct.apiPath
                };
            }).catch((err) => {
                var temp = err;
                temp.message = 'Error while bearer fetch: ' + temp.message;
                throw (temp);
            });
        });
    }
}
exports.Direct = Direct;
Direct.apiPath = '/rules-service/rest/v2';
//# sourceMappingURL=direct.js.map