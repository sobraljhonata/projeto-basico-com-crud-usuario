import { Controller } from "../interfaces";

import User from '../models/user-model';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

class RefreshTokenController implements Controller {
  /**
   * @param {HttpRequest} httpRequest - Objeto da requisição HTTP
   * @returns {Promise<HttpResponse>}
   */
  async handle(httpRequest: { body: { refreshToken: string } }) {
    try {
      const { refreshToken } = httpRequest.body;

      if (!refreshToken) {
        return {
          statusCode: 400,
          body: { message: 'Refresh token é obrigatório' },
        };
      }

      // Verifique o refresh token
      // eslint-disable-next-line no-undef
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
      }
      const decoded = jwt.verify(refreshToken, secret) as JwtPayload;

      // Opcional: Verifique se o refresh token ainda é válido no banco de dados
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return {
          statusCode: 403,
          body: { message: 'Refresh token inválido' },
        };
      }

      const signOptions: SignOptions = {
        expiresIn: '15m',
      };
      // Gere um novo access token
      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET is not defined'); })(),
        signOptions
      );

      return {
        statusCode: 200,
        body: { token: newAccessToken },
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: { message: 'Erro interno do servidor', error: error.message },
      };
    }
  }
}

export default RefreshTokenController;
