import 'mocha';
import {expect} from 'chai';
import {Notas} from '../src/notas';

describe('notas', () => {
  it('Debe existir una clase para el manejo de notas', () => {
    expect(Notas).to.exist;
  });
});

