import { careerPathRepository } from "./careerpath.repository.js";

export const createCareerPath = async (body)=>{
  try{
    const data = await careerPathRepository.create(body);
    return {success:true,data};
  }catch(err){
    return {success:false,message:err.message};
  }
};

export const getAllCareerPath = async ()=>{
  return {success:true,data:await careerPathRepository.findAll()};
};

export const getCareerPathById = async (id)=>{
  const data = await careerPathRepository.findById(Number(id));
  return data ? {success:true,data}:{success:false};
};

export const updateCareerPath = async (id,body)=>{
  try{
    const data = await careerPathRepository.update(Number(id),body);
    return {success:true,data};
  }catch(err){
    return {success:false,message:err.message};
  }
};

export const deleteCareerPath = async (id)=>{
  await careerPathRepository.delete(Number(id));
  return {success:true};
};