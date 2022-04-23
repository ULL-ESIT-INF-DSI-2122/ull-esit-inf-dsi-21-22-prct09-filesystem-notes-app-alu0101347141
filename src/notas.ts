import * as chalk from 'chalk';
import * as yargs from 'yargs';

/**
 * Clase para representar una nota
 */
export class Nota {
  /**
   * Constructor de la clase Nota
   * @param {string} title
   * @param {string} content
   */
  constructor(private title: string, private content: string) {};
  /**
   * Getter del titulo
   * @return {string}
   */
  getTitle() {
    return this.title;
  }
}

/**
 * Clase para representar un usuario
 */
export class User {
  private notas: Nota[] = [];
  /**
   * Constructor de la clase User
   * @param {string} name
   * @param {Nota} notas
   */
  constructor(private name: string) {};
  /**
   * Función para añadir una nota
   * @param {Nota} nota
   */
  addNota(nota: Nota) {
    this.notas.push(nota);
  };
  /**
   * Función para borrar una nota
   * @param {string} titulo
   */
  removeNota(titulo: string) {
    let i: number = 0;
    this.notas.forEach((n, index) => {
      if (n.getTitle() == titulo) {
        i = index;
      }
    });
    this.notas.splice(i, 0);
  };
}

/**
 * Clase para representar una base de datos
 */
export class NotasDB {

}

yargs.command({
  command: 'add',
  describe: 'Añade una nueva nota',
  builder: {
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Autor de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Contenido de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.title === 'string') && (typeof argv.title === 'string')) {
      console.log(chalk.green('Añadida nota: ' + argv.title + ' ~ de ' + argv.user));
    }
  },
});

yargs.command({
  command: 'list',
  describe: 'Muestra las notas de un usuario',
  builder: {
    user: {
      describe: 'Autor de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      console.log(chalk.blue.inverse('Notas de: ' + argv.user));
      console.log(chalk.blue('Nota 1'));
      console.log(chalk.blue('Nota 2'));
    }
  },
});

yargs.command({
  command: 'remove',
  describe: 'Elimina una nota',
  builder: {
    user: {
      describe: 'Autor de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.title === 'string') && (typeof argv.title === 'string')) {
      console.log(chalk.blue('Eliminada nota: ' + argv.title));
    }
  },
});

yargs.parse();
