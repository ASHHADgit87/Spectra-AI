import { NextFunction, Request, Response } from "express";
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {userId} = req.auth();
    if(!userId){
      return res.status(401).json({ message: "Unauthorized User" });
    }
    next();
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ message: error.code || error.message });
  }
};