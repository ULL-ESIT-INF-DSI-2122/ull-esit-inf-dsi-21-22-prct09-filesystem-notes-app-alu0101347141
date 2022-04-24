# Jonay Méndez Márquez
## alu0101347141
<br>

# **DSI - Práctica 9**

El propósito de esta práctica era elaborar un programa capaz de gestionar las notas de una serie de usuarios, aportándole a cada una de ellas un color y colocándolas en el directorio de su autor con formato JSON, para así conseguir una sencilla aunque también funcional biblioteca de anotaciones.

Sabiendo esto, y que además el usuario solo podía comunicarse con la aplicación a través de la línea de comandos, se nos presentaba la oportunidad perfecta de probar los paquetes **yargs** y **chalk**. Además, para plasmar y almacenar las notas producidas, se utilizaría la API síncrona proporcionada por Node.js (**fs**).

---

<br>

## ¿Qué hará nuestra aplicación?<br> 
> Presentamos los requisitos del sistema

La aplicación tendrá una serie de objetivos básicos, aquellos que la permitan considerarse una aplicación de gestión de notas propiamente dicha. Son las siguientes:

  - La podrán utilizar distintos usuarios&emsp;⟶&emsp;Para esto se almacenará y buscará cada nota en el directorio que corresponda a su autor.
  - Una nota estará formada por:
    - Título&emsp;⟶&emsp;Breve texto que nos permitirá identificarla
    - Autor&emsp;⟶&emsp;Usuario que la genere (la nota estará en el directorio con este mismo nombre)
    - Cuerpo&emsp;⟶&emsp;Contenido de la nota
    - Color&emsp;⟶&emsp;Color con la que se mostrará en la interfaz (para esto usaremos *chalk*)
  - El usuario podrá realizar las siguientes operaciones:
    - Añadir nota&emsp;⟶&emsp;Se añadirá a su directorio
    - Modificar nota&emsp;⟶&emsp;Se cambiará el antiguo contenido por el nuevo
    - Eliminar nota&emsp;⟶&emsp;Se eliminará la nota del directorio
    - Listar sus notas&emsp;⟶&emsp;Se mostrarán todos sus títulos con el color de su respectiva nota
    - Leer nota&emsp;⟶&emsp;Mostrará el contenido de la nota del color de la misma
  - Tras cada operación realizada se mostrará un mensaje informativo, tanto en caso de error como en caso de éxito. Los errores serán mostrados en color rojo, los éxitos en color verde.
  - La información se hará persistente, guardándose cada nota con formato JSON. Tendremos que trabajar con el sistema de ficheros.
  - El usuario solo podrá interactuar con la aplicación a través de la línea de comandos, que serán gestionados a través del paquete **yargs**.

---

<br>

## Comandos y yargs<br> 
> Explicamos la implementación de cada comando en detalle

Procedemos a comentar qué soluciones se han llevado a cabo para conseugir los distintos objetivos propuestos como operaciones de usuario. Para cada una, explicaremos primero la forma del comando (builder, parámetros) y a continuación su forma de operar (handler).

<br>

## · Comando **add**<br> 
> Permite crear una nueva nota y añadirla al directorio del autor

<br>

### > Parámetros

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
      .
      . handler(argv) {}
      .
    });

- Este comando recibirá cuatro parámetros:
  - --title&emsp;⟶&emsp;Título de la nota **[obligatorio]**
  - --user&emsp;⟶&emsp;Usuario autor de la nota **[obligatorio]**
  - --body&emsp;⟶&emsp;Contenido de la nota **[obligatorio]**
  - --color&emsp;⟶&emsp;Color de la nota **[obligatorio]**

<br>

### > Manejador

    handler(argv) {
        if ((typeof argv.user === 'string') && (typeof argv.title === 'string') && (typeof argv.body === 'string') &&
        (typeof argv.color === 'string')) {
          const user: string = argv.user;
          const title: string = argv.title;
          const body: string = argv.body;
          const color: string = argv.color;

          const dir: string = './notas/' + argv.user;
          fs.mkdir(dir, {recursive: true}, (err) => {
            if (err) {
              console.log(chalk.red('No se pudo crear el directorio general' + argv.user));
            } else {
              fs.readdir(dir, (err, notas) => {
                if (err) {
                  console.log(chalk.red('No se pudo examinar el directorio en busca de notas'));
                } else if (notas.includes(title)) {
                  console.log(chalk.red('¡Ya existe esta nota!'));
                } else {
                  const path = './notas/' + argv.user + '/' + argv.title;
                  const dir: string = './notas/' + argv.user;
                  fs.mkdir(dir, {recursive: true}, (err) => {
                    if (err) {
                      console.log(chalk.red('No se pudo crear el directorio del usuario' + argv.user));
                    }
                    const json: string = JSON.stringify({title: title, user: user, body: body, color: color});
                    fs.writeFile(path, json, (err) => {
                      if (err) {
                        console.log(chalk.red('No se pudo añadir la nota [' + argv.title + '] del usuario ' + argv.user));
                      } else console.log(chalk.green('Se ha añadido la nota [' + argv.title + '] del usuario ' + argv.user));
                    });
                  });
                }
              });
            }
          });
        }
      },

Primero, se comprobará que efectivamente todos los valores recibidos como parámetro son de tipo *string*. Luego, almacenamos en constantes esos mismos valores, para poder utilizarlos aun descendiendo en profundidad de anidamiento.

Como puede ser la primera nota creada por el usuario, este aún no tendrá su directorio propio. Es por esto que lo primero que haremos será llamar al método *mkdir()* del módulo fs. En caso de existir ya el directorio, se procederá con normalidad. Por el contrario, si no se ha podido crear el directorio y no existía previamente, se mostrará el aviso de error en color rojo mediante un **console.log(chalk.red(*mensaje del error que corresponde*))**. Esto será así para el resto de situaciones semejantes, en las que el comportamiento no sea el esperado, simplemente cambiaremos en cada caso el aviso mostrado por pantalla.

Si hemos pasado el paso anterior con éxito, sabemos que sí o sí existirá el directorio del usuario. Por ello, podemos llamar sin miedo al método *fs.readdir()*. Este recorre el directorio y genera un array de strings, donde cada elemento es una entrada del directorio recorrido. Como es obvio, esta función nos viene a la perfección, pues tan solo tendremos que recorrer el directorio notas/user/ (donde *user* vale lo que se le haya pasado al parámetro homónimo) y con un sencillo încludes() comprobaremos si ya existe una nota con el título que el usuario ha indicado.

En caso de no existir una nota con el mismo título, usamos la función *fs.writeFile()* que genera el fichero en caso de no existir y, luego, escribe sobre él el contenido que se le pase como argumento.

El contenido que será escrito en la nota será el siguiente: <br>
    
    const json: string = JSON.stringify({title: title, user: user, body: body, color: color});

Guardamos en la constante json una string en formato JSON, producida llamando a la función *stringify()* que convierte un objeto en string. Así, podremos almacenar muy fácilmente en los atributos del objeto los valores que fueron recibidos en el comando.

<br>

## · Comando **list**<br> 
> Permite mostrar las notas de un usuario

<br>

### > Parámetros

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
    .
    . handler(argv) {}
    .
    });

- Este comando recibirá un solo parámetro:
  - --user&emsp;⟶&emsp;Usuario autor de la nota **[obligatorio]**

<br>

### > Manejador

    handler(argv) {
      {
        if (typeof argv.user === 'string') {
          const user: string = argv.user;
          const dir: string = './notas/';
          fs.readdir(dir, (err, usuarios) => {
            if (err) {
              console.log(chalk.red('No se pudo examinar el directorio en en busca de usuarios'));
            } else if (!usuarios.includes(user)) {
              console.log(chalk.red('No existe el usuario ' + argv.user));
            } else {
              const dirUser: string = './notas/' + argv.user;
              fs.readdir(dirUser, (err, notas) => {
                if (err) {
                  console.log(chalk.red('No se pudo examinar el directorio en busca de notas'));
                } else {
                  console.log(chalk.green('Mostradas notas de ' + user + '\n-------------------------'));
                  notas.forEach((nota) => {
                    let contenido: string = '';
                    const pathNota: string = dirUser + '/' + nota;
                    fs.readFile(pathNota, (err, data) => {
                      if (err) {
                        console.log(chalk.red('No se pudo leer el fichero'));
                      } else {
                        contenido = data.toString();
                        const json = JSON.parse(contenido);
                        switch (json.color) {
                          case 'rojo':
                            console.log(chalk.red('- ' + nota));
                            break;
                          case 'verde':
                            console.log(chalk.green('- ' + nota));
                            break;
                          case 'azul':
                            console.log(chalk.blue('- ' + nota));
                            break;
                          case 'amarillo':
                            console.log(chalk.yellow('- ' + nota));
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

A partir del comando add podemos sacar una serie de herramientas y soluciones para emplearlas en el resto de comandos. Como los comandos tienen una estructura similar y llevan a cabo un patrón parecido de soluciones, no entraré más en detalle en cómo funciona cada método del módulo fs. Lo que sí presentaré será el esquema de decisiones que lleva a cabo el manejador, para tener así un esbozo mental de cómo se consigue el objetivo. En este caso, sería el siguiente:

- Se comprueba que user contiene una string
  - Se recorre el directorio /notas&emsp;⟶&emsp;fs.readdir()
    - ¿Error?&emsp;⟶&emsp;console.log(chalk.red('error'))
    - ¿No encuentra al usuario?&emsp;⟶&emsp;console.log(chalk.red('error'))
    - Se encuentra al usuario
      - Se recorre el directorio /notas/user&emsp;⟶&emsp;fs.readdir()
        - ¿Error?&emsp;⟶&emsp;console.log(chalk.red('error'))
        - Se itera sobre cada entrada del directorio&emsp;⟶&emsp;forEach()
          - Se convierte el contenido de la nota en un JSON y se evalúa el atributo *color* en un switch. Dependiendo del color que contenga, se muestra el atributo *title* de un color o de otro.

<br>

## · Comando **remove**<br> 
> Permite eliminar una nota

<br>

### > Parámetros

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
    .
    . handler(argv) {}
    .
    });

- Este comando recibirá dos parámetros:
  - --user&emsp;⟶&emsp;Usuario autor de la nota **[obligatorio]**
  - --title&emsp;⟶&emsp;Título de la nota **[obligatorio]**

<br>

### > Manejador

    handler(argv) {
      {
        if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
          const user: string = argv.user;
          const title: string = argv.title;
          const dir: string = './notas/';
          fs.readdir(dir, (err, usuarios) => {
            if (err) {
              console.log(chalk.red('No se pudo examinar el directorio en busca de usuarios'));
            } else if (!usuarios.includes(user)) {
              console.log(chalk.red('No existe el usuario ' + argv.user));
            } else {
              const dirUser: string = './notas/' + argv.user;
              fs.readdir(dirUser, (err, notas) => {
                if (err) {
                  console.log(chalk.red('No se pudo examinar el directorio en busca de notas'));
                } else if (!notas.includes(title)) {
                      console.log(chalk.red('No existe la nota ' + title + ' de ' + user));
                    } else {
                      const path = './notas/' + user + '/' + title;
                      fs.unlink(path, (err) => {
                        if (err) {
                          console.log(chalk.red('No se pudo eliminar el fichero'));
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

Esquema de decisiones:

- Se comprueba que user y title contienen una string
  - Se recorre el directorio /notas&emsp;⟶&emsp;fs.readdir()
    - ¿Error?&emsp;⟶&emsp;console.log(chalk.red('error'))
    - ¿No encuentra al usuario?&emsp;⟶&emsp;console.log(chalk.red('error'))
    - Se encuentra al usuario
      - Se recorre el directorio /notas/user&emsp;⟶&emsp;fs.readdir()
        - ¿Error?&emsp;⟶&emsp;console.log(chalk.red('error'))
        - Se elimina el fichero&emsp;⟶&emsp;fs.unlink()
          - ¿Error?&emsp;⟶&emsp;console.log(chalk.red('error'))
          - ¿Éxito?&emsp;⟶&emsp;console.log(chalk.green('éxito'))

<br>

## · Comando **open**<br> 
> Permite abrir una nota (mostrar su contenido)

<br>

### > Parámetros

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
    .
    . handler(argv) {}
    .
    });

- Este comando recibirá dos parámetros:
  - --user&emsp;⟶&emsp;Usuario autor de la nota **[obligatorio]**
  - --title&emsp;⟶&emsp;Título de la nota **[obligatorio]**

<br>

### > Manejador

    handler(argv) {
      {
        if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
          const user: string = argv.user;
          const title: string = argv.title;
          const dir: string = './notas/';
          fs.readdir(dir, (err, usuarios) => {
            if (err) {
              console.log(chalk.red('No se pudo examinar el directorio en busca de usuarios'));
            } else if (!usuarios.includes(user)) {
              console.log(chalk.red('No existe el usuario ' + argv.user));
            } else {
              const dirUser: string = './notas/' + argv.user;
              fs.readdir(dirUser, (err, notas) => {
                if (err) {
                  console.log(chalk.red('No se pudo examinar el directorio en busca de notas'));
                } else {
                  if (!notas.includes(title)) {
                    console.log(chalk.red('No existe la nota ' + title + ' de ' + user));
                  } else {
                    let contenido: string = '';
                    const pathNota: string = dirUser + '/' + title;
                    fs.readFile(pathNota, (err, data) => {
                      if (err) {
                        console.log(chalk.red('No se pudo leer el fichero'));
                      } else {
                        console.log(chalk.green('Mostrando ' + title + ', de ' + user + '\n----------------------\n'));
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

Esquema de decisiones:

- Se comprueba que user y title contienen una string
  - Se recorre el directorio /notas&emsp;⟶&emsp;fs.readdir()
    - ¿Error?&emsp;⟶&emsp;console.log(chalk.red('error'))
    - ¿No encuentra al usuario?&emsp;⟶&emsp;console.log(chalk.red('error'))
    - Se encuentra al usuario
      - Se recorre el directorio /notas/user&emsp;⟶&emsp;fs.readdir()
        - ¿Error?&emsp;⟶&emsp;console.log(chalk.red('error'))
        - Se lee el fichero&emsp;⟶&emsp;fs.readFile()
          - ¿Error?&emsp;⟶&emsp;console.log(chalk.red('error'))
          - ¿Éxito?&emsp;⟶&emsp;JSON a string con JSON.parse()
            - Se utiliza el atributo color para evaluar en qué color se mostrará por pantalla
              - Se muestra el contenido del atributo body en el color seleccionado

<br>

---

## Conclusión

Terminamos nuestro código con un yargs.parse() y disfrutamos del correcto funcionamiento de la aplicación, cumpliendo con los objetivos propuestos y pudiendo probarlo con tan solo ejecutar los comandos que hemos preparado. Como se han indicado rutas relativas, el directorio *notas/* será creado en el directorio donde se ejecuten los comandos, y bajo esté serán creados los directorios de los usuarios con sus respectivas notas.

Ahora sí, eso ha sido todo.

---

<br>

_Desarrollado por Jonay Méndez Márquez_
<br>
_Última actualización: 24/04/2022_ 
<br>
_Para cualquier duda al respecto: alu0101347141@ull.edu.es_
