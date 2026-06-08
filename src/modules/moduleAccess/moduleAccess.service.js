import prisma from "../../config/db.js";
import { ModuleAccessRepository } from "./moduleAccess.repository.js";

export const checkModuleAccess = async (
  userId,
  moduleId
) => {

  const module =
    await prisma.module.findUnique({
      where: {
        id: Number(moduleId),
      },
    });
    console.log("MODULE =", module);
  if (!module) {
    throw new Error("Module not found");
  }

  // free module
  if (module.markas_free) {
    return {
      allowed: true,
    };
  }

  // active subscription
const subscription =
  await prisma.subscriptions.findFirst({
    where: {
      userId: Number(userId),
      status: "active",
      endDate: {
        gte: new Date(),
      },
    },

    include: {
      plan: {
        include: {
          modules: true,
        },
      },
    },
  });
console.log("SUBSCRIPTION =", subscription);
if (subscription) {

  const hasAccess =
    subscription.plan.modules.some(
      (m) =>
        m.id === Number(moduleId)
    );

  if (hasAccess) {
    return {
      allowed: true,
    };
  }
}

  // free preview disabled
  if (!module.freePreview) {
    return {
      allowed: false,
      message:
        "Please purchase subscription",
    };
  }

  const existing =
    await ModuleAccessRepository.findAccess(
      userId,
      moduleId
    );

  // first visit
  if (!existing) {

    await ModuleAccessRepository.createAccess(
      userId,
      moduleId
    );

    return {
      allowed: true,
      freePreview: true,
    };
  }

  // second visit
  return {
    allowed: false,
    message:
      "Free preview already used. Please purchase subscription.",
  };
};