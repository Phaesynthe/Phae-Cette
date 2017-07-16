/* global require */

// This is the pattern that we would like to use, but the equivalent is expressed below
// import { describe, it } from 'mocha';
// import { expect } from 'chai';

const Chai = require('chai');
const Mocha = require('mocha');

const describe = Mocha.describe;
const expect = Chai.expect;
const it = Mocha.it;

describe('Substitution', () => {

  describe('simple', () => {

    it('processes non-nested value', () => {
      const template = 'Hello {value}!';
      const context = {
        value: 'World'
      };

      expect(Cette(template, context)).to.equal('Hello World!');
    });

    it('processes nested value', () => {
      const template = 'Hello {message.value}!';
      const context = {
        message: {
          value: 'World'
        }
      };
      expect(Cette(template, context)).to.equal('Hello World!');
    });

  });

  describe('compound', () => {

    it('processes nested expressions', () => {
      const template = 'Hello { ( "to this { message.value }":1 | message.value:17 ) }!';
      const context = {
        message: {
          value: 'World'
        }
      };

      expect(Cette(template, context)).to.equal('Hello World!');
    });

  });

});
