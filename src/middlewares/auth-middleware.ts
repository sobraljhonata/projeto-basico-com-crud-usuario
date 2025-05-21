import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {

  namespace Express {

    interface Request {

      user?: string | JwtPayload;

    }

  }

}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Token de autenticação não fornecido ou inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Substitua JWT_SECRET pela sua chave secreta
    console.log(decoded);
    req.user = decoded as string | JwtPayload; // Adiciona os dados do token ao objeto req
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};

export default authMiddleware;
