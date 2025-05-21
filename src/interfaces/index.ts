export interface Controller {
  handle: (httpRequest: any) => Promise<any>;
}
export interface HttpRequest {
  body?: any;
  params?: any;
  pathParameters?: any;
  queryStringParameters?: any;
}
export interface HttpResponse {
  statusCode: number;
  body: any;
}
export interface ExpressMiddleware {
  handle: (req: Request, res: Response, next: () => void) => Promise<void>;
}
export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
export interface ExpressMiddlewareAdapter {
  handle: (req: Request, res: Response, next: () => void) => Promise<void>;
}
export interface MiddlewareAdapter {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}