import * as chalk from 'chalk';
import * as yargs from 'yargs';
import * as fs from 'fs';

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
                if (!notas.includes(title)) {
                  console.log(chalk.red('No existe la nota ' + title + ' de ' + user));
                } else {
                  let contenido: string = '';
                  const pathNota: string = dirUser + '/' + title;
                  fs.readFile(pathNota, (err, data) => {
                    if (err) {
                      console.log('ERROR');
                    } else {
                      contenido = data.toString();
                      const json = JSON.parse(contenido);
                      switch (json.color) {
                        case 'rojo':
                          console.log(chalk.red(json.body));
                          break;
                        case 'verde':
                          console.log(chalk.green(json.body));
                          break;
                        case 'azul':
                          console.log(chalk.blue(json.body));
                          break;
                        case 'amarillo':
                          console.log(chalk.yellow(json.body));
                          break;
                      }
                    }
                  });
                };
              }
            });
          }
        });
      }
    }
  },
});


yargs.parse();
