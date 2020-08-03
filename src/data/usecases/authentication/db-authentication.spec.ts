import { AuthenticationModel } from './../../../domain/usecases/authentication';
import { DbAuthentication } from './db-authentication';
import { LoadAccountByEmailRepository } from './../../protocols/LoadAccountByEmailRepository';
import { AccountModel } from './../../../domain/models/account';

const makeFaceAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFaceAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAutentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {   
    const {sut, loadAccountByEmailRepositoryStub} = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  
  test('Should throw if LoadAccountByEmailRepository throws', async () => {   
    const {sut, loadAccountByEmailRepositoryStub} = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
     const promise = sut.auth(makeFakeAuthentication())
     await expect(promise).rejects.toThrow()
  })
})