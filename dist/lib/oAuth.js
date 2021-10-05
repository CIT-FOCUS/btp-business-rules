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
exports.getOAuthBearerToken = void 0;
const axios_1 = __importDefault(require("axios"));
const HTTP_CLIENT_TIMEOUT = 5000;
const ACCESS_TOKEN_KEY = 'access_token';
function getOAuthBearerToken(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config) {
            throw new Error('OAuth configuration must be provided');
        }
        if (!config.username && !config.password) {
            throw new Error('Credentials must be provided');
        }
        if (!config.oAuthTokenUrl) {
            throw new Error('OAuthTokenUrl is missing.');
        }
        const destAuthConfig = {
            auth: {
                username: config.username,
                password: config.password
            },
            baseURL: config.oAuthTokenUrl,
            timeout: HTTP_CLIENT_TIMEOUT,
            params: {
                grant_type: 'client_credentials'
            },
            retryConfig: {
                maxRetries: 3,
                retryBackoff: 1000
            }
        };
        // Use destination service provided data to fetch bearer
        return yield (0, axios_1.default)(destAuthConfig).then((resp) => {
            let bearer_token = resp.data[ACCESS_TOKEN_KEY];
            return Promise.resolve(`Bearer ${bearer_token}`);
        }).catch((error) => {
            throw Promise.reject(error);
        });
    });
}
exports.getOAuthBearerToken = getOAuthBearerToken;
//# sourceMappingURL=oAuth.js.map