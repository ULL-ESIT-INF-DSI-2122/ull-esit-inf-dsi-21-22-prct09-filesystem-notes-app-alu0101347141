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
   * @param {string} color
   */
  constructor(private title: string, private content: string, private color: string) {};
  /**
   * Getter del titulo
   * @return {string}
   */
  getTitle() {
    return this.title;
  }
  /**
   * Getter del color
   * @return {string}
   */
  getColor() {
    return this.color;
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
   */
  constructor(private name: string) {};
  /**
   * Getter de name
   * @return {string}
   */
  getName() {
    return this.name;
  }
  /**
   * Getter de notes
   * @return {Nota[]}
   */
  getNotes() {
    return this.notas;
  }
  /**
   * Getter de titulos de las notas
   * @return {string[]}
   */
  getNotesTitles() {
    const titulos: string[] = [];
    this.notas.forEach((n) => {
      titulos.push(n.getTitle());
    });
    return titulos;
  }
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
  private usuarios: User[] = [];
  /**
   * Constructor de la clase User
   * @param {string} databaseName
   */
  constructor(private databaseName: string) {};
  /**
   * Función para añadir un usuario
   * @param {User} usuario
   */
  addUser(usuario: User) {
    this.usuarios.push(usuario);
  };
  /**
   * Función para añadir una nota a un usuario
   * @param {string} usuario
   * @param {Nota} nota
   */
  addNoteByUser(usuario: string, nota: Nota) {
    this.usuarios.forEach((u) => {
      if (u.getName() == usuario) {
        u.addNota(nota);
      }
    });
  };
  /**
   * Función para eliminar una nota de un usuario
   * @param {string} usuario
   * @param {string} titulo
   */
  removeNoteByUser(usuario: string, titulo: string) {
    this.usuarios.forEach((u) => {
      if (u.getName() == usuario) {
        u.removeNota(titulo);
      }
    });
  };
  /**
  * Getter de usuarios
  * @return {User[]}
  */
  getUsers() {
    return this.usuarios;
  };
  /**
  * Getter de los nombres de los usuarios
  * @return {string[]}
  */
  getUsersNames(): string[] {
    const nombres: string[] = [];
    this.usuarios.forEach((u) => {
      nombres.push(u.getName());
    });
    return nombres;
  };
  /**
   *
   * @param {string} nombre
   * @return {User}
   */
  getUser(nombre: string): User {
    let i: number = 0;
    this.usuarios.forEach((u, index) => {
      if (u.getName() === nombre) {
        i = index;
      }
    });
    return this.usuarios[i];
  };
}

const db = new NotasDB('BaseDeDatos');

const jonay = new User('jonay');
const nota1 = new Nota('notaRoja', 'ES ROJA', 'rojo');
const nota2 = new Nota('notaVerde', 'ES VERDE', 'verde');
jonay.addNota(nota1);
jonay.addNota(nota2);
db.addUser(jonay);


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
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    let error: boolean = false;
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string') && (typeof argv.body === 'string') &&
    (argv.color === 'string')) {
      if (!db.getUsersNames().includes(argv.user)) {
        const usuario = new User(argv.user);
        db.addUser(usuario);
      }

      db.getUser(argv.user).getNotes().forEach((n) => {
        if (argv.title == n.getTitle()) {
          console.log(chalk.red('¡Ya existe esta nota!'));
          error = true;
        }
      });

      if (!error) {
        const nota = new Nota(argv.title, argv.body, argv.color);
        db.addNoteByUser(argv.user, nota);
        console.log(chalk.green('Se ha añadido la nota [' + argv.title + '] del usuario ' + argv.user));
      }
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
    {
      if (typeof argv.user === 'string') {
        if (!db.getUsersNames().includes(argv.user)) {
          console.log(chalk.red('No existe el usuario ' + argv.user));
        }
        db.getUser(argv.user).getNotes().forEach((n) => {
          switch (n.getColor()) {
            case 'rojo':
              console.log(chalk.red(n.getTitle()));
              break;
            case 'verde':
              console.log(chalk.green(n.getTitle()));
              break;
            case 'azul':
              console.log(chalk.blue(n.getTitle()));
              break;
            case 'amarillo':
              console.log(chalk.yellow(n.getTitle()));
              break;
          }
        });
      }
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
    let error: boolean = false;
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
      if (!db.getUsersNames().includes(argv.user)) {
        console.log(chalk.red('No existe el usuario ' + argv.user));
        error = true;
      }

      if (!db.getUser(argv.user).getNotesTitles().includes(argv.title)) {
        console.log(chalk.red('No existe la nota [' + argv.title + '] del usuario ' + argv.user));
        error = true;
      }

      if (!error) {
        db.removeNoteByUser(argv.user, argv.title);
        console.log(chalk.green('Se ha eliminado la nota [' + argv.title + '] del usuario ' + argv.user));
      }
    }
  },
});

yargs.parse();
