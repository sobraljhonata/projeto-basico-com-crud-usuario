import express from 'express';
const router = express.Router();
import routeAdapter from '../adapters/express-route-adapter';
import LoginController from '../controllers/login-controller';
import RefreshTokenController from '../controllers/refresh-token';

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
 *                 refreshToken:
 *                   type: string
 *                   description: Token de atualização gerado
 *               example:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                 refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', routeAdapter(new LoginController()));

/**
 * @swagger
 * /api/refresh-token:
 *  post:
 *    summary: Gera um novo token de acesso
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - refreshToken
 *            properties:
 *              refreshToken:
 *                type: string
 *                description: Token de atualização
 *            example:
 *              refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0NjczNzU1LCJleHAiOjE3NDUyNzg1NTV9.OfY7EqHxukKFa0rLMtAuo0TWj2DGJ3q5gd53TMd7Kvs
 *    responses:
 *      200:
 *        description: Token de acesso gerado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *                description: Token de acesso gerado
 *            example:
 *              token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0NjczNzU1LCJleHAiOjE3NDUyNzg1NTV9.OfY7EqHxukKFa0rLMtAuo0TWj2DGJ3q5gd53TMd7Kvs
 *      400:
 *        description: Token de atualização não fornecido
 *      403:
 *        description: Token de atualização inválido
 *      500:
 *        description: Erro interno do servidor
 */
router.post('/refresh-token', routeAdapter(new RefreshTokenController()));
export default router;
