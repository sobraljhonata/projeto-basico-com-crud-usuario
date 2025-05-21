import User from '../models/user-model';
class EditarUsuarioController {
  async handle(req: { params: { id: any; }; body: { nome: any; email: any; senha: any; }; }) {
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
    } catch (error: any) {
      return {
        statusCode: 500,
        body: { error: error.message },
      };
    }
  }
}

export default EditarUsuarioController;
