// ============================================================
// ASSESSMENT SCORING ENGINE
// ============================================================

const INTEREST_FACETS = [
  "R",
  "I",
  "A",
  "S",
  "E",
  "C"
];

const PERSONALITY_FACETS = [
  "O",
  "Cn",
  "Ex",
  "Ag",
  "ES"
];

const VALUE_FACETS = [
  "OC",
  "SE",
  "CO",
  "ST"
];

const VARK_FACETS = [
  "V",
  "A",
  "Rd",
  "K"
];

const GOAL_FACETS = [
  "L",
  "S"
];

const APTITUDE_FACETS = [
  "Mech",
  "Log",
  "Verb",
  "Spat",
  "Num",
  "Voc"
];


// ============================================================
// HELPERS
// ============================================================

const reverseValue = (question, value) => {

  if (question.reverse) {
    return 6 - value;
  }

  return value;
};


const normalizeLikert = (mean) => {

  return (mean - 1) / 4;

};


// ============================================================
// LIKERT FACET
// ============================================================

const calculateLikertFacet = (
  questions,
  answers,
  sectionCode,
  facet
) => {

  const facetQuestions = questions.filter(
    (question) =>
      question.section.code === sectionCode &&
      question.facet === facet
  );

  if (!facetQuestions.length) {
    return 0;
  }

  const values = [];

  for (const question of facetQuestions) {

    const answer = answers.find(
      (a) =>
        a.questionId === question.id
    );

    if (!answer) {
      throw new Error(
        `Missing answer for question ${question.itemId}`
      );
    }

    if (
      answer.likertValue === null ||
      answer.likertValue === undefined
    ) {
      throw new Error(
        `Invalid Likert answer for ${question.itemId}`
      );
    }

    const value = reverseValue(
      question,
      Number(answer.likertValue)
    );

    values.push(value);
  }

  const mean =
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length;

  return normalizeLikert(mean);
};


// ============================================================
// APTITUDE FACET
// ============================================================

const calculateAptitudeFacet = (
  questions,
  answers,
  facet
) => {

  const facetQuestions = questions.filter(
    (question) =>
      question.section.code === "aptitude" &&
      question.facet === facet
  );

  if (!facetQuestions.length) {
    return 0;
  }

  let correct = 0;

  for (const question of facetQuestions) {

    const answer = answers.find(
      (a) =>
        a.questionId === question.id
    );

    if (!answer) {
      continue;
    }

    if (!answer.selectedOptionId) {
      continue;
    }

    const selectedOption =
      question.options.find(
        (option) =>
          option.id ===
          answer.selectedOptionId
      );

    if (
      selectedOption &&
      selectedOption.isCorrect
    ) {
      correct++;
    }
  }

  return correct /
    facetQuestions.length;
};


// ============================================================
// COMPLETE SCORE CALCULATION
// ============================================================

export const calculateScores = (
  questions,
  answers
) => {

  const scores = {};

  // -------------------------------
  // INTEREST
  // -------------------------------

  for (const facet of INTEREST_FACETS) {

    scores[facet] =
      calculateLikertFacet(
        questions,
        answers,
        "interest",
        facet
      );

  }


  // -------------------------------
  // PERSONALITY
  // -------------------------------

  for (const facet of PERSONALITY_FACETS) {

    scores[facet] =
      calculateLikertFacet(
        questions,
        answers,
        "personality",
        facet
      );

  }


  // -------------------------------
  // VALUES
  // -------------------------------

  for (const facet of VALUE_FACETS) {

    scores[facet] =
      calculateLikertFacet(
        questions,
        answers,
        "values",
        facet
      );

  }


  // -------------------------------
  // VARK
  // -------------------------------

  scores.vark = {};

  for (const facet of VARK_FACETS) {

    scores.vark[facet] =
      calculateLikertFacet(
        questions,
        answers,
        "learning_style",
        facet
      );

  }


  // -------------------------------
  // GOALS
  // -------------------------------

  scores.goalLong =
    calculateLikertFacet(
      questions,
      answers,
      "goal_orientation",
      "L"
    );

  scores.goalShort =
    calculateLikertFacet(
      questions,
      answers,
      "goal_orientation",
      "S"
    );


  // -------------------------------
  // APTITUDE
  // -------------------------------

  for (const facet of APTITUDE_FACETS) {

    scores[facet] =
      calculateAptitudeFacet(
        questions,
        answers,
        facet
      );

  }

  return scores;
};


// ============================================================
// HOLLAND CODE
// ============================================================

export const calculateHollandCode = (
  scores
) => {

  return INTEREST_FACETS
    .map((facet) => ({
      facet,
      score: scores[facet] || 0
    }))
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 3)
    .map((item) => item.facet)
    .join("");
};


// ============================================================
// WEIGHTED COMPONENT
// ============================================================

const weightedComponent = (
  weights,
  scores,
  facets
) => {

  let numerator = 0;
  let denominator = 0;

  for (const facet of facets) {

    const weight =
      Number(weights[facet] || 0);

    const score =
      Number(scores[facet] || 0);

    numerator +=
      weight * score;

    denominator += weight;
  }

  if (!denominator) {
    return 0;
  }

  return numerator /
    denominator;
};


// ============================================================
// CAREER CLUSTER MATCH
// ============================================================

export const calculateClusterMatches = (
  scores,
  clusters
) => {

  const results = clusters.map(
    (cluster) => {

      const weights = {};

      for (
        const weight
        of cluster.weights
      ) {

        weights[weight.facet] =
          Number(weight.weight);

      }

      const fitI =
        weightedComponent(
          weights,
          scores,
          INTEREST_FACETS
        );

      const fitP =
        weightedComponent(
          weights,
          scores,
          PERSONALITY_FACETS
        );

      const fitV =
        weightedComponent(
          weights,
          scores,
          VALUE_FACETS
        );

      const fitA =
        weightedComponent(
          weights,
          scores,
          APTITUDE_FACETS
        );


      // Current HTML logic:
      //
      // Interest  = 35%
      // Aptitude  = 30%
      // Personality = 20%
      // Values = 15%

      const match =
        0.35 * fitI +
        0.30 * fitA +
        0.20 * fitP +
        0.15 * fitV;


      return {
        clusterId: cluster.id,
        code: cluster.code,
        name: cluster.name,

        match,

        fitI,
        fitP,
        fitV,
        fitA
      };

    }
  );


  return results.sort(
    (a, b) =>
      b.match - a.match
  );
};