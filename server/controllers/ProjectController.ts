import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js";
import { v2 as cloudinary } from "cloudinary";
import { parse } from "node:path";
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import fs from "fs";
import path from "path";
import ai from "../configs/ai.js";
import axios from "axios";
const loadImage = (path: string, mimeType: string) => {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType,
    },
  };
};
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
    const model = "gemini-3-pro-image-preview";
    const generationConfig: GenerateContentConfig = {
      maxOutputTokens: 32768,
      temperature: 1,
      topP: 0.95,
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: aspectRatio || "9:16",
        imageSize: "1K",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.OFF,
        },
      ],
    };
    const img1base64 = loadImage(images[0].path, images[0].mimetype);
    const img2base64 = loadImage(images[1].path, images[1].mimetype);
    const prompt = {
      text: `Create a hyper-realistic, photorealistic image by seamlessly integrating the person and the product into a single natural scene.
The person should naturally hold, interact with, or use the product in a believable way.

Ensure perfect consistency in lighting, shadows, reflections, scale, proportions, and perspective so the image feels indistinguishable from a real professional photoshoot.

Place the subject in high-end professional studio lighting, with soft yet detailed light shaping the face, hands, and product.

The final output must be e-commerce quality, ultra-sharp, clean, and visually stunning — suitable for premium brand marketing, product pages, and advertisements.

The result should feel more real than reality, polished, immersive, and instantly captivating.

User prompt: ${userPrompt}`,
    };
    const response: any = await ai.models.generateContent({
      model,
      contents: [img1base64, img2base64, prompt],
      config: generationConfig,
    });
    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error("Unexpected Response");
    }
    const parts = response.candidates[0].content.parts;
    let finalBuffer: Buffer | null = null;
    for (const part of parts) {
      if (part.inlineData) {
        finalBuffer = Buffer.from(part.inlineData.data, "base64");
      }
    }
    if (!finalBuffer) {
      throw new Error("Image Generation Failed");
    }
    const base64Image = `data:image/png;base64,${finalBuffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      resource_type: "image",
    });
    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        isGenerating: false,
        generatedImage: uploadResult.secure_url,
      },
    });
    res.json({ projectId: project.id });
  } catch (error: any) {
    if (tempProjectId!) {
      await prisma.project.update({
        where: {
          id: tempProjectId,
        },
        data: {
          isGenerating: false,
          error: error.message,
        },
      });
    }
    if (isCreditDeducted) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 5 } },
      });
    }
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const createVideo = async (req: Request, res: Response) => {
  const { userId } = req.auth();
  const { projectId } = req.body;
  let isCreditDeducted = false;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user || user.credits < 10) {
    return res.status(401).json({ message: "Not Enough Credits" });
  }
  await prisma.user
    .update({ where: { id: userId }, data: { credits: { decrement: 10 } } })
    .then(() => {
      isCreditDeducted = true;
    });
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId,
      },
      include: {
        user: true,
      },
    });
    if (!project || project.isGenerating) {
      return res.status(404).json({ message: "Project Is Still Generating" });
    }
    if (project.generatedVideo) {
      return res.status(404).json({ message: "Video Already Generated" });
    }
    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        isGenerating: true,
      },
    });
    const prompt = `
Create a hyper-realistic, cinematic product showcase video where a person naturally presents and interacts with the product: ${project.productName}.
${project.productDescription && `Product description: ${project.productDescription}.`}

The person should confidently demonstrate or use the product in an authentic, engaging manner, as if filmed for a high-end global commercial.
Movements must feel smooth and intentional, with natural body language, realistic gestures, and lifelike facial expressions.

Use professional studio-grade lighting with soft, realistic shadows, accurate reflections, and perfectly balanced exposure.
Maintain true-to-life scale, depth, and perspective so the product feels physically present and premium.

The video must be ultra-smooth, visually breathtaking, and flawlessly polished — suitable for luxury e-commerce, brand advertising, and marketing campaigns.
The final result should feel immersive, emotionally engaging, and more realistic than real life.
`;

    const model = "veo-3.1-generate-preview";
    if(!project.generatedImage){
        throw new Error("Generted Image Not Found");
    }
    const image = await axios.get(project.generatedImage, {
      responseType: "arraybuffer",
    });
    const imageBytes: any = Buffer.from(image.data);
    let operation: any = await ai.models.generateVideos({
        model,
        prompt,
        image: {
            imageBytes: imageBytes.toString("base64"),
            mimeType: "image/png",
        },
        config: {
            aspectRatio: project?.aspectRatio || '9:16',
            numberOfVideos: 1,
            resolution: '720p',
        }
    })
    while(!operation.done){
        console.log('waiting for video generation to finish...');
        await new Promise((resolve) => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({
            operation : operation
        });
    }
    const fileName = `${userId}-${Date.now()}.mp4`;
    const filePath = path.join('videos', fileName);
    fs.mkdirSync('videos', { recursive: true });
    if(!operation.response.generatedVideos){
        throw new Error(operation.response.raiMediaFilteredReasons[0]);
    }
    await ai.files.download({
        file: operation.response.generatedVideos[0].video,
        downloadPath: filePath
    })
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
    });
    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        generatedVideo: uploadResult.secure_url,
        isGenerating: false,
      },
    })
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
