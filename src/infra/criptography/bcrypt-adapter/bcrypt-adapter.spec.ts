import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('any_hash'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      const value = 'any_value'
      await sut.hash(value)
      expect(hashSpy).toBeCalledWith(value, salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('any_hash')
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    const value = 'any_value'
    const hash = 'any_hash'

    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare(value, hash)
      expect(compareSpy).toBeCalledWith(value, hash)
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()
      const isValid = await sut.compare(value, hash)
      expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(
        new Promise((resolve, reject) => resolve(false))
      )
      const isValid = await sut.compare(value, hash)
      await expect(isValid).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(new Error())
      const promise = sut.compare(value, hash)
      await expect(promise).rejects.toThrow()
    })
  })
})
