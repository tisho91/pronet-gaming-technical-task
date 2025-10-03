import { Request, Response } from 'express';
import { authenticationMiddleware } from './authentication.middleware';

const mockVerify = jest.fn(() => true);
jest.mock('jsonwebtoken', () => ({
  verify: () => mockVerify(),
}));

const resMock = {
  sendStatus: jest.fn((status) => status),
} as unknown as Response;

const nextMock = jest.fn();

describe('Authentication Middleware', () => {
  it('should call next if authorized', () => {
    const req = { headers: { authorization: 'Bearer Token' } } as Request;

    authenticationMiddleware(req, resMock, nextMock);
    expect(nextMock).toHaveBeenCalled();
  });

  it('should throw error if there is no token', () => {
    const req = { headers: {} } as Request;
    authenticationMiddleware(req, resMock, nextMock);
    expect(resMock.sendStatus).toHaveBeenCalledWith(401);
  });

  it('should throw error if the token is invalid', () => {
    const req = { headers: { authorization: 'Bearer Token' } } as Request;
    mockVerify.mockImplementationOnce(() => {
      throw new Error('token invalid');
    });
    authenticationMiddleware(req, resMock, nextMock);
    expect(resMock.sendStatus).toHaveBeenCalledWith(403);
  });
});
