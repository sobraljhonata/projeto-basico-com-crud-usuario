import { Request, Response } from 'express';
import { Controller } from '../interfaces';
const adaptRoute = (controller: Controller) => {
  return async function (req: Request, res: Response) {
    const httpRequest = {
      body: req?.body,
      params: req?.params,
      pathParameters: req?.params,
      queryStringParameters: req?.query,
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

export default adaptRoute;
