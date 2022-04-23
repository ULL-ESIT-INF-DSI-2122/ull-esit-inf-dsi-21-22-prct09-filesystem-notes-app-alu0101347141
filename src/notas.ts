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
