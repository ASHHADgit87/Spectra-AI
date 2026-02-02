import { Request,Response } from "express";
import * as Sentry from "@sentry/node";
export const getUserCredits = async (req: Request, res: Response) => {
  try {
    
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const getAllProjects  = async (req: Request, res: Response) => {
  try {
    
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const getProjectById = async (req: Request, res: Response) => {
  try {
    
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const toggleProjectPublic = async (req: Request, res: Response) => {
  try {
    
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};