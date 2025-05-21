import  User from '../models/user-model';
class DeletarUsuarioController {
  async handle(req: { params: { id: any; }; }) {
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
    } catch (error: any) {
      return {
        statusCode: 500,
        body: { error: error.message },
      };
    }
  }
}

export default DeletarUsuarioController;
