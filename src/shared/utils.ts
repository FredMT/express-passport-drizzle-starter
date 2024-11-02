import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async Express route handler to automatically catch and forward errors to Express error handling middleware.
 * Eliminates the need for try-catch blocks in each controller method.
 *
 * @param {Function} routeHandler - Async Express route handler function to wrap
 * @returns {Function} Wrapped route handler that forwards errors to next()
 *
 */
export const asyncErrorHandler = (
  routeHandler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await routeHandler(request, response, next);
    } catch (error) {
      // Forward error to Express error handling middleware
      next(error);
    }
  };
};
