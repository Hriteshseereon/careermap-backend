import prisma from "../../config/db.js";

import {
  InstitutionImportRepository,
} from "./institutionImport.repository.js";

import {
  parseInstitutionExcel,
} from "../../utils/excel/institutionExcel.parser.js";

import {
  normalizeValue,
} from "../../utils/excel/institutionExcel.validator.js";

const BATCH_SIZE = 100;

export const uploadInstitutionExcel = async (
  file
) => {
  if (!file) {
    return {
      success: false,
      message: "Excel file is required",
    };
  }

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  if (
    !allowedTypes.includes(file.mimetype)
  ) {
    return {
      success: false,
      message:
        "Only Excel files are allowed",
    };
  }

  const rows =
    parseInstitutionExcel(file.buffer);

  if (!rows.length) {
    return {
      success: false,
      message: "Excel file is empty",
    };
  }

  const importJob =
    await InstitutionImportRepository.create({
      fileName: file.originalname,
      totalRows: rows.length,
      status: "processing",
    });

  // Start processing
  processInstitutionRows(
    rows,
    importJob.id
  );

  return {
    success: true,
    message:
      "Institution import started",
    data: {
      importId: importJob.id,
      totalRows: rows.length,
    },
  };
};


const processInstitutionRows = async (
  rows,
  importId
) => {
  try {
    /**
     * --------------------------------
     * 1. Load master data once
     * --------------------------------
     */

    // const [
    //   categories,
    //   secondCategories,
    //   subcategories,
    // ] = await Promise.all([
    //   prisma.category.findMany(),
    //   prisma.secondcategory.findMany(),
    //   prisma.subcategory.findMany(),
    // ]);
    const categories =
  await prisma.category.findMany();

const secondCategories =
  await prisma.secondcategory.findMany();

const subcategories =
  await prisma.subcategory.findMany();
    /**
     * --------------------------------
     * 2. Create lookup maps
     * --------------------------------
     */

    const categoryMap = new Map();

    categories.forEach((category) => {
      categoryMap.set(
        normalizeValue(category.title),
        category.id
      );
    });

    const secondCategoryMap =
      new Map();

    secondCategories.forEach(
      (secondCategory) => {
        const key = [
          secondCategory.categoryId,
          normalizeValue(
            secondCategory.name
          ),
        ].join("|");

        secondCategoryMap.set(
          key,
          secondCategory.id
        );
      }
    );

    const subcategoryMap = new Map();

    subcategories.forEach(
      (subcategory) => {
        const key = [
          subcategory.categoryId,
          subcategory.secondcategoryId,
          normalizeValue(
            subcategory.title
          ),
        ].join("|");

        subcategoryMap.set(
          key,
          subcategory.id
        );
      }
    );

    /**
     * --------------------------------
     * 3. Prepare rows
     * --------------------------------
     */

    const validRows = [];

    let failed = 0;
    let skipped = 0;

    for (
      let index = 0;
      index < rows.length;
      index++
    ) {
      const row = rows[index];

      const career =
        normalizeValue(
          row["CATEGORY"]
        );

      const secondaryCategory =
        normalizeValue(
          row["SECONDARY CATEGORY"]
        );

      const subCategory =
        normalizeValue(
          row["SUB CATEGORY"]
        );

      const instituteName =
        String(
          row["INSTITUTE"] || ""
        ).trim();

      /**
       * Institute name required
       */
      if (!instituteName) {
        failed++;
        continue;
      }

      /**
       * Category
       */
      const categoryId =
        categoryMap.get(career);

      if (!categoryId) {
        failed++;
        continue;
      }

      /**
       * Secondary category
       */
      let secondcategoryId = null;

      if (secondaryCategory) {
        const key = [
          categoryId,
          secondaryCategory,
        ].join("|");

        secondcategoryId =
          secondCategoryMap.get(key);

        if (!secondcategoryId) {
          failed++;
          continue;
        }
      }

      /**
       * Subcategory
       */
      let subcategoryId = null;

      if (subCategory) {
        const key = [
          categoryId,
          secondcategoryId,
          subCategory,
        ].join("|");

        subcategoryId =
          subcategoryMap.get(key);

        if (!subcategoryId) {
          failed++;
          continue;
        }
      }

      validRows.push({
        categoryId,
        secondcategoryId,
        subcategoryId,

        name: instituteName,

        logo:
          String(
            row["LOGO"] || ""
          ).trim() || null,

        address:
          String(
            row["ADDRESS"] || ""
          ).trim() || null,

        url:
          String(
            row["WEBSITE LINK"] || ""
          ).trim() || null,

        countruy:
          String(
            row["COUNTRY"] || ""
          ).trim() || null,

        state:
          String(
            row["STATE"] || ""
          ).trim() || null,

        institute_type:
          String(
            row["TYPE"] || ""
          ).trim() || null,

        course_offered: [],

        is_top: false,
      });
    }

    /**
     * --------------------------------
     * 4. Insert batches
     * --------------------------------
     */

    let successful = 0;

    for (
      let i = 0;
      i < validRows.length;
      i += BATCH_SIZE
    ) {
      const batch =
        validRows.slice(
          i,
          i + BATCH_SIZE
        );
//         console.log("========== INSERTING INSTITUTIONS ==========");
// console.log("BATCH:", batch);
// console.log("BATCH LENGTH:", batch.length);
//       const result =
//         await prisma.institutions.createMany({
//           data: batch,
//           skipDuplicates: true,
//         });
//         console.log("========== CREATE MANY RESULT ==========");
// console.log(result);
// const count = await prisma.institutions.count();

// console.log(
//   "TOTAL INSTITUTIONS IN DB:",
//   count
// );

console.log(
  `========== INSERTING BATCH ==========
Batch start: ${i}
Batch size: ${batch.length}`
);

const result =
  await prisma.institutions.createMany({
    data: batch,
    skipDuplicates: true,
  });

console.log("Inserted:", result.count);
      successful += result.count;

      await InstitutionImportRepository.update(
        importId,
        {
          processed: Math.min(
            i + BATCH_SIZE,
            validRows.length
          ),
          successful,
          failed,
          skipped,
        }
      );
    }

    /**
     * --------------------------------
     * 5. Complete
     * --------------------------------
     */

    await InstitutionImportRepository.update(
      importId,
      {
        processed: rows.length,
        successful,
        failed,
        skipped,
        status: "completed",
      }
    );
  } catch (error) {
    console.error(
      "Institution import error:",
      error
    );

    await InstitutionImportRepository.update(
      importId,
      {
        status: "failed",
      }
    );
  }
};