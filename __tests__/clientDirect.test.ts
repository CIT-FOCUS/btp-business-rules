
import { DirectConfig, BusinessRuleService } from '../src/index';

const directConfig: DirectConfig = {
    runtimeUrl: 'https://bpmruleruntime.cfapps.eu10.hana.ondemand.com',
    auth: {
        oAuthTokenUrl: 'https://<yourInstance>.authentication.eu10.hana.ondemand.com',
        username: 'sb-clone-123456789abcdefgh|bpmrulebroker!b23456',
        password: '350c19e-my-client-secretQy0V7Hnoiaeo='
    }
};
var ruleServiceId = 'd1ffc4403f634cf4b1a79f6e2718b123';
var vocabulary: any = [
    {
        "importingStructure": {
          "bo": "engagement",
          "boCompCode": "DE01",
          "boKey": ""
        }
      }
];

jest.setTimeout(3 * 60 * 1000);

describe('call BRS', () => {
    describe('with a direct service', () => {
        describe('and a ruleServiceId provisioned directly', () => {
            test('defined', async () => {
                expect(
                    () =>
                        new BusinessRuleService({directConfig, ruleServiceId})
                ).toBeDefined();
            });
            test('execute RuleService', async () => {
                const busRuleService = new BusinessRuleService({directConfig, ruleServiceId});
                const result = await busRuleService.executeRuleService(vocabulary);
                expect(result[0].exportingTable[0]).toHaveProperty('oDataKey');
            });               
        })
        describe('without a ruleServiceId', () => {
            test('still able to create new instance', async () => {
                expect(
                    () =>
                        new BusinessRuleService({directConfig})
                ).toBeDefined();
            });
            test('execute RuleService without ruleServiceId not possible', async () => {
                const busRuleService = new BusinessRuleService({directConfig});                
                let error;
                await busRuleService.executeRuleService(vocabulary).catch((err) => {
                    error = err;
                });
                expect(error).toEqual(new Error('Provide ruleServiceId while setting up class OR calling this method'));                
            });               
        });
        describe('with a ruleServiceId and vocabulary', () => {
            test('both provided, working', async () => {
                const busRuleService = new BusinessRuleService({directConfig});
                const result = await busRuleService.executeRuleService(vocabulary, ruleServiceId);
                expect(result[0].exportingTable[0]).toHaveProperty('oDataKey');
            });  
            test('vocabulary empty and ruleId missing ', async () => {
                const busRuleService = new BusinessRuleService({directConfig});
                let error;
                await busRuleService.executeRuleService("").catch((err) => {
                    error = err;
                });
                expect(error).toEqual(new Error('Provide obligatory vocabulary to execute rule service'));                
            });                          
        })             

    });
    
});