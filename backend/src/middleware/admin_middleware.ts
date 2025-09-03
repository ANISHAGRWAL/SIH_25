import { NextFunction, Response } from "express";
import { IApiRequest } from "../types";

const adminMiddleware = (
  req: IApiRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: { message: "Access denied" } });
  }
  next();
};

export default adminMiddleware;
