import "dotenv/config";
import cors from "cors";
import express from 'express';
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
const app = express();
app.use(express.json());
app.use(cors({
   origin: "http://localhost:5173", // your frontend URL
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
export default app;