import * as service from "./entranceexam.service.js";

export const create = async (req,res)=>{
  res.json(await service.createExam(req.body));
};

export const getAll = async (req,res)=>{
  res.json(await service.getAllExam());
};

export const getById = async (req,res)=>{
  res.json(await service.getExamById(req.params.id));
};

export const update = async (req,res)=>{
  res.json(await service.updateExam(req.params.id, req.body));
};

export const remove = async (req,res)=>{
  res.json(await service.deleteExam(req.params.id));
};