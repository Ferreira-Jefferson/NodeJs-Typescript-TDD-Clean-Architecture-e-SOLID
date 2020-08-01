import { badRequest } from './../../helpers/http-helper'
import { MissingParamError } from './../../errors/missing-param-error'
import { HttpRequest, HttpResponse } from './../../protocols'
import { Controller } from './../../protocols/controller'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }
}
