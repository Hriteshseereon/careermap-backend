import { mysqlConnection } from "../config/mysql.js";
import prisma from "../../config/db.js";
import { loadLocationLookup } from "../helpers/locationLookup.js";
import { instituteTypeMap } from "../helpers/instituteTypeMap.js";

async function migrateInstitutions() {
  try {
    // ==========================
    // Read MySQL Data
    // ==========================

    const [rows] = await mysqlConnection.query(`
      SELECT *
      FROM institutions
      ORDER BY id
    `);

    console.log("========================================");
    console.log("Total Institutions :", rows.length);
    console.log("========================================");

    // ==========================
    // Load Location Lookup
    // ==========================

    const {
      countryMap,
      stateMap,
      districtMap,
    } = await loadLocationLookup();

    // ==========================
    // Current PostgreSQL Records
    // ==========================

    const count = await prisma.institutions.count();

    console.log("\nCurrent PostgreSQL Records :", count);

    // ==========================
    // Delete Existing Data
    // ==========================

    if (count > 0) {
      await prisma.institutions.deleteMany();

      console.log("Old Institutions Deleted.");
    }

    // ==========================
    // Test Migration
    // ==========================

    console.log("\n🚀 Starting Test Migration (10 Records)...");

    let success = 0;
    let failed = 0;

    for (const row of rows) {
      try {
        await prisma.institutions.create({
          data: {
            name: row.name,

            logo:  null,

            address: row.address || null,

            admission_process:
              row.admission_process || null,

            tentative_date:
              row.tentative_date || null,

            institute_type:
              instituteTypeMap[row.institute_type] ??
              null,

            url: row.url || null,

            countruy:
              countryMap[row.country_id] ?? null,

            state:
              stateMap[row.state_id] ?? null,

            district:
              districtMap[row.dist_id] ?? null,

            categoryId: null,

            secondcategoryId: null,

            subcategoryId: null,

            about: null,

            course_offered: [],

            is_top: Boolean(row.is_top),

            createdAt: row.created_at,

            updatedAt: row.updated_at,
          },
        });

        success++;

       if (success % 50 === 0) {
  console.log(`✅ ${success} Institutions Migrated...`);
}
      } catch (err) {
        failed++;

        console.log(`❌ Failed : ${row.name}`);
        console.log(err.message);
      }
    }

    console.log("\n========================================");
    console.log("Migration Completed");
    console.log("========================================");
    console.log("Success :", success);
    console.log("Failed  :", failed);
  } catch (error) {
    console.error(error);
  } finally {
    await mysqlConnection.end();
    await prisma.$disconnect();
  }
}

migrateInstitutions();