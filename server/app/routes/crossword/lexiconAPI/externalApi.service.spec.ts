import { expect } from 'chai';
import { ExternalApiService } from './externalApi.service';
import { GridWordInformation } from './gridWordInformation';

const asserdt = require('assert');

it('I should complete this test', (done) => {
    asserdt.ok(true);
    done();
});

it('Query le mot hall', (queried) => {
    let apiService = new ExternalApiService;
    
    apiService.requestWordInfo('hall')
        .then( () => {
            
            queried();
    })

});