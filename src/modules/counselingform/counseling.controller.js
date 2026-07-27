import {
createCounseling,
getCounselings,
getCounselingById,
updateCounseling,
deleteCounseling,
 generateCounselingReport
} from "./counseling.services.js";
import PDFDocument from "pdfkit";


const LEFT_LOGO_URL =
  "https://res.cloudinary.com/dfm1xhhwx/image/upload/v1784782926/logo_white_pkzdz0.png";
const RIGHT_LOGO_URL =
  "https://res.cloudinary.com/dfm1xhhwx/image/upload/v1784783276/logo_ulbkag.png";
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
 
    // Fetch the two logos (requires Node 18+ for global fetch, or swap in axios/node-fetch)
    let leftLogoBuf = null;
    let rightLogoBuf = null;
    try {
      const [l, r] = await Promise.all([
        fetch(LEFT_LOGO_URL).then((r) => r.arrayBuffer()),
        fetch(RIGHT_LOGO_URL).then((r) => r.arrayBuffer()),
      ]);
      leftLogoBuf = Buffer.from(l);
      rightLogoBuf = Buffer.from(r);
    } catch (e) {
      console.error("Logo fetch failed:", e.message);
    }
 
    const doc = new PDFDocument({ size: "A4", margin: 40 });
 
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Counseling_Report_${data.id}.pdf`
    );
 
    doc.pipe(res);
 
    // ===========================
    // LAYOUT CONSTANTS
    // ===========================
 
    const MARGIN = 40;
    const PAGE_WIDTH = doc.page.width;
    const PAGE_HEIGHT = doc.page.height;
    const TABLE_WIDTH = PAGE_WIDTH - MARGIN * 2; // 515
    const LEFT = MARGIN;
    const RIGHT = MARGIN + TABLE_WIDTH;
 
    const BLACK = "#000000";
    const GRAY = "#666666";
    const HIGHLIGHT = "#1d4ed8";
 
    const checkPageBreak = (needed) => {
      if (doc.y + needed > PAGE_HEIGHT - MARGIN - 20) {
        doc.addPage();
        doc.y = MARGIN;
      }
    };
 
    // ===========================
    // HEADER (logos + title)
    // ===========================
 
    if (leftLogoBuf) {
      try {
        doc.image(leftLogoBuf, LEFT, 20, { width: 70 });
      } catch (e) {}
    }
    if (rightLogoBuf) {
      try {
        doc.image(rightLogoBuf, RIGHT - 70, 20, { width: 70 });
      } catch (e) {}
    }
 
    doc
      .fillColor(BLACK)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("MINI \u2013 CAREER COUNSELING", LEFT, 60, {
        width: TABLE_WIDTH,
        align: "center",
      });
 
    doc.y = 105;
 
    // ===========================
    // Generic two-column bordered row
    // ===========================
 
    const twoColRow = (label, value, labelWidth, opts = {}) => {
      const valueWidth = TABLE_WIDTH - labelWidth;
      const labelFont = opts.labelFont || "Helvetica-Bold";
      const valueFont = opts.valueFont || "Helvetica";
      const fontSize = opts.fontSize || 10;
 
      doc.font(labelFont).fontSize(fontSize);
      const labelHeight = doc.heightOfString(label, { width: labelWidth - 10 });
      doc.font(valueFont).fontSize(fontSize);
      const valueHeight = value
        ? doc.heightOfString(String(value), { width: valueWidth - 10 })
        : fontSize;
 
      const rowHeight =
        Math.max(labelHeight, valueHeight, opts.minHeight || 20) + 10;
 
      checkPageBreak(rowHeight);
 
      const y = doc.y;
 
      doc.rect(LEFT, y, labelWidth, rowHeight).stroke();
      doc.rect(LEFT + labelWidth, y, valueWidth, rowHeight).stroke();
 
      doc
        .font(labelFont)
        .fontSize(fontSize)
        .fillColor(BLACK)
        .text(label, LEFT + 5, y + 5, { width: labelWidth - 10 });
 
      doc
        .font(valueFont)
        .fontSize(fontSize)
        .fillColor(BLACK)
        .text(value ? String(value) : "-", LEFT + labelWidth + 5, y + 5, {
          width: valueWidth - 10,
        });
 
      doc.y = y + rowHeight;
    };
 
    // ===========================
    // Student Information table
    // ===========================
 
    const LABEL_W1 = 160;
 
    twoColRow("Name of the Counselee", data.studentName, LABEL_W1);
    twoColRow("Class", data.class, LABEL_W1);
    twoColRow("Stream (if 11th / 12th)", data.stream, LABEL_W1);
    twoColRow("School", data.school, LABEL_W1);
    twoColRow(
      "Date",
      data.counselingDate
        ? new Date(data.counselingDate).toLocaleDateString()
        : "-",
      LABEL_W1
    );
    twoColRow("Phone number", data.phoneNumber, LABEL_W1);
    twoColRow("Gmail Id", data.email, LABEL_W1);
 
    doc.y += 12;
 
    // ===========================
    // PROBING STATEMENTS / RESPONSE table
    // ===========================
 
    const LABEL_W2 = 200;
 
    checkPageBreak(24);
    {
      const y = doc.y;
      const rowH = 22;
      doc.rect(LEFT, y, LABEL_W2, rowH).stroke();
      doc.rect(LEFT + LABEL_W2, y, TABLE_WIDTH - LABEL_W2, rowH).stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor(BLACK)
        .text("PROBING STATEMENTS", LEFT + 5, y + 6, {
          width: LABEL_W2 - 10,
        });
      doc.text("RESPONSE", LEFT + LABEL_W2 + 5, y + 6, {
        width: TABLE_WIDTH - LABEL_W2 - 10,
      });
      doc.y = y + rowH;
    }
 
    twoColRow("Occupation of Father", data.fatherOccupation, LABEL_W2);
    twoColRow("Occupation of Mother", data.motherOccupation, LABEL_W2);
    twoColRow(
      "No. of Sibling",
      data.siblingCount !== undefined && data.siblingCount !== null
        ? String(data.siblingCount)
        : "-",
      LABEL_W2
    );
 
    // Marks
    const marks = data.marks || {};
    const markEntries = Object.entries(marks);
    const marksText =
      markEntries.length > 0
        ? markEntries.map(([subject, mark]) => `${subject} - ${mark}`).join("\n")
        : "-";
    twoColRow("Latest Score (if 11th / 12th) SCIENCE", marksText, LABEL_W2);
 
    // Dream career
    const careerText = [
      `Option 1 - ${data.dreamCareerOption1 || ""}`,
      `Option 2 - ${data.dreamCareerOption2 || ""}`,
      `Option 3 - ${data.dreamCareerOption3 || ""}`,
    ].join("\n");
    twoColRow("Student's Dream Career", careerText, LABEL_W2);
 
    twoColRow(
      "What do your parents want you to become?",
      data.parentsExpectation,
      LABEL_W2
    );
 
    // Category row with A-E options, selected one highlighted
    const categoryOptions = [
      "(A) Absolutely clear about future career options, need only the right direction and route",
      "(B) Confused between two/three career options",
      "(C) Parents and the student differ on career options",
      "(D) Changing career options quite frequently",
      "(E) Vague knowledge about Career options",
    ];
    const selectedCategory = (data.category || "").toString().trim().toUpperCase();
 
    {
      const label = "Which category does your counselee belong to?";
      const labelWidth = LABEL_W2;
      const valueWidth = TABLE_WIDTH - labelWidth;
 
      doc.font("Helvetica-Bold").fontSize(10);
      const labelHeight = doc.heightOfString(label, { width: labelWidth - 10 });
 
      doc.font("Helvetica").fontSize(9);
      let valueHeight = 0;
      categoryOptions.forEach((opt) => {
        valueHeight += doc.heightOfString(opt, { width: valueWidth - 10 }) + 2;
      });
 
      const rowHeight = Math.max(labelHeight, valueHeight, 20) + 10;
      checkPageBreak(rowHeight);
 
      const y = doc.y;
      doc.rect(LEFT, y, labelWidth, rowHeight).stroke();
      doc.rect(LEFT + labelWidth, y, valueWidth, rowHeight).stroke();
 
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(BLACK)
        .text(label, LEFT + 5, y + 5, { width: labelWidth - 10 });
 
      let optY = y + 5;
      categoryOptions.forEach((opt, idx) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C, D, E
        const isSelected =
          selectedCategory === letter ||
          selectedCategory.startsWith(`(${letter})`) ||
          selectedCategory.startsWith(letter + ")");
        doc
          .font(isSelected ? "Helvetica-Bold" : "Helvetica")
          .fontSize(9)
          .fillColor(isSelected ? HIGHLIGHT : BLACK)
          .text(opt, LEFT + labelWidth + 5, optY, { width: valueWidth - 10 });
        optY += doc.heightOfString(opt, { width: valueWidth - 10 }) + 2;
      });
 
      doc.y = y + rowHeight;
    }
 
    // Observation & Recommendation
    {
      const label = "Observation & Recommendation/ Suggestion";
      const labelWidth = LABEL_W2;
      const valueWidth = TABLE_WIDTH - labelWidth;
      const text = data.observation || "No Observation Available";
 
      doc.font("Helvetica-Bold").fontSize(10);
      const labelHeight = doc.heightOfString(label, { width: labelWidth - 10 });
      doc.font("Helvetica").fontSize(10);
      const textHeight = doc.heightOfString(text, { width: valueWidth - 10 });
 
      const rowHeight = Math.max(labelHeight, textHeight, 80) + 10;
      checkPageBreak(rowHeight);
 
      const y = doc.y;
      doc.rect(LEFT, y, labelWidth, rowHeight).stroke();
      doc.rect(LEFT + labelWidth, y, valueWidth, rowHeight).stroke();
 
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(BLACK)
        .text(label, LEFT + 5, y + 5, { width: labelWidth - 10 });
 
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(BLACK)
        .text(text, LEFT + labelWidth + 5, y + 5, {
          width: valueWidth - 10,
          align: "justify",
        });
 
      doc.y = y + rowHeight;
    }
 
    doc.y += 15;
 
    // ===========================
    // Counselor / Psychometric footer table
    // ===========================
 
    twoColRow("Name of the CC", data.counselorName, LABEL_W1);
 
    {
      const col1 = 160;
      const col2 = (TABLE_WIDTH - col1) / 2;
      const col3 = TABLE_WIDTH - col1 - col2;
      const rowH = 26;
      checkPageBreak(rowH);
      const y = doc.y;
 
      doc.rect(LEFT, y, col1, rowH).stroke();
      doc.rect(LEFT + col1, y, col2, rowH).stroke();
      doc.rect(LEFT + col1 + col2, y, col3, rowH).stroke();
 
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(BLACK)
        .text("Psychometric Test", LEFT + 5, y + 8, { width: col1 - 10 });
 
      const isRecommended = !!data.psychometricRecommended;
 
      doc
        .font(isRecommended ? "Helvetica-Bold" : "Helvetica")
        .fillColor(isRecommended ? HIGHLIGHT : BLACK)
        .text(
          `${isRecommended ? "\u2611" : "\u2610"} Recommended`,
          LEFT + col1 + 5,
          y + 8,
          { width: col2 - 10 }
        );
 
      doc
        .font(!isRecommended ? "Helvetica-Bold" : "Helvetica")
        .fillColor(!isRecommended ? HIGHLIGHT : BLACK)
        .text(
          `${!isRecommended ? "\u2611" : "\u2610"} Not Recommended`,
          LEFT + col1 + col2 + 5,
          y + 8,
          { width: col3 - 10 }
        );
 
      doc.y = y + rowH;
    }
 
    doc.y += 30;
 
    // Signature line
    checkPageBreak(30);
    doc
      .strokeColor("#999")
      .moveTo(RIGHT - 160, doc.y)
      .lineTo(RIGHT, doc.y)
      .stroke();
    doc
      .fontSize(9)
      .fillColor(GRAY)
      .text("Authorized Signature", RIGHT - 160, doc.y + 5, {
        width: 160,
        align: "center",
      });
 
    // Footer
    doc
      .fontSize(8)
      .fillColor(GRAY)
      .text(
        "Generated by Career Counseling Management System",
        LEFT,
        PAGE_HEIGHT - 30,
        { width: TABLE_WIDTH, align: "center" }
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