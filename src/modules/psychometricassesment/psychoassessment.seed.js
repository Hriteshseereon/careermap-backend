import prisma from "../../config/db.js";

export const DEFAULT_CAREER_CLUSTERS = [
  {
    code: "AGR",
    name: "Agriculture",
    hollandCode: "RIC",
    description: "Focus on farming, crop production, agribusiness, animal husbandry, and agricultural sciences.",
    weights: {
      R: 3, I: 2, A: 0, S: 0, E: 1, C: 1,
      O: 1, Cn: 3, Ex: 0, Ag: 1, ES: 2,
      OC: 1, SE: 1, CO: 2, ST: 2,
      Mech: 3, Log: 2, Verb: 0, Spat: 1, Num: 2, Voc: 0
    }
  },
  {
    code: "ENV",
    name: "Environment",
    hollandCode: "IRS",
    description: "Environmental conservation, ecology, sustainability, forestry, and natural resource management.",
    weights: {
      R: 2, I: 3, A: 0, S: 1, E: 0, C: 1,
      O: 3, Cn: 2, Ex: 0, Ag: 1, ES: 1,
      OC: 2, SE: 0, CO: 1, ST: 3,
      Mech: 1, Log: 3, Verb: 2, Spat: 1, Num: 2, Voc: 1
    }
  },
  {
    code: "AMC",
    name: "Arts, Media & Communication",
    hollandCode: "AES",
    description: "Journalism, filmmaking, mass media, broadcasting, public relations, content creation, and literature.",
    weights: {
      R: 0, I: 1, A: 3, S: 1, E: 2, C: 0,
      O: 3, Cn: 1, Ex: 2, Ag: 1, ES: 1,
      OC: 3, SE: 2, CO: 0, ST: 1,
      Mech: 0, Log: 1, Verb: 3, Spat: 1, Num: 0, Voc: 3
    }
  },
  {
    code: "FIN",
    name: "Accounts & Finance",
    hollandCode: "CEI",
    description: "Accounting, chartered accountancy, investment banking, taxation, wealth management, and auditing.",
    weights: {
      R: 0, I: 1, A: 0, S: 0, E: 2, C: 3,
      O: 1, Cn: 3, Ex: 1, Ag: 0, ES: 2,
      OC: 0, SE: 2, CO: 3, ST: 0,
      Mech: 0, Log: 3, Verb: 1, Spat: 0, Num: 3, Voc: 1
    }
  },
  {
    code: "BIZ",
    name: "Business & Entrepreneurship",
    hollandCode: "ECS",
    description: "Startups, venture creation, corporate management, sales, marketing, and business strategy.",
    weights: {
      R: 0, I: 1, A: 0, S: 1, E: 3, C: 2,
      O: 2, Cn: 2, Ex: 3, Ag: 1, ES: 2,
      OC: 2, SE: 3, CO: 0, ST: 0,
      Mech: 0, Log: 2, Verb: 2, Spat: 0, Num: 2, Voc: 1
    }
  },
  {
    code: "DES",
    name: "Creative & Design",
    hollandCode: "ARI",
    description: "UI/UX, graphic design, fashion, interior design, animation, architecture, and visual arts.",
    weights: {
      R: 1, I: 1, A: 3, S: 0, E: 1, C: 0,
      O: 3, Cn: 1, Ex: 0, Ag: 1, ES: 0,
      OC: 3, SE: 1, CO: 0, ST: 0,
      Mech: 1, Log: 1, Verb: 1, Spat: 3, Num: 0, Voc: 0
    }
  },
  {
    code: "EDU",
    name: "Education & Training",
    hollandCode: "SAI",
    description: "Teaching, pedagogy, academic research, corporate coaching, educational leadership, and curriculum design.",
    weights: {
      R: 0, I: 1, A: 1, S: 3, E: 1, C: 1,
      O: 2, Cn: 2, Ex: 2, Ag: 3, ES: 1,
      OC: 0, SE: 0, CO: 1, ST: 3,
      Mech: 0, Log: 1, Verb: 3, Spat: 0, Num: 0, Voc: 3
    }
  },
  {
    code: "EMG",
    name: "Emerging & Niche Careers",
    hollandCode: "IEA",
    description: "AI prompt engineering, robotics ethics, gaming, space tech, quantum computing, and frontier domains.",
    weights: {
      R: 1, I: 3, A: 1, S: 0, E: 2, C: 0,
      O: 3, Cn: 2, Ex: 1, Ag: 0, ES: 1,
      OC: 3, SE: 2, CO: 0, ST: 0,
      Mech: 1, Log: 3, Verb: 1, Spat: 2, Num: 2, Voc: 0
    }
  },
  {
    code: "GOV",
    name: "Government, Law & Public Policy",
    hollandCode: "ESC",
    description: "Civil services, judiciary, constitutional law, public administration, policy analysis, and diplomacy.",
    weights: {
      R: 0, I: 1, A: 0, S: 2, E: 2, C: 3,
      O: 1, Cn: 3, Ex: 1, Ag: 1, ES: 2,
      OC: 0, SE: 2, CO: 3, ST: 1,
      Mech: 0, Log: 3, Verb: 3, Spat: 0, Num: 1, Voc: 3
    }
  },
  {
    code: "HLT",
    name: "Healthcare & Life Sciences",
    hollandCode: "ISR",
    description: "Medicine, surgery, nursing, biomedical research, biotechnology, pharmacy, and clinical diagnostics.",
    weights: {
      R: 1, I: 3, A: 0, S: 2, E: 0, C: 1,
      O: 1, Cn: 3, Ex: 0, Ag: 2, ES: 2,
      OC: 0, SE: 1, CO: 1, ST: 3,
      Mech: 0, Log: 3, Verb: 2, Spat: 1, Num: 2, Voc: 1
    }
  },
  {
    code: "HSP",
    name: "Hospitality",
    hollandCode: "ESC",
    description: "Hotel management, culinary arts, tourism, event management, airline operations, and guest experience.",
    weights: {
      R: 0, I: 0, A: 1, S: 2, E: 3, C: 2,
      O: 1, Cn: 2, Ex: 3, Ag: 2, ES: 2,
      OC: 1, SE: 2, CO: 1, ST: 0,
      Mech: 0, Log: 1, Verb: 2, Spat: 0, Num: 1, Voc: 2
    }
  },
  {
    code: "ITC",
    name: "IT & Computers",
    hollandCode: "ICR",
    description: "Software engineering, cloud architecture, cybersecurity, web development, data science, and IT systems.",
    weights: {
      R: 1, I: 3, A: 0, S: 0, E: 0, C: 2,
      O: 2, Cn: 3, Ex: 0, Ag: 0, ES: 1,
      OC: 2, SE: 1, CO: 1, ST: 0,
      Mech: 0, Log: 3, Verb: 1, Spat: 2, Num: 3, Voc: 0
    }
  },
  {
    code: "PSF",
    name: "Personal Services & Freelance",
    hollandCode: "SEA",
    description: "Consulting, freelance consulting, fitness training, styling, beauty, personal coaching, and independent services.",
    weights: {
      R: 1, I: 0, A: 2, S: 2, E: 2, C: 0,
      O: 2, Cn: 1, Ex: 2, Ag: 2, ES: 1,
      OC: 2, SE: 1, CO: 0, ST: 1,
      Mech: 0, Log: 0, Verb: 2, Spat: 1, Num: 0, Voc: 1
    }
  },
  {
    code: "SAF",
    name: "Public Safety",
    hollandCode: "RSE",
    description: "Police, armed forces, defense, disaster management, emergency services, and fire rescue.",
    weights: {
      R: 3, I: 0, A: 0, S: 2, E: 1, C: 1,
      O: 0, Cn: 3, Ex: 1, Ag: 1, ES: 3,
      OC: 0, SE: 1, CO: 3, ST: 2,
      Mech: 2, Log: 2, Verb: 1, Spat: 2, Num: 1, Voc: 0
    }
  },
  {
    code: "SOC",
    name: "Social Services & Nonprofit",
    hollandCode: "SEC",
    description: "NGO management, social work, human rights advocacy, mental health counseling, and community development.",
    weights: {
      R: 0, I: 1, A: 0, S: 3, E: 1, C: 1,
      O: 1, Cn: 1, Ex: 2, Ag: 3, ES: 2,
      OC: 0, SE: 0, CO: 1, ST: 3,
      Mech: 0, Log: 1, Verb: 2, Spat: 0, Num: 0, Voc: 2
    }
  },
  {
    code: "SPT",
    name: "Sports & Athletics",
    hollandCode: "RSE",
    description: "Professional sports, athletic coaching, sports physiology, sports management, and refereeing.",
    weights: {
      R: 3, I: 0, A: 0, S: 2, E: 1, C: 0,
      O: 0, Cn: 2, Ex: 2, Ag: 1, ES: 3,
      OC: 1, SE: 3, CO: 0, ST: 0,
      Mech: 1, Log: 1, Verb: 1, Spat: 2, Num: 0, Voc: 0
    }
  },
  {
    code: "SEM",
    name: "Science, Engineering & Mathematics",
    hollandCode: "IRC",
    description: "Mechanical, civil, electrical engineering, physics, mathematics, chemistry, data analytics, and deep scientific research.",
    weights: {
      R: 2, I: 3, A: 0, S: 0, E: 0, C: 1,
      O: 3, Cn: 2, Ex: 0, Ag: 0, ES: 1,
      OC: 2, SE: 1, CO: 1, ST: 1,
      Mech: 3, Log: 3, Verb: 1, Spat: 3, Num: 3, Voc: 0
    }
  },
  {
    code: "TRL",
    name: "Transport & Logistics",
    hollandCode: "CRE",
    description: "Supply chain management, logistics operations, aviation, maritime shipping, and fleet management.",
    weights: {
      R: 2, I: 0, A: 0, S: 0, E: 1, C: 3,
      O: 0, Cn: 3, Ex: 1, Ag: 1, ES: 2,
      OC: 0, SE: 1, CO: 3, ST: 0,
      Mech: 2, Log: 2, Verb: 1, Spat: 3, Num: 2, Voc: 0
    }
  }
];

export async function seedCareerClustersToDatabase() {
  const seeded = [];

  for (const item of DEFAULT_CAREER_CLUSTERS) {
    // 1. Upsert Cluster
    const cluster = await prisma.careerCluster.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        hollandCode: item.hollandCode,
        description: item.description
      },
      create: {
        code: item.code,
        name: item.name,
        hollandCode: item.hollandCode,
        description: item.description
      }
    });

    // 2. Upsert each facet weight
    for (const [facet, weight] of Object.entries(item.weights)) {
      await prisma.careerClusterWeight.upsert({
        where: {
          clusterId_facet: {
            clusterId: cluster.id,
            facet
          }
        },
        update: {
          weight: Number(weight)
        },
        create: {
          clusterId: cluster.id,
          facet,
          weight: Number(weight)
        }
      });
    }

    seeded.push(cluster);
  }

  return seeded;
}
