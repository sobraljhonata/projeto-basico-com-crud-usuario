import User from '../models/user-model';
import bcrypt from 'bcrypt';
class CriarUsuarioController {
  /**
   * @param {HttpRequest} request - Objeto da requisição HTTP
   * @returns {Promise<HttpResponse>}
   */
  async handle(httpRequest: { body: { nome: any; email: any; senha: any; }; }) {
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
    } catch (error: any) {
      return {
        statusCode: 500,
        body: { error: error.message },
      };
    }
  }
}

export default CriarUsuarioController;
