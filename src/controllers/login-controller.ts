import User from '../models/user-model';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Controller, HttpRequest, HttpResponse } from '../interfaces';

export class LoginController implements Controller {
  /**
   * Lida com a requisição de login
   * @param {HttpRequest} httpRequest - Objeto da requisição HTTP
   * @returns {Promise<HttpResponse>}
   */
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const senhaEhValida = await bcrypt.compare(senha, user.senha);
      if (!senhaEhValida) {
        return {
          statusCode: 401,
          body: { message: 'Credenciais inválidas' },
        };
      }

      // Retornar sucesso (você pode adicionar lógica para gerar tokens aqui)
      return {
        statusCode: 200,
        body: { message: 'Login realizado com sucesso' },
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        statusCode: 500,
        body: { message: 'Erro interno do servidor' },
      };
    }
  }
}

export default LoginController;
