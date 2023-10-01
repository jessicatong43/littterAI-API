import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import isAuth from '../../../src/middleware/isAuth';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('isAuth Middleware', () => {
  let mockRequest: any, mockResponse: any, mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      get: jest.fn(),
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should return 400 if Authorization header is missing', () => {
    isAuth(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message:
        'An authorization token must be included to access this endpoint',
    });
  });

  it('should return 400 if Authorization header is incorrectly formatted', () => {
    mockRequest.get.mockReturnValue('IncorrectHeader');

    isAuth(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: 'Authorization header format incorrect',
    });
  });

  it('should return 401 if JWT is invalid', () => {
    mockRequest.get.mockReturnValue('Bearer invalidToken');
    (jwt.verify as jest.Mock).mockImplementation(() => null);

    isAuth(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Unauthorized' });
  });

  it('should proceed to next middleware if JWT is valid', () => {
    mockRequest.get.mockReturnValue('Bearer validToken');
    (jwt.verify as jest.Mock).mockImplementation(() => ({ some: 'payload' }));

    isAuth(mockRequest, mockResponse, mockNext);

    expect(mockRequest.user).toEqual({ some: 'payload' });
    expect(mockNext).toHaveBeenCalled();
  });
});
