
import {DestinationConfig, BusinessRuleService } from '../src/index';

const destinationConfig: DestinationConfig = {
    name: 'myDestination123',
    path: ''
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
    describe('with a destination service', () => {
        describe('and a ruleServiceId provisioned directly', () => {
            test('defined', async () => {
                expect(
                    () =>
                        new BusinessRuleService({destinationConfig, ruleServiceId})
                ).toBeDefined();
            });
            test('execute RuleService', async () => {
                const busRuleService = new BusinessRuleService({destinationConfig, ruleServiceId});
                const result = await busRuleService.executeRuleService(vocabulary);
                expect(result[0].responseTasks[0]).toHaveProperty('callIFlow');
            });               
        })
        describe('without a ruleServiceId', () => {
            test('still able to create new instance', async () => {
                expect(
                    () =>
                        new BusinessRuleService({destinationConfig})
                ).toBeDefined();
            });
            test('execute RuleService without ruleServiceId not possible', async () => {
                const busRuleService = new BusinessRuleService({destinationConfig});                
                let error;
                await busRuleService.executeRuleService(vocabulary).catch((err) => {
                    error = err;
                });
                expect(error).toEqual(new Error('Provide ruleServiceId while setting up class OR calling this method'));                
            });               
        });
        describe('with a ruleServiceId and vocabulary', () => {
            test('both provided, working', async () => {
                const busRuleService = new BusinessRuleService({destinationConfig});
                const result = await busRuleService.executeRuleService(vocabulary, ruleServiceId);
                expect(result[0].responseTasks[0]).toHaveProperty('callIFlow');
            });  
            test('vocabulary empty and ruleId missing ', async () => {
                const busRuleService = new BusinessRuleService({destinationConfig});
                let error;
                await busRuleService.executeRuleService("").catch((err) => {
                    error = err;
                });
                expect(error).toEqual(new Error('Provide obligatory vocabulary to execute rule service'));                
            });                          
        })             

    });
    
});