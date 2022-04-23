import 'mocha';
import {expect} from 'chai';
import {Nota} from '../src/notas';
import {User} from '../src/notas';
import {NotasDB} from '../src/notas';

describe('Notas:', () => {
  it('Debe existir una clase para representar una nota', () => {
    expect(Nota).to.exist;
  });
  it('Debe existir una clase para representar un usuario', () => {
    expect(User).to.exist;
  });
  it('Debe existir una clase para representar una base de datos de notas', () => {
    expect(NotasDB).to.exist;
  });
});

