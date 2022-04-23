import 'mocha';
import {expect} from 'chai';
import {ejercicio} from '../src/ejercicio';

describe('ejercicio', () => {
  it('Ejercicio debe ser una clase de ejemplo', () => {
    expect(ejercicio).to.exist;
  });
});

