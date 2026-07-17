export const isAssessmentModule = (module) => {
  const title = (module?.title || "").toLowerCase();
  const url = (module?.url || "").toLowerCase();

  return (
    title.includes("assessment") ||
    title.includes("psychometric") ||
    url.includes("assessment") ||
    url.includes("psychometric")
  );
};

export const canAccessAssessment = (user) =>
  Boolean(user?.isInstituteStudent);
