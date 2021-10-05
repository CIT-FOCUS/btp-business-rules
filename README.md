# NodeJs Client for SAP Business Rule Service on SAP BTP
>*Promise based node.js client library to support the usage of Business Rule Service within a CF destination-service or direct access*

## About
The Business Rule Service (BRS) is part of SAPs portfolio with utility services running on Business Technology Platform (BTP). 
It is based on some kind of BRF+ framework to support easy controlling and customizing with easy UI5 configurable tables.
You can deploy business rules to S/4 HANA or on BTP and use the REST API published by the service.
This node.js module is enabling you to easy use the REST API and make calls to it with your request vocabulary and rule-service-ID.


### Library Features

* Use destination service to access BRS
* Use username (clientId) and userpassword (clientSecret) to access BRS
* Execute BRS-Calls and retrieve the result

### Installation

```bash
$ npm i @cit-focus/btp-business-rules
```

## Getting Started

Here is a very simple example on how to import and create your first Business Rules Service client within a configured destination (bound to the container):

```js
import { DestinationConfig, BusinessRuleService } from '@cit-focus/btp-business-rules';

const destinationConfig: DestinationConfig = {
    name: 'myDestination123'
};
const ruleServiceId: string = 'd1ffc4403f634cf4b1a79f6e2718b123';
var vocabulary: any = [
    {
        "importingStructure": {
          "bo": "engagement",
          "boCompCode": "DE01",
          "boKey": ""
        }
    }
];
const busRuleService = new BusinessRuleService({destinationConfig, ruleServiceId});
const result = await busRuleService.executeRuleService(vocabulary);
```

### Using a destination service

Example on how to execute BRS requests via BusinessRuleService client using an existing destination on your destination-service.  
You need to maintain the name of the destination, and optional an additional path. The full-path is concatenated following this logic: <url_from_destination><path>/workingset-rule-services .

```js
const configDest: DestinationConfig = {
    name: 'myDestination123',
    path: 'myAdditionalPath'
};
```

### Provide Credentials instead of using a configured destination
Sometimes it's easier or necessary to get rid of a destination. This is the way to do it without a configured destination:
```js
import { DirectConfig, BusinessRuleService } from '@cit-focus/btp-business-rules';

const directConfig: DirectConfig = {
    runtimeUrl: 'https://bpmruleruntime.cfapps.eu10.hana.ondemand.com',
    auth: {
        oAuthTokenUrl: 'https://<yourInstance>.authentication.eu10.hana.ondemand.com',
        username: 'sb-clone-123456789abcdefgh|bpmrulebroker!b23456',
        password: '350c19e-my-client-secretQy0V7Hnoiaeo='
    }
};
const ruleServiceId: string = 'd1ffc4403f634cf4b1a79f6e2718b123';
var vocabulary: any = [
    {
        "importingStructure": {
          "bo": "engagement",
          "boCompCode": "DE01",
          "boKey": ""
        }
      }
];
const busRuleService = new BusinessRuleService({directConfig, ruleServiceId});
const result = await busRuleService.executeRuleService(vocabulary);
```

### Motivation
Continious Learning is more required then ever for all around the BTP. This library is filling a gap of SAPs pre-provided libraries portfolio and is based on [Alert Notification Service Client by SAP](https://github.com/SAP/alert-notification-node-client). Beside the missing gap we identified and we had to fill for projects, we wanted to deep-dive into node.js, typescript and SAP's great mission around the BTP and BTP-Services. It was fun setting it up and improve it every time we had to reuse it. Now it's time to share and give-back to this great SAP Community!

### Have an issue? / Contribute?
Please, let us know by filing a new Issue on github or start contributing. We really appreciate any suggestions or updates.

### License
This project is run under the licensing terms of Apache License 2.0.