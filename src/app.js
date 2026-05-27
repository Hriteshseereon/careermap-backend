import "dotenv/config";
import cors from "cors";
import express from 'express';
import cookieParser from "cookie-parser";
 import userRoutes from "./modules/user/user.routes.js";
 import authRoutes from "./modules/auth/auth.routes.js";
 import adminAuthRoutes from "./modules/adminauth/adminauth.routes.js";
 import streamRoutes from "./modules/stream/stream.routes.js";
 import instituteRoutes from "./modules/institution/institution.routes.js";
 import categoryRoutes from "./modules/category/category.routes.js";
 import secondcategoryRoutes from "./modules/secondarycategory/secondcategory.routes.js";
 import subcategoryRoutes from "./modules/subcategory/subcategory.routes.js";
 import moduleRoutes from "./modules/modul/module.routes.js";
 import pathTypeRoutes from "./modules/pathtype/pathtype.routes.js";
 import entranceExamRoutes from "./modules/entranceexam/entranceexam.routes.js";
 import detailsRoutes from "./modules/details/details.routes.js";
 import careerPathRoutes from "./modules/careerpath/careerpath.routes.js"
 import mentorRoutes from "./modules/mentor/mentor.routes.js"
 import scholarshipRoutes from "./modules/scholarship/scholarship.routes.js"
 import plansRoutes    from  "./modules/plans/plans.routes.js"
 import quizRoutes   from "./modules/quiz/quiz.routes.js"
  import masterClassRoute from "./modules/masterclass/masterclass.routes.js"
  import studyAbroadRoute from "./modules/studyabroad/studyabroad.routes.js"
//  user portal routes imported here
import userportalRoutes from "./modules/userportal/routes/userPortal.routes.js"
import paymentRoutes from "./modules/userportal/routes/payment.routes.js"
import mentoravailabilityRoute from "./modules/userportal/routes/mentor.routes.js"
import careerlibraryRoutes from "./modules/userportal/routes/careerLibrary.routes.js"
const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8081",
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('app is running......');
});
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/streams", streamRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/secondarycategories", secondcategoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/modules",moduleRoutes);
app.use("/api/path",pathTypeRoutes);
app.use("/api/details",detailsRoutes);
app.use("/api/entranceexam",entranceExamRoutes);
app.use("/api/careerpath",careerPathRoutes);
app.use("/api/mentor",mentorRoutes);
app.use("/api/scholarship",scholarshipRoutes);
app.use("/api/plans",plansRoutes);
app.use("/api/quiz",quizRoutes);
app.use("/api/masterclass",masterClassRoute);
app.use("/api/studyabroad",studyAbroadRoute);
// user portal api 
app.use("/api/user",userportalRoutes);
app.use("/api/user/payment",paymentRoutes);
app.use("/api/mentor",mentoravailabilityRoute);
app.use("/api/careerlibrary",careerlibraryRoutes)
export default app;