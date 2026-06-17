import jwt from "jsonwebtoken";

export const protectInstitute =
async(req,res,next)=>{

  try{

    const token =
      req.headers.authorization
      ?.split(" ")[1];

    if(!token){
      return res.status(401)
      .json({
        message:"No token"
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.INSTITUTE_SECRET
      );

    if(
      decoded.type !==
      "institute"
    ){
      return res.status(401)
      .json({
        message:"Unauthorized"
      });
    }

    req.institute =
      decoded;

    next();

  }catch(error){

    return res.status(401)
    .json({
      message:"Unauthorized"
    });
  }
};