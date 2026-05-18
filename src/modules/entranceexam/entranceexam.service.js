import { entranceExamRepository } from "./entranceexam.repository.js";

export const createExam = async (body)=>{
  try{
    return {success:true,data:await entranceExamRepository.create(body)};
  }catch(err){
    return {success:false,message:err.message};
  }
};

export const getAllExam = async ()=>{
  return {success:true,data:await entranceExamRepository.findAll()};
};

export const getExamById = async (id)=>{
  const data = await entranceExamRepository.findById(Number(id));
  return data ? {success:true,data}:{success:false};
};

export const updateExam = async (id,body)=>{
  try{
    return {success:true,data:await entranceExamRepository.update(Number(id),body)};
  }catch(err){
    return {success:false,message:err.message};
  }
};

export const deleteExam = async (id)=>{
  await entranceExamRepository.delete(Number(id));
  return {success:true};
};