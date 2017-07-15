/* global require */

// This is the pattern that we would like to use, but the equivalent is expressed below
// import { describe, it } from 'mocha';
// import { expect } from 'chai';

const Chai = require('chai');
const Mocha = require('mocha');

const describe = Mocha.describe;
const expect = Chai.expect;
const it = Mocha.it;

describe('Cette', () => {
  it('is a function', () => {
    expect(typeof Cette).to.equal('function');
  })
});
