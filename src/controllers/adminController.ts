import { Request, Response } from "express";
import ExpertTip from "../models/expertTipModel";
import VIPContent from "../models/vipContentModel";

export const postExpertTip = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const tip = await ExpertTip.create({
      title,
      content,
      author: req.user?._id,
    });
    return res.status(201).json({ message: "Expert tip posted", tip });
  } catch (err) {
    return res.status(500).json({ message: "Failed to post expert tip" });
  }
};

export const postVIPContent = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const vipContent = await VIPContent.create({
      title,
      content,
      author: req.user?._id,
    });
    return res.status(201).json({ message: "VIP content posted", vipContent });
  } catch (err) {
    return res.status(500).json({ message: "Failed to post VIP content" });
  }
};

export const getExpertTips = async (_req: Request, res: Response) => {
  try {
    const tips = await ExpertTip.find().sort({ createdAt: -1 });
    return res.status(200).json({ tips });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch expert tips" });
  }
};

export const getVIPContent = async (_req: Request, res: Response) => {
  try {
    const vipContent = await VIPContent.find().sort({ createdAt: -1 });
    return res.status(200).json({ vipContent });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch VIP content" });
  }
};

export const deleteExpertTip = async (req: Request, res: Response) => {
  try {
    const tip = await ExpertTip.findByIdAndDelete(req.params.id);
    if (!tip) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Expert tip deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete expert tip" });
  }
};

export const deleteVIPContent = async (req: Request, res: Response) => {
  try {
    const vip = await VIPContent.findByIdAndDelete(req.params.id);
    if (!vip) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "VIP content deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete VIP content" });
  }
};

export const updateExpertTip = async (req: Request, res: Response) => {
  try {
    const tip = await ExpertTip.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    if (!tip) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Expert tip updated", tip });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update expert tip" });
  }
};

export const updateVIPContent = async (req: Request, res: Response) => {
  try {
    const vip = await VIPContent.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    if (!vip) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "VIP content updated", vip });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update VIP content" });
  }
};
