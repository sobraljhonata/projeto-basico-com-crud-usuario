// Bibliotecas
import express from 'express';
import prompt from 'prompt';
import fs from 'fs';
import path from 'path';
import { swaggerUi, specs } from './swaggerConfig';
import sequelize from './database';
// // Middlewares
import middlewares from './middlewares';

// Cria o servidor express
const app = express();
const initialPort = process.env.PORT || 3000;

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
const startServer = (port: number) => {
  app
    .listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
      console.log(
        `Documentação da API disponível em http://localhost:${port}/api-docs`
      );
    })
    .on('error', (err:any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${port} está ocupada.`);
        const newPort = port + 1;
        promptUserForNewPort(`${newPort}`);
      } else {
        console.error(err);
      }
    });
};

// Função para perguntar ao usuário se deseja usar a nova porta
const promptUserForNewPort = (newPort: string) => {
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

  prompt.get(schema, (err: any, result: any) => {
    if (
      result.useNewPort.toLowerCase() === 'sim' ||
      result.useNewPort.toLowerCase() === 's'
    ) {
      startServer(parseInt(newPort));
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
    startServer(Number(initialPort));
  })
  .catch((err: any) => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });
