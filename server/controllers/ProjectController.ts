import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js";
import { v2 as cloudinary } from "cloudinary";
import { parse } from "node:path";
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from "@google/genai";
import fs from "fs";
import path from "path";
const loadImage = (path: string,mimeType: string) => {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString("base64"),
            mimeType
        }
    }
}
export const createProject = async (req: Request, res: Response) => {
  let tempProjectId: string;
  const { userId } = req.auth();
  let isCreditDeducted = false;
  const {
    name = "New Project",
    aspectRatio,
    userPrompt,
    productName,
    productDescription,
    targetLength = 5,
  } = req.body;
  const images: any = req.files;
  if (images.length < 2 || !productName) {
    return res.status(400).json({ message: "Please Upload Atleast 2 Images" });
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.credits < 5) {
    return res.status(401).json({ message: "Not Enough Credits" });
  } else {
    await prisma.user
      .update({ where: { id: userId }, data: { credits: { decrement: 5 } } })
      .then(() => {
        isCreditDeducted = true;
      });
  }
  try {
    let uploadedImages = await Promise.all(
      images.map(async (item: any) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const project = await prisma.project.create({
      data: {
        name,
        userId,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        targetLength: parseInt(targetLength),
        uploadedImages,
        isGenerating: true,
      },
    });
    tempProjectId = project.id;
    const model = 'gemini-3-pro-image-preview';
    const generationConfig: GenerateContentConfig= {
        maxOutputTokens: 32768,
        temperature: 1,
        topP: 0.95,
        responseModalities: ['IMAGE'],
        imageConfig: {
            aspectRatio: aspectRatio || '9:16',
            imageSize: '1K',
        },
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.OFF,
            },{
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.OFF,
            },{
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.OFF,
            },{
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.OFF,
            }
        ]
    }
    const img1base64 = loadImage(images[0].path, images[0].mimetype);
    const img2base64 = loadImage(images[1].path, images[1].mimetype); 
    const prompt = {
        text: `Combine the person and product into a realistic photo. Make the person naturally hold or usethe product. Match lighting, shadows, scale and perspective.`
    }
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const createVideo = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const getAllPublishedProjects = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const deleteProject = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
