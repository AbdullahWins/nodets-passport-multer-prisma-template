import { Request, Response, NextFunction } from 'express';

// parseJsonMiddleware.ts
export const parseJsonBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    if (req.body && req.body.data) {
      try {
        const parsedData = JSON.parse(req.body.data);

        req.body = { ...req.body, ...parsedData };
        delete req.body.data;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        return res.status(400).json({
          message: "Invalid data format",
          error: (parseError as Error).message,
        });
      }
    }
    return next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return res.status(400).json({
      message: "Unexpected error processing request",
      error: (error as Error).message,
    });
  }
};
