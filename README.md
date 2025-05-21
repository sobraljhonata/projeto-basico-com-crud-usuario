### Passo 1: Configuração do Projeto

1. **Crie uma pasta para o projeto** e navegue até ela no terminal:

   ```bash
   mkdir user-api
   cd user-api
   ```

1. **Crie a seguinte estrutura de pastas e arquivos**:

   ```
   user-api/
   ├── node_modules/
   ├── src/
   │ ├── middlewares/
   │ │ ├── cors.js
   │ │ ├── content-type.js
   │ │ ├── body-parser.js
   │ │ ├── logger.js
   │ │ └── index.js
   │ ├── routes/
   │ │ └── userRoutes.js
   │ ├── controllers/
   │ └── server.js
   ├── package.json
   └── package-lock.json
   ```

1. **Inicialize um novo projeto Node.js**:

   ### Se tiver usando npm

   ```bash
   npm init -y
   ```

   ### Se tiver usando yarn

   ```bash
   yarn init -y
   ```

1. **Instale as dependências necessárias**:
   ```bash
   npm install express
   ```

### Passo 2: Criação do Servidor Express

1. **Crie um arquivo chamado `server.js`** e adicione o seguinte código:

   ```javascript
   const express = require('express');

   const app = express();
   const port = 3000;

   let users = [];

   // Endpoint para criação de usuário
   app.post('/users', (req, res) => {
     const user = req.body;
     users.push(user);
     res.status(201).send('Usuário criado com sucesso!');
   });

   // Endpoint para listagem de usuários
   app.get('/users', (req, res) => {
     res.json(users);
   });

   // Endpoint para atualização de usuário
   app.put('/users/:id', (req, res) => {
     const id = req.params.id;
     const updatedUser = req.body;
     users = users.map((user) => (user.id === id ? updatedUser : user));
     res.send('Usuário atualizado com sucesso!');
   });

   // Endpoint para deletar usuário
   app.delete('/users/:id', (req, res) => {
     const id = req.params.id;
     users = users.filter((user) => user.id !== id);
     res.send('Usuário deletado com sucesso!');
   });

   app.listen(port, () => {
     console.log(`Servidor rodando na porta ${port}`);
   });
   ```

### Passo 3: Criação dos middlewares

1. **Crie um arquivo chamado `cors.js`** e adicione o seguinte código:

```javascript
const cors = (req, res, next) => {
  res.set('access-control-allow-origin', '*');
  res.set('access-control-allow-headers', '*');
  res.set('access-control-allow-methods', '*');
  next();
};

module.exports = cors;
```

2. **Crie um arquivo chamado `body-parser.js`** e adicione o seguinte código:

```javascript
const { json } = require('express');

const bodyParser = json();

module.exports = bodyParser;
```

3. **Crie um arquivo chamado `content-type.js`** e adicione o seguinte código:

```javascript
const contentType = (req, res, next) => {
  res.type('json');
  next();
};

module.exports = contentType;
```

#### Implementando os middlewares no código do servidor

```javascript
const express = require('express');
const cors = require('./middlewares/cors');
const contentType = require('./middlewares/content-type');
const bodyParser = require('./middlewares/body-parser');

const app = express();
const port = 3000;

app.use(cors);
app.use(contentType);
app.use(bodyParser);

let users = [];

// Endpoint para criação de usuário
app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).send('Usuário criado com sucesso!');
});

// Endpoint para listagem de usuários
app.get('/users', (req, res) => {
  res.json(users);
});

// Endpoint para atualização de usuário
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  users = users.map((user) => (user.id === id ? updatedUser : user));
  res.send('Usuário atualizado com sucesso!');
});

// Endpoint para deletar usuário
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  users = users.filter((user) => user.id !== id);
  res.send('Usuário deletado com sucesso!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
```

### Passo 4: Criação de função que busca outra opção de porta caso a selecionada não esteja disponível

1. **Instale a biblioteca prompt:**

```bash
    npm install prompt
```

2. **Altere o arquivo chamado `server.js`** e adicione o seguinte código:

```javascript
const express = require('express');
const cors = require('./middlewares/cors');
const contentType = require('./middlewares/content-type');
const bodyParser = require('./middlewares/body-parser');

const app = express();
const initialPort = 3000;

app.use(cors);
app.use(contentType);
app.use(bodyParser);

let users = [];

// Endpoint para criação de usuário
app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).send('Usuário criado com sucesso!');
});

// Endpoint para listagem de usuários
app.get('/users', (req, res) => {
  res.json(users);
});

// Endpoint para atualização de usuário
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  users = users.map((user) => (user.id === id ? updatedUser : user));
  res.send('Usuário atualizado com sucesso!');
});

// Endpoint para deletar usuário
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  users = users.filter((user) => user.id !== id);
  res.send('Usuário deletado com sucesso!');
});

// Função para iniciar o servidor em uma porta específica
const startServer = (port) => {
  app
    .listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${port} está ocupada.`);
        const newPort = port + 1;
        promptUserForNewPort(newPort);
      } else {
        console.error(err);
      }
    });
};

// Função para perguntar ao usuário se deseja usar a nova porta
const promptUserForNewPort = (newPort) => {
  prompt.start();
  const schema = {
    properties: {
      useNewPort: {
        description: `Porta ${newPort} está disponível. Deseja usar essa porta? (sim/não)`,
        pattern: /^(sim|não|s|n)$/i,
        message: 'Responda com "sim" ou "não"',
        required: true,
      },
    },
  };

  prompt.get(schema, (err, result) => {
    if (
      result.useNewPort.toLowerCase() === 'sim' ||
      result.useNewPort.toLowerCase() === 's'
    ) {
      startServer(newPort);
    } else {
      console.log('Servidor não iniciado.');
    }
  });
};

// Iniciar o servidor na porta inicial
startServer(initialPort);
```

### Passo 5: Criação de rotas para carregamento dinâmico

1. **Crie um arquivo chamado `userRoutes.js` na pasta routes** e adicione o seguinte código:

```javascript
const express = require('express');
const router = express.Router();

let users = [];

// Endpoint para criação de usuário
router.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).send('Usuário criado com sucesso!');
});

// Endpoint para listagem de usuários
router.get('/users', (req, res) => {
  res.json(users);
});

// Endpoint para atualização de usuário
router.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  users = users.map((user) => (user.id === id ? updatedUser : user));
  res.send('Usuário atualizado com sucesso!');
});

// Endpoint para deletar usuário
router.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  users = users.filter((user) => user.id !== id);
  res.send('Usuário deletado com sucesso!');
});

module.exports = router;
```

2. **Altere o arquivo chamado `server.js`** e adicione o seguinte código:

```javascript
// Bibliotecas
const express = require('express');
const prompt = require('prompt');
const fs = require('fs');
const path = require('path');

// Middlewares
const cors = require('./middlewares/cors');
const contentType = require('./middlewares/content-type');
const bodyParser = require('./middlewares/body-parser');

const app = express();
const initialPort = 3000;

app.use(cors);
app.use(contentType);
app.use(bodyParser);

// Carregar dinamicamente todas as rotas na pasta 'routes'
fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
  const route = require(`./routes/${file}`);
  app.use('/api', route);
});

// Função para iniciar o servidor em uma porta específica
const startServer = (port) => {
  app
    .listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${port} está ocupada.`);
        const newPort = port + 1;
        promptUserForNewPort(newPort);
      } else {
        console.error(err);
      }
    });
};

// Função para perguntar ao usuário se deseja usar a nova porta
const promptUserForNewPort = (newPort) => {
  prompt.start();
  const schema = {
    properties: {
      useNewPort: {
        description: `Porta ${newPort} está disponível. Deseja usar essa porta? (sim/não)`,
        pattern: /^(sim|não|s|n)$/i,
        message: 'Responda com "sim" ou "não"',
        required: true,
      },
    },
  };

  prompt.get(schema, (err, result) => {
    if (
      result.useNewPort.toLowerCase() === 'sim' ||
      result.useNewPort.toLowerCase() === 's'
    ) {
      startServer(newPort);
    } else {
      console.log('Servidor não iniciado.');
    }
  });
};

// Iniciar o servidor na porta inicial
startServer(initialPort);
```

### Passo 6: Criação de arquivo index para centralizar importação de módulos

1. **Crie um arquivo chamado `index.js` na pasta middlewares** e adicione o seguinte código:

```javascript
module.exports = {
  bodyParser: require('./body-parser'),
  contentType: require('./content-type'),
  cors: require('./cors'),
};
```

2. **Altere o arquivo chamado `server.js`** e adicione o seguinte código:

```javascript
// Bibliotecas
const express = require('express');
const prompt = require('prompt');
const fs = require('fs');
const path = require('path');

// Middlewares
const middlewares = require('./middlewares');

const app = express();
const initialPort = 3000;

app.use(middlewares.cors);
app.use(middlewares.contentType);
app.use(middlewares.bodyParser);

// Carregar dinamicamente todas as rotas na pasta 'routes'
fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
  const route = require(`./routes/${file}`);
  app.use('/api', route);
});

// Função para iniciar o servidor em uma porta específica
const startServer = (port) => {
  app
    .listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${port} está ocupada.`);
        const newPort = port + 1;
        promptUserForNewPort(newPort);
      } else {
        console.error(err);
      }
    });
};

// Função para perguntar ao usuário se deseja usar a nova porta
const promptUserForNewPort = (newPort) => {
  prompt.start();
  const schema = {
    properties: {
      useNewPort: {
        description: `Porta ${newPort} está disponível. Deseja usar essa porta? (sim/não)`,
        pattern: /^(sim|não|s|n)$/i,
        message: 'Responda com "sim" ou "não"',
        required: true,
      },
    },
  };

  prompt.get(schema, (err, result) => {
    if (
      result.useNewPort.toLowerCase() === 'sim' ||
      result.useNewPort.toLowerCase() === 's'
    ) {
      startServer(newPort);
    } else {
      console.log('Servidor não iniciado.');
    }
  });
};

// Iniciar o servidor na porta inicial
startServer(initialPort);
```

### Passo 7: Criação da documentação do swagger

1. **Instale as dependências necessárias**:

   ```bash
   npm install swagger-ui-express swagger-jsdoc
   ```

2. **crie um arquivo chamado `swaggerConfig.js` na pasta src** e adicione o seguinte código:

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API para gerenciamento de usuários',
    },
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos de rotas
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
```

3. **Altere o arquivo chamado `server.js` na pasta src** e adicione o seguinte código:

```javascript
// Bibliotecas
const express = require('express');
const prompt = require('prompt');
const fs = require('fs');
const path = require('path');
const { swaggerUi, specs } = require('./swaggerConfig'); // Importar configuração do Swagger

// Middlewares
const middlewares = require('./middlewares');

// Cria o servidor express
const app = express();
const initialPort = 3000;

// Configura o Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(middlewares.cors);
app.use(middlewares.contentType);
app.use(middlewares.bodyParser);

// Carregar dinamicamente todas as rotas na pasta 'routes'
fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
  const route = require(`./routes/${file}`);
  app.use('/api', route);
});

// Função para iniciar o servidor em uma porta específica
const startServer = (port) => {
  app
    .listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
      console.log(
        `Documentação da API disponível em http://localhost:${port}/api-docs`
      );
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${port} está ocupada.`);
        const newPort = port + 1;
        promptUserForNewPort(newPort);
      } else {
        console.error(err);
      }
    });
};

// Função para perguntar ao usuário se deseja usar a nova porta
const promptUserForNewPort = (newPort) => {
  prompt.start();
  const schema = {
    properties: {
      useNewPort: {
        description: `Porta ${newPort} está disponível. Deseja usar essa porta? (sim/não)`,
        pattern: /^(sim|não|s|n)$/i,
        message: 'Responda com "sim" ou "não"',
        required: true,
      },
    },
  };

  prompt.get(schema, (err, result) => {
    if (
      result.useNewPort.toLowerCase() === 'sim' ||
      result.useNewPort.toLowerCase() === 's'
    ) {
      startServer(newPort);
    } else {
      console.log('Servidor não iniciado.');
    }
  });
};

// Iniciar o servidor na porta inicial
startServer(initialPort);
```

4. **Altere o arquivo chamado `userRoutes.js` na pasta routes** e adicione o seguinte código:

```javascript
const express = require('express');
const router = express.Router();

let users = [];

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       500:
 *         description: Some server error
 */
router.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).send('Usuário criado com sucesso!');
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update the user by the id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some error happened
 */
router.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  users = users.map((user) => (user.id === id ? updatedUser : user));
  res.send('Usuário atualizado com sucesso!');
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */
router.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  users = users.filter((user) => user.id !== id);
  res.send('Usuário deletado com sucesso!');
});

module.exports = router;
```

### Passo 8: Adicionar o sqlLite no projeto

1. Instale as depedências:

```bash
npm install sqlite3 sequelize
```

2. **crie um arquivo chamado `database.js` na pasta src** e adicione o seguinte código:

```javascript
// filepath: /home/professor/Projetos/user-api-v2/src/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

module.exports = sequelize;
```

3. **crie um arquivo chamado `user-model.js` na pasta models** e adicione o seguinte código:

```javascript
// filepath: /home/professor/Projetos/user-api-v2/src/models/user-model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
```

4. **Altere o arquivo chamado `server.js` na pasta src** e adicione o seguinte código:

```javascript
...
const sequelize = require('./database'); // Importar a configuração do banco de dados
const User = require('./models/user-model'); // Importar o modelo de usuário
...

// Sincronizar o banco de dados e iniciar o servidor
sequelize.sync().then(() => {
    console.log('Banco de dados sincronizado');
    startServer(initialPort);
}).catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
});
...
```

5. **Altere o arquivo chamado `userRoutes.js` na pasta src** e adicione o seguinte código:

```javascript
// filepath: /home/professor/Projetos/user-api-v2/src/routes/userRoutes.js
const express = require('express');
const User = require('../models/user-model');
const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Passo 9: Adicionar o dotenv no projeto

```bash
npm install dotenv
```

1. **crie um arquivo chamado `.env` na pasta src** e adicione o seguinte código:

```
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/mydatabase
```

2. **Altere o arquivo server.js** e adicione o seguinte código:

```javascript
require('dotenv').config();

// Bibliotecas
const express = require('express');
const prompt = require('prompt');
const fs = require('fs');
const path = require('path');
const { swaggerUi, specs } = require('./swaggerConfig'); // Importar configuração do Swagger
const sequelize = require('./database'); // Importar a configuração do banco de dados
const User = require('./models/user-model'); // Importar o modelo de usuário
// Middlewares
const middlewares = require('./middlewares');

// Cria o servidor express
const app = express();

const initialPort = process.env.PORT || 3000;
console.log(`Servidor rodando na porta ${initialPort}`);

// Configura o Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Redireciona a página root (/) para /api-docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use(middlewares.cors);
app.use(middlewares.contentType);
app.use(middlewares.bodyParser);

// Carregar dinamicamente todas as rotas na pasta 'routes'
fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
  const route = require(`./routes/${file}`);
  app.use('/api', route);
});

// Função para iniciar o servidor em uma porta específica
const startServer = (port) => {
  app
    .listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
      console.log(
        `Documentação da API disponível em http://localhost:${port}/api-docs`
      );
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${port} está ocupada.`);
        const newPort = port + 1;
        promptUserForNewPort(newPort);
      } else {
        console.error(err);
      }
    });
};

// Função para perguntar ao usuário se deseja usar a nova porta
const promptUserForNewPort = (newPort) => {
  prompt.start();
  const schema = {
    properties: {
      useNewPort: {
        description: `Porta ${newPort} está disponível. Deseja usar essa porta? (sim/não)`,
        pattern: /^(sim|não|s|n)$/i,
        message: 'Responda com "sim" ou "não"',
        required: true,
      },
    },
  };

  prompt.get(schema, (err, result) => {
    if (
      result.useNewPort.toLowerCase() === 'sim' ||
      result.useNewPort.toLowerCase() === 's'
    ) {
      startServer(newPort);
    } else {
      console.log('Servidor não iniciado.');
    }
  });
};

// Iniciar o servidor na porta inicial
// Sincronizar o banco de dados e iniciar o servidor
sequelize
  .sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
    startServer(initialPort);
  })
  .catch((err) => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });
```

### Passo 9: Uso de Controller

**adicione a biblioteca do bcrypt**

```bash
npm install bcrypt
```

1. **crie um arquivo chamado `criar-usuario.js` na pasta controllers** e adicione o seguinte código:

```javascript
const User = require('../models/user-model');
const bcrypt = require('bcrypt');
class CriarUsuarioController {
  /**
   * @param {HttpRequest} request - Objeto da requisição HTTP
   * @returns {Promise<HttpResponse>}
   */
  async handle(httpRequest) {
    try {
      const { nome, email, senha } = httpRequest.body;

      const salt = 10;

      const senhaCriptografada = await bcrypt.hash(senha, salt);

      const usuario = await User.create({
        nome,
        email,
        senha: senhaCriptografada,
      });

      return {
        statusCode: 201,
        body: usuario,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: error.message },
      };
    }
  }
}

module.exports = CriarUsuarioController;
```

2. **crie um arquivo chamado `editar-usuario.js` na pasta controllers** e adicione o seguinte código:

```javascript
const User = require('../models/user-model');
class EditarUsuarioController {
  async handle(req, res) {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    try {
      const usuario = await User.findByPk(id);
      if (!usuario) {
        return {
          statusCode: 404,
          body: { error: 'Usuário não encontrado' },
        };
      }
      await usuario.update({
        nome,
        email,
        senha,
      });
      return {
        statusCode: 200,
        body: usuario,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: error.message },
      };
    }
  }
}

module.exports = EditarUsuarioController;
```

3. **crie um arquivo chamado `listar-usuario.js` na pasta controllers** e adicione o seguinte código:

```javascript
const User = require('../models/user-model');

class ListarUsuarioController {
  async handle(req, res) {
    try {
      const usuarios = await User.findAll();
      return {
        statusCode: 200,
        body: usuarios,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: error.message },
      };
    }
  }
}

module.exports = ListarUsuarioController;
```

4. **crie um arquivo chamado `deletar-usuario.js` na pasta controllers** e adicione o seguinte código:

```javascript
const User = require('../models/user-model');
class DeletarUsuarioController {
  async handle(req, res) {
    const { id } = req.params;
    try {
      const usuario = await User.findByPk(id);

      if (!usuario) {
        return {
          statusCode: 404,
          body: { error: 'Usuário não encontrado' },
        };
      }
      await usuario.destroy();
      return {
        statusCode: 204,
        body: {},
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: error.message },
      };
    }
  }
}

module.exports = DeletarUsuarioController;
```

5. **Altere o arquivo userRoutes.js** e adicione o seguinte código:

```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const routeAdapter = require('../adapters/express-route-adapter');
const CriarUsuarioController = require('../controllers/criar-usuario');
const ListarUsuarioController = require('../controllers/listar-usuario');
const EditarUsuarioController = require('../controllers/editar-usuario');
const DeletarUsuarioController = require('../controllers/deletar-usuario');
const adaptRoute = require('../adapters/express-route-adapter');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nome
 *         - senha
 *         - email
 *       properties:
 *         nome:
 *           type: string
 *           description: O nome de usuário
 *         senha:
 *           type: string
 *           description: A senha do usuário
 *         email:
 *           type: string
 *           description: O email do usuário
 *       example:
 *         id: 1
 *         nome: João da Silva
 *         senha: 123abc
 *         email: joao.silva@dominio.com
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários API
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: O usuário foi criado com sucesso!
 *       500:
 *         description: Algum erro aconteceu
 */
router.post('/users', routeAdapter(new CriarUsuarioController()));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retorna a lista de usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A lista de usuários foi retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', routeAdapter(new ListarUsuarioController()));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza o usuário por id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: O usuário foi atualizado com sucesso
 *       404:
 *         description: O usuário não foi encontrado
 *       500:
 *         description: Algum erro aconteceu
 */
router.put('/users/:id', adaptRoute(new EditarUsuarioController()));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove o usuário por id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O id do usuário
 *     responses:
 *       200:
 *         description: O usuário foi removido com sucesso
 *       404:
 *         description: O usuário não foi encontrado
 *       500:
 *         description: Algum erro aconteceu
 */
router.delete('/users/:id', adaptRoute(new DeletarUsuarioController()));

module.exports = router;
```

6. **Altere o arquivo express-route-adapter.js** e adicione o seguinte código:

```javascript
const adaptRoute = (controller) => {
  return async function (req, res) {
    const httpRequest = {
      body: req?.body,
      params: req?.params,
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

module.exports = adaptRoute;
```

### Passo 10: Criação de Login

1. **crie um arquivo chamado `loginRoutes.js` na pasta routes** e adicione o seguinte código:

```javascript
const express = require('express');
const router = express.Router();
const routeAdapter = require('../adapters/express-route-adapter');
const LoginController = require('../controllers/login-controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *             example:
 *               email: "joao.silva@dominio.com"
 *               senha: "123abc"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', routeAdapter(new LoginController()));

module.exports = router;
```

2. **crie um arquivo chamado `login-controller.js` na pasta controllers** e adicione o seguinte código:

```javascript
const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
  /**
   * @param {HttpRequest} httpRequest - Objeto da requisição HTTP
   * @returns {Promise<HttpResponse>}
   */
  async handle(httpRequest) {
    try {
      const { email, senha } = httpRequest.body;

      // Verificar se o usuário existe no banco de dados
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return {
          statusCode: 404,
          body: { message: 'Usuário não encontrado' },
        };
      }

      // Comparar a senha recebida com a senha criptografada
      const senhEhValida = await bcrypt.compare(senha, user.senha);
      if (!senhEhValida) {
        return {
          statusCode: 401,
          body: { message: 'Credenciais inválidas' },
        };
      }

      // Gerar o token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN, // Token válido por 1 hora
        }
      );

      return {
        statusCode: 200,
        body: { token },
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { message: 'Erro interno do servidor', error: error.message },
      };
    }
  }
}

module.exports = LoginController;
```

3. **Altere o arquivo userRoutes.js** e adicione o seguinte código:

```javascript
const express = require('express');
const router = express.Router();
const routeAdapter = require('../adapters/express-route-adapter');
const CriarUsuarioController = require('../controllers/criar-usuario');
const ListarUsuarioController = require('../controllers/listar-usuario');
const EditarUsuarioController = require('../controllers/editar-usuario');
const DeletarUsuarioController = require('../controllers/deletar-usuario');
const authMiddleware = require('../middlewares/auth-middleware');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nome
 *         - senha
 *         - email
 *       properties:
 *         nome:
 *           type: string
 *           description: O nome de usuário
 *         senha:
 *           type: string
 *           description: A senha do usuário
 *         email:
 *           type: string
 *           description: O email do usuário
 *       example:
 *         id: 1
 *         nome: "João da Silva"
 *         senha: "123abc"
 *         email: "joao.silva@dominio.com"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários API
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: O usuário foi criado com sucesso!
 *       500:
 *         description: Algum erro aconteceu
 */
router.post(
  '/users',
  authMiddleware,
  routeAdapter(new CriarUsuarioController())
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retorna a lista de usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A lista de usuários foi retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', routeAdapter(new ListarUsuarioController()));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza o usuário por id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: O usuário foi atualizado com sucesso
 *       404:
 *         description: O usuário não foi encontrado
 *       500:
 *         description: Algum erro aconteceu
 */
router.put('/users/:id', routeAdapter(new EditarUsuarioController()));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove o usuário por id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O id do usuário
 *     responses:
 *       200:
 *         description: O usuário foi removido com sucesso
 *       404:
 *         description: O usuário não foi encontrado
 *       500:
 *         description: Algum erro aconteceu
 */
router.delete('/users/:id', routeAdapter(new DeletarUsuarioController()));

module.exports = router;
```

4. **crie um arquivo chamado `auth-middleware.js` na pasta controllers** e adicione o seguinte código:

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1]; // Extrai o token do formato "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Valida o token
    req.user = decoded; // Adiciona os dados do usuário decodificados ao objeto da requisição
    next(); // Continua para a próxima função
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
```
1. **crie um arquivo chamado `auth-middleware.js` na pasta controllers** e adicione o seguinte código:

```javascript

```

1. **Altere o arquivo userRoutes.js** e adicione o seguinte código:

```javascript

```

### Passo 11: Inserir eslint e prettier no projeto

1. **Rode o comando:** para instalar as bibliotecas:
```bash
npm install eslint eslint-config-airbnb-base eslint-plugin-import --save-dev

npm install --save-dev prettier --legacy-peer-deps
```

2. **Rode o comando** para inicializar o eslint:
```bash
npx eslint --init
```
3. **crie um arquivo chamado `.eslintrc.js` na raiz do projeto** e adicione o seguinte código:
```javascript
module.exports = {
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Adicione regras personalizadas aqui, se necessário
    'no-console': 'off', // Permitir console.log
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Avisar sobre variáveis não usadas
  },
};
```

4. **crie um arquivo chamado `.prettierrc` na raiz do projeto** e adicione o seguinte código:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```


1. **Rode o comando:**:

```bash

```
1. **crie um arquivo chamado `auth-middleware.js` na pasta controllers** e adicione o seguinte código:

```javascript

```

## USANDO MYSQL SERVER NA API
1. **Rode o comando para instalar a biblioteca do mysql2:**:

```bash
npm install --save mysql2 --legacy-peer-deps
```

2. **Rode o seguinte comando para inicializar o servidor de banco de dados:**:

```bash
sudo service mysql start
```

3. **Altere o arquivo config.json e insira o seguinte código:**

```json
{
    "development":{
        "dialect": "mysql",
        "host": "0.0.0.0",
        "database": "db_app",
        "username": "user_app",
        "password": "Senha@123",
        "port": 3306
    }
}
```

4. **Altere o arquivo database.js e insira o seguinte código:**

```javascript
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

// Determinar o ambiente atual (default: development)
// eslint-disable-next-line no-undef
const env = process.env.NODE_ENV || 'development';

// Carregar as configurações do ambiente atual
const dbConfig = config[env];

// Inicializar o Sequelize com as configurações carregadas
const sequelize = new Sequelize(
  dbConfig.database, // Nome do banco de dados
  dbConfig.username, // Usuário do banco
  dbConfig.password, // Senha do banco
  {
    host: dbConfig.host, // Host do banco de dados
    dialect: dbConfig.dialect, // Dialeto (mysql)
    port: dbConfig.port, // Porta do banco de dados
    logging: dbConfig.logging || false, // Desabilitar logs do Sequelize (opcional)
  }
);

module.exports = sequelize;
```

## ADICIONANDO TYPESCRIPT AO PROJETO
1. **Rode o seguinte código para instalar as dependências:**

```bash
npm install --save-dev sucrase typescript @types/node --legacy-peer-deps ## npm
yarn add -D sucrase typescript @types/node ## yarn
```

2. **Crie o arquivo tsconfig.json na raiz do projeto:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

2. **Altere o arquivo package.json na raiz do projeto:**
```json
{
  "name": "user-api",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "sucrase-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.14.1",
    "prompt": "^1.3.0",
    "sequelize": "^6.37.6",
    "sqlite3": "^5.1.7",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.24.0",
    "eslint": "^9.24.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.31.0",
    "globals": "^16.0.0",
    "prettier": "^3.5.3",
    "sequelize-cli": "^6.6.2"
  }
}
```

3. **Crie o arquivo .sucraseconfig.js na raiz do projeto:**
```javascript
module.exports = {
  transforms: ['typescript', 'imports'],
};
```

4. **Rode o comando para instalar a biblioteca os tipos:**:
```bash
npm install --save-dev @types/express @types/prompt @types/jsonwebtoken --legacy-peer-deps
yarn add -D @types/express @types/prompt @types/jsonwebtoken
```

5. **Altere o arquivo server.ts e insira o seguinte código:**
```javascript
import express from 'express';
import sequelize from './database';
import middlewares from './middlewares';
import { swaggerUi, specs } from './swaggerConfig';
import fs from 'fs';
import path from 'path';

const app = express();
const initialPort = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use(middlewares.cors);
app.use(middlewares.contentType);
app.use(middlewares.bodyParser);

fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
  const route = require(`./routes/${file}`);
  app.use('/api', route);
});

const startServer = (port: number) => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
};

sequelize.sync().then(() => {
  startServer(Number(initialPort));
});
```