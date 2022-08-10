import { Request, Response, NextFunction } from 'express'

export const contentType = (_: Request, res: Response, next: NextFunction): void => {
  res.type('json')

  next()
}
