import User from '../models/user-model';

class ListarUsuarioController {
  async handle(req: { params: { id: any; }; }) {
    try {
      const userId = req.params?.id;
      const usuario = await User.findByPk(userId);
      if (!usuario && userId) {
        return {
          statusCode: 404,
          body: { error: 'Usuário não encontrado' },
        };
      } else if (userId) {
        return {
          statusCode: 200,
          body: usuario,
        };
      }
      const usuarios = await User.findAll();
      return {
        statusCode: 200,
        body: usuarios,
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: { error: error.message },
      };
    }
  }
}

export default ListarUsuarioController;
