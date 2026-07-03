import {
createCounseling,
getCounselings,
getCounselingById,
updateCounseling,
deleteCounseling,
 generateCounselingReport
} from "./counseling.services.js";
import PDFDocument from "pdfkit";
export const createCounselingController = async (req, res) => {
const result = await createCounseling(req.body);
res.status(result.success ? 201 : 400).json(result);
};

export const getCounselingsController = async (req, res) => {
const result = await getCounselings();
res.status(200).json(result);
};

export const getCounselingByIdController = async (req, res) => {
const result = await getCounselingById(req.params.id);
res.status(result.success ? 200 : 404).json(result);
};

export const updateCounselingController = async (req, res) => {
const result = await updateCounseling(req.params.id, req.body);
res.status(result.success ? 200 : 400).json(result);
};

export const deleteCounselingController = async (req, res) => {
const result = await deleteCounseling(req.params.id);
res.status(result.success ? 200 : 400).json(result);
};

export const downloadCounselingReportController = async (req, res) => {
  try {
    const result = await generateCounselingReport(req.params.id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    const data = result.data;

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Counseling_Report_${data.id}.pdf`
    );

    doc.pipe(res);

    // ===========================
    // COLORS
    // ===========================

    const BLUE = "#2563eb";
    const LIGHT = "#eff6ff";
    const BORDER = "#d1d5db";
    const TEXT = "#374151";

    // ===========================
    // HEADER
    // ===========================

    doc.rect(0, 0, doc.page.width, 80).fill(BLUE);

    doc
      .fillColor("white")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("CAREER COUNSELING REPORT", 0, 28, {
        align: "center",
      });

    doc
      .fontSize(10)
      .text(`Generated : ${new Date().toLocaleDateString()}`, {
        align: "center",
      });

    doc.moveDown(3);

    // ===========================
    // Helper Functions
    // ===========================

    const section = (title) => {
      doc.moveDown();

      doc
        .fillColor(LIGHT)
        .roundedRect(40, doc.y, 515, 24, 5)
        .fill();

      doc
        .fillColor(BLUE)
        .font("Helvetica-Bold")
        .fontSize(13)
        .text(title, 50, doc.y + 6);

      doc.moveDown(1.8);
    };

    const row = (label, value) => {
      doc
        .font("Helvetica-Bold")
        .fillColor("black")
        .fontSize(11)
        .text(label, 50, doc.y, {
          continued: true,
        });

      doc
        .font("Helvetica")
        .fillColor(TEXT)
        .text(value || "-");

      doc.moveDown(0.2);
    };

    // ===========================
    // Student Information
    // ===========================

    section("Student Information");

    row("Student Name : ", data.studentName);
    row("Class : ", data.class);
    row("Stream : ", data.stream);
    row("School : ", data.school);
    row(
      "Counseling Date : ",
      data.counselingDate
        ? new Date(data.counselingDate).toLocaleDateString()
        : "-"
    );
    row("Phone : ", data.phoneNumber);
    row("Email : ", data.email);

    // ===========================
    // Family Information
    // ===========================

    section("Family Information");

    row("Father Occupation : ", data.fatherOccupation);
    row("Mother Occupation : ", data.motherOccupation);
    row("No. of Siblings : ", data.siblingCount);

    // ===========================
    // Academic Performance
    // ===========================

    section("Academic Performance");

    const marks = data.marks || {};

    doc
      .fillColor(BLUE)
      .font("Helvetica-Bold")
      .fontSize(11);

    doc.text("Subject", 60, doc.y);
    doc.text("Marks", 420, doc.y);

    doc.moveDown(0.5);

    doc
      .strokeColor(BORDER)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(0.5);

    Object.entries(marks).forEach(([subject, mark]) => {
      doc
        .fillColor("black")
        .font("Helvetica")
        .text(subject, 60, doc.y);

      doc.text(String(mark), 430, doc.y);

      doc.moveDown(0.3);
    });

    // ===========================
    // Career Goals
    // ===========================

    section("Career Aspirations");

    row("Option 1 : ", data.dreamCareerOption1);
    row("Option 2 : ", data.dreamCareerOption2);
    row("Option 3 : ", data.dreamCareerOption3);

    row("Parents Expectation : ", data.parentsExpectation);

    // ===========================
    // Counseling Details
    // ===========================

    section("Counseling Details");

    row("Category : ", data.category);

    row(
      "Psychometric Test : ",
      data.psychometricRecommended ? "Recommended" : "Not Recommended"
    );

    // ===========================
    // Observation
    // ===========================

    section("Observation & Recommendation");

    doc
      .roundedRect(45, doc.y, 505, 100, 5)
      .fillAndStroke("#f9fafb", BORDER);

    doc
      .fillColor(TEXT)
      .font("Helvetica")
      .fontSize(11)
      .text(
        data.observation || "No Observation Available",
        60,
        doc.y + 15,
        {
          width: 470,
          align: "justify",
        }
      );

    doc.moveDown(7);

    // ===========================
    // Counselor
    // ===========================

    section("Counselor");

    row("Counselor Name : ", data.counselorName);

    doc.moveDown(2);

    doc
      .strokeColor("#999")
      .moveTo(380, doc.y)
      .lineTo(540, doc.y)
      .stroke();

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Authorized Signature", 405, doc.y + 5);

    // ===========================
    // Footer
    // ===========================

    doc.fontSize(9).fillColor("gray");

    doc.text(
      "Generated by Career Counseling Management System",
      0,
      780,
      {
        align: "center",
      }
    );

    doc.end();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};