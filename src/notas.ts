import * as chalk from 'chalk';
import * as yargs from 'yargs';
import * as fs from 'fs';
import {string} from 'yargs';
import {json} from 'stream/consumers';

/**
 * Clase para representar una nota
 */
export class Nota {
  /**
   * Constructor de la clase Nota
   * @param {string} author
   * @param {string} title
   * @param {string} content
   * @param {string} color
   */
  constructor(private author: string, private title: string, private content: string, private color: string) {
  };
  /**
   * Getter del autor
   * @return {string}
   */
  getAuthor() {
    return this.author;
  }
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
  constructor(private databaseName: string) {
  };
  /**
   * Función para añadir un usuario
   * @param {User} usuario
   */
  addUser(usuario: User) {
    this.usuarios.push(usuario);
    const dir: string = './notas/' + usuario.getName() + '/';
    fs.mkdir(dir, {recursive: true}, (err) => {
      if (err) {
        return console.error(err);
      }
    });
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
    const path = './notas/' + nota.getAuthor() + '/' + nota.getTitle();
    const dir: string = './notas/' + nota.getAuthor();
    fs.mkdir(dir, {recursive: true}, (err) => {
      if (err) {
        return console.error(err);
      }
      fs.writeFile(path, nota.getContent(), {flag: 'w+'}, () => {
        console.log('Se ha creado la nota ' + nota.getTitle() + ' en ' + dir);
      });
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
    const path = './notas/' + usuario + '/' + titulo;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
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
      console.log(u.getName());
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
      const user: string = argv.user;
      const title: string = argv.title;
      const body: string = argv.body;
      const color: string = argv.color;

      const dir: string = './notas/' + argv.user;
      const notasUsuario: string[] = [];
      fs.readdir(dir, (err, notas) => {
        if (err) {
        } else {
          notas.forEach((nota) => {
            notasUsuario.push(nota);
          });
        };
        if (notasUsuario.includes(title)) {
          console.log(chalk.red('¡Ya existe esta nota!'));
          error = true;
        }
        if (!error) {
          const path = './notas/' + argv.user + '/' + argv.title;
          const dir: string = './notas/' + argv.user;
          fs.mkdir(dir, {recursive: true}, (err) => {
            if (err) {
            }
            const json: string = JSON.stringify({title: title, user: user, body: body, color: color});
            fs.writeFile(path, json, {flag: 'w+'}, () => {
              console.log('Se ha creado la nota ' + argv.title + ' en ' + dir);
            });
          });
          console.log(chalk.green('Se ha añadido la nota [' + argv.title + '] del usuario ' + argv.user));
        }
      });
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
        const user: string = argv.user;
        const dir: string = './notas/';
        const listaUsuarios: string[] = [];
        fs.readdir(dir, (err, usuarios) => {
          if (err) {
          } else {
            usuarios.forEach((usuario) => {
              listaUsuarios.push(usuario);
            });
          };
          if (!listaUsuarios.includes(user)) {
            console.log(chalk.red('No existe el usuario ' + argv.user));
          } else {
            const dirUser: string = './notas/' + argv.user;
            fs.readdir(dirUser, (err, notas) => {
              if (err) {
              } else {
                notas.forEach((nota) => {
                  let contenido: string = '';
                  const pathNota: string = dirUser + '/' + nota;
                  fs.readFile(pathNota, (err, data) => {
                    if (err) {
                      console.log('ERROR');
                    } else {
                      contenido = data.toString();
                      const json = JSON.parse(contenido);
                      switch (json.color) {
                        case 'rojo':
                          console.log(chalk.red(nota));
                          break;
                        case 'verde':
                          console.log(chalk.green(nota));
                          break;
                        case 'azul':
                          console.log(chalk.blue(nota));
                          break;
                        case 'amarillo':
                          console.log(chalk.yellow(nota));
                          break;
                      }
                    }
                  });
                });
              };
            });
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
    {
      if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
        const user: string = argv.user;
        const title: string = argv.title;
        const dir: string = './notas/';
        const listaUsuarios: string[] = [];
        fs.readdir(dir, (err, usuarios) => {
          if (err) {
          } else {
            usuarios.forEach((usuario) => {
              listaUsuarios.push(usuario);
            });
          };
          if (!listaUsuarios.includes(user)) {
            console.log(chalk.red('No existe el usuario ' + argv.user));
          } else {
            const dirUser: string = './notas/' + argv.user;
            fs.readdir(dirUser, (err, notas) => {
              if (err) {
              } else {
                const listaNotas: string[] = [];
                fs.readdir(dirUser, (err, notas) => {
                  if (err) {
                  } else {
                    notas.forEach((nota) => {
                      listaNotas.push(nota);
                    });
                  };
                  if (!listaNotas.includes(title)) {
                    console.log(chalk.red('No existe la nota ' + title + ' de ' + user));
                  } else {
                    const path = './notas/' + user + '/' + title;
                    fs.unlink(path, (err) => {
                      if (err) {
                        console.error(err);
                        return;
                      } else {
                        console.log(chalk.green('Eliminada la nota ' + title + ' de ' + user));
                      }
                    });
                  }
                });
              };
            });
          }
        });
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
