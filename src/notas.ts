import * as chalk from 'chalk';
import * as yargs from 'yargs';
import * as fs from 'fs';

/**
 * Clase para representar una nota
 */
export class Nota {
  private path: string;
  /**
   * Constructor de la clase Nota
   * @param {string} author
   * @param {string} title
   * @param {string} content
   * @param {string} color
   */
  constructor(private author: string, private title: string, private content: string, private color: string) {
    this.path = './notas/' + author + '/' + title;
    const dir: string = './notas/' + author;
    fs.writeFile(this.path, content, () => {
      console.log('Se ha creado la nota ' + title + ' en ' + dir);
    });
  };
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
  /**
   * Getter del contenido
   * @return {string}
   */
  getContent() {
    return this.content;
  }
  /**
   * Getter de path
   * @return {string}
   */
  getPath() {
    return this.path;
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
  constructor(private name: string) {
    const dir: string = './notas/' + name + '/';
    fs.promises.mkdir(dir, {recursive: true}).catch(console.error);
    console.log('Creado directorio ' + dir);
  };
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
   *
   * @param {string} titulo
   * @return {Nota}
   */
  getNoteByTitle(titulo: string): Nota {
    let i: number = 0;
    this.notas.forEach((n, index) => {
      if (n.getTitle() == titulo) {
        i = index;
      }
    });
    return this.notas[i];
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
    fs.unlink(this.notas[i].getPath(), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
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
const yara = new User('yara');
const nota1 = new Nota('jonay', 'notaRoja', 'ES ROJA', 'rojo');
const nota2 = new Nota('jonay', 'notaVerde', 'ES VERDE', 'verde');
jonay.addNota(nota1);
jonay.addNota(nota2);
db.addUser(jonay);
db.addUser(yara);


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
    (typeof argv.color === 'string')) {
      if (!db.getUsersNames().includes(argv.user)) {
        const usuario = new User(argv.user);
        db.addUser(usuario);
        console.log(chalk.yellow('Creado el usuario ' + argv.user));
      }

      db.getUser(argv.user).getNotes().forEach((n) => {
        if (argv.title == n.getTitle()) {
          console.log(chalk.red('¡Ya existe esta nota!'));
          error = true;
        }
      });

      if (!error) {
        const nota = new Nota(argv.user, argv.title, argv.body, argv.color);
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
      let error: boolean = false;
      if (typeof argv.user === 'string') {
        if (!db.getUsersNames().includes(argv.user)) {
          console.log(chalk.red('No existe el usuario ' + argv.user));
          error = true;
        }
        if (!error) {
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

yargs.command({
  command: 'open',
  describe: 'Muestra el contenido de una nota',
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
        const nota: Nota = db.getUser(argv.user).getNoteByTitle(argv.title);
        switch (nota.getColor()) {
          case 'rojo':
            console.log(chalk.red(nota.getTitle() + ' [de ' + argv.user + ']'));
            console.log(chalk.red('----\n' + nota.getContent()));
            break;
          case 'verde':
            console.log(chalk.green(nota.getTitle() + ' [de ' + argv.user + ']'));
            console.log(chalk.green('----\n' + nota.getContent()));
            break;
          case 'azul':
            console.log(chalk.blue(nota.getTitle() + ' [de ' + argv.user + ']'));
            console.log(chalk.blue('----\n' + nota.getContent()));
            break;
          case 'amarillo':
            console.log(chalk.yellow(nota.getTitle() + ' [de ' + argv.user + ']'));
            console.log(chalk.yellow('----\n' + nota.getContent()));
            break;
        }
      }
    }
  },
});


yargs.parse();
