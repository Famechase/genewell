// Personalization engine doesn't need shared/api imports - it's standalone

export interface UserProfile {
  // Personal info
  name: string;
  email: string;
  age: number;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";

  // Body metrics (derived from quiz or estimated)
  bodyType: "ectomorph" | "mesomorph" | "endomorph" | "not-sure";
  metabolismType: "fast" | "moderate" | "slow";
  ayurvedicType: "vata" | "pitta" | "kapha" | "mixed";

  // Scores
  stressScore: number; // 1-100
  sleepScore: number; // 1-100
  activityScore: number; // 1-100
  energyScore: number; // 1-100

  // Metabolic data
  estimatedBMR: number; // Basal Metabolic Rate
  estimatedTDEE: number; // Total Daily Energy Expenditure
  proteinGrams: number; // Daily protein recommendation
  carbsGrams: number; // Daily carbs recommendation
  fatsGrams: number; // Daily fats recommendation

  // Health flags
  medicalConditions: string[];
  digestiveIssues: string[];
  foodIntolerances: string[];
  skinConcerns: string[];

  // Preferences
  dietaryPreference: string;
  exercisePreference: string[];
  workSchedule: string;
  region: string;

  // DNA
  dnaConsent: boolean;

  // Recommendations
  recommendedTests: string[];
  supplementPriority: string[];
  exerciseIntensity: "low" | "moderate" | "high";
  mealFrequency: number;
}

export interface PersonalizationData {
  profile: UserProfile;
  insights: {
    metabolicInsight: string;
    ayurvedicInsight: string;
    recommendedMealTimes: string[];
    calorieRange: { min: number; max: number };
    macroRatios: { protein: number; carbs: number; fats: number };
    supplementStack: Array<{ name: string; reason: string; dosage?: string }>;
    workoutStrategy: string;
    sleepStrategy: string;
    stressStrategy: string;
  };
}

const AYURVEDIC_CHARACTERISTICS = {
  vata: {
    traits: [
      "Thin, light frame",
      "Quick, restless mind",
      "Dry skin and hair",
      "Irregular digestion",
      "Variable energy",
      "Cold hands and feet",
    ],
    recommendations: {
      foods: ["Warm foods", "Cooked vegetables", "Ghee", "Healthy oils", "Root vegetables"],
      avoid: ["Cold drinks", "Raw foods", "Excessive caffeine", "Dry snacks"],
      meals: "Regular, warm meals; 2-3 per day",
      activities: "Gentle yoga, walking, grounding practices",
      supplements: ["Ashwagandha", "Sesame oil", "Triphala", "Warming spices"],
    },
  },
  pitta: {
    traits: [
      "Medium frame",
      "Sharp intellect",
      "Good appetite",
      "Strong digestion",
      "Warm body temperature",
      "Ambitious nature",
    ],
    recommendations: {
      foods: ["Cooling foods", "Coconut", "Cucumber", "Mint", "Bitter vegetables"],
      avoid: ["Spicy foods", "Excess heat", "Fermented foods", "Too much salt"],
      meals: "Moderate, timely meals; 3 per day optimal",
      activities: "Moderate cardio, swimming, cooling yoga",
      supplements: ["Brahmi", "Ashwagandha", "Cooling herbs", "Coconut oil"],
    },
  },
  kapha: {
    traits: [
      "Fuller frame",
      "Steady mind",
      "Oily skin",
      "Strong digestion",
      "Slow metabolism",
      "Patient, calm nature",
    ],
    recommendations: {
      foods: ["Light foods", "Ginger", "Spices", "Bitter vegetables", "Whole grains"],
      avoid: ["Heavy foods", "Dairy excess", "Cold foods", "Fried foods"],
      meals: "Light, frequent meals; 2-3 per day",
      activities: "Vigorous exercise, dancing, stimulating activities",
      supplements: ["Ginger", "Black pepper", "Stimulating herbs", "Triphala"],
    },
  },
};

const BLOOD_TEST_RECOMMENDATIONS: Record<string, string[]> = {
  "weight-loss": ["CBC", "HbA1c", "Lipid Panel", "TSH", "Vitamin D"],
  "muscle-gain": ["Testosterone", "Ferritin", "B12", "Creatine Kinase", "Vitamin D"],
  "stress-management": ["Cortisol (AM)", "DHEA", "TSH", "Vitamin D"],
  "sleep-improvement": ["Vitamin D", "Magnesium", "Glucose", "TSH", "Iron Panel"],
  "low-energy": ["CBC", "Vitamin D", "B12", "Iron Panel", "Thyroid Panel"],
  "thyroid-symptoms": ["TSH", "FT3", "FT4", "anti-TPO"],
  "pcos": ["LH", "FSH", "Testosterone", "Insulin (Fasting)", "Glucose"],
  "hypertension": ["BP Monitoring", "Kidney Function", "Electrolytes"],
  "diabetes-risk": ["Fasting Glucose", "HbA1c", "Insulin", "Lipid Panel"],
};

export function analyzeQuizData(quizData: any, userName?: string, userEmail?: string): PersonalizationData {
  const age = quizData.age || 30;
  const gender = quizData.gender || "female";
  const activityLevel = quizData.activityLevel || "moderately-active";
  const bodyType = quizData.bodyType || "mesomorph";
  const stressLevel = quizData.stressLevel || "moderate";
  const sleepHours = quizData.sleepHours || "7-8";
  const energyLevels = quizData.energyLevels || "moderate";

  // Calculate stress score (0-100)
  const stressScoreMap = {
    "very-high": 85,
    moderate: 60,
    low: 30,
    minimal: 10,
  };
  const stressScore = (stressScoreMap as any)[stressLevel] || 60;

  // Calculate sleep score (0-100)
  const sleepScoreMap = {
    "less-than-5": 30,
    "5-6": 50,
    "7-8": 85,
    "more-than-8": 75,
  };
  const sleepScore = (sleepScoreMap as any)[sleepHours] || 85;

  // Calculate activity score (0-100)
  const activityScoreMap = {
    sedentary: 10,
    "lightly-active": 40,
    "moderately-active": 70,
    "highly-active": 95,
  };
  const activityScore = (activityScoreMap as any)[activityLevel] || 70;

  // Calculate energy score (0-100)
  const energyScoreMap = {
    "very-low": 10,
    low: 30,
    moderate: 60,
    high: 80,
    "very-high": 95,
  };
  const energyScore = (energyScoreMap as any)[energyLevels] || 60;

  // Determine metabolism type
  const metabolismType = determineMetabolismType(
    age,
    bodyType,
    activityScore,
    energyScore,
    quizData.hungerFrequency
  );

  // Determine Ayurvedic type
  const ayurvedicType = determineAyurvedicType(
    bodyType,
    stressScore,
    quizData.bloatingFrequency,
    quizData.cravings,
    energyScore
  );

  // Estimate BMR using Mifflin-St Jeor (assume average weight/height based on age/gender/bodytype)
  const estimatedBMR = estimateBMR(age, gender, bodyType);
  const activityMultiplierMap = {
    sedentary: 1.2,
    "lightly-active": 1.375,
    "moderately-active": 1.55,
    "highly-active": 1.725,
  };
  const activityMultiplier = (activityMultiplierMap as any)[activityLevel] || 1.55;
  const estimatedTDEE = Math.round(estimatedBMR * activityMultiplier);

  // Calculate macros based on goal and body type
  const macros = calculateMacronutrients(
    estimatedTDEE,
    quizData.weightGoal,
    gender,
    metabolismType,
    bodyType
  );

  // Get medical conditions and create flags
  const medicalConditions = Array.isArray(quizData.medicalConditions)
    ? quizData.medicalConditions
    : [quizData.medicalConditions || "none"];
  const digestiveIssues = Array.isArray(quizData.digestiveIssues)
    ? quizData.digestiveIssues
    : [quizData.digestiveIssues || "none"];
  const foodIntolerances = Array.isArray(quizData.foodIntolerances)
    ? quizData.foodIntolerances
    : [quizData.foodIntolerances || "none"];
  const skinConcerns = Array.isArray(quizData.skinConcerns)
    ? quizData.skinConcerns
    : [quizData.skinConcerns || "none"];

  // Recommend blood tests based on conditions and goals
  const recommendedTests = getRecommendedBloodTests(
    quizData.weightGoal,
    medicalConditions,
    gender,
    age
  );

  // Determine supplement priority
  const supplementPriority = getSupplementStack(
    gender,
    age,
    medicalConditions,
    stressScore,
    sleepScore,
    digestiveIssues,
    ayurvedicType
  );

  // Determine exercise intensity
  const exerciseIntensity =
    activityLevel === "sedentary"
      ? "low"
      : activityLevel === "highly-active"
      ? "high"
      : "moderate";

  // Meal frequency
  const mealFrequency =
    metabolismType === "fast" ? 4 : metabolismType === "slow" ? 2 : 3;

  // Create profile
  const profile: UserProfile = {
    name: userName || "User",
    email: userEmail || "user@example.com",
    age,
    gender,
    bodyType,
    metabolismType,
    ayurvedicType,
    stressScore,
    sleepScore,
    activityScore,
    energyScore,
    estimatedBMR,
    estimatedTDEE,
    proteinGrams: macros.protein,
    carbsGrams: macros.carbs,
    fatsGrams: macros.fats,
    medicalConditions,
    digestiveIssues,
    foodIntolerances,
    skinConcerns,
    dietaryPreference: quizData.dietaryPreference || "non-veg",
    exercisePreference: Array.isArray(quizData.exercisePreference)
      ? quizData.exercisePreference
      : [quizData.exercisePreference || "walking"],
    workSchedule: quizData.workSchedule || "9-to-5",
    region: "India",
    dnaConsent: quizData.dnaUpload === "yes-upload",
    recommendedTests,
    supplementPriority,
    exerciseIntensity,
    mealFrequency,
  };

  // Generate insights
  const insights = generateInsights(profile, quizData, ayurvedicType);

  return { profile, insights };
}

function determineMetabolismType(
  age: number,
  bodyType: string,
  activityScore: number,
  energyScore: number,
  hungerFrequency: string
): "fast" | "moderate" | "slow" {
  let score = 0;

  // Body type impact
  if (bodyType === "ectomorph") score += 3;
  else if (bodyType === "endomorph") score -= 3;

  // Age impact
  if (age < 25) score += 2;
  else if (age > 45) score -= 2;

  // Activity impact
  score += (activityScore / 100) * 3;

  // Energy impact
  score += (energyScore / 100) * 2;

  // Hunger impact
  if (hungerFrequency === "1-2-hours") score += 2;
  else if (hungerFrequency === "rarely") score -= 2;

  if (score >= 4) return "fast";
  if (score <= -4) return "slow";
  return "moderate";
}

function determineAyurvedicType(
  bodyType: string,
  stressScore: number,
  bloatingFrequency: string,
  cravings: string,
  energyScore: number
): "vata" | "pitta" | "kapha" | "mixed" {
  let vataScore = 0;
  let pittaScore = 0;
  let kaphaScore = 0;

  // Body type
  if (bodyType === "ectomorph") vataScore += 3;
  else if (bodyType === "mesomorph") pittaScore += 3;
  else if (bodyType === "endomorph") kaphaScore += 3;

  // Stress
  if (stressScore > 70) vataScore += 2;
  else if (stressScore > 40) pittaScore += 1;
  else kaphaScore += 1;

  // Bloating
  if (bloatingFrequency === "often") vataScore += 2;

  // Cravings
  if (cravings === "spicy-sour") pittaScore += 2;
  else if (cravings === "sweet-foods") kaphaScore += 2;

  // Energy
  if (energyScore > 75) vataScore += 1;
  else if (energyScore < 40) kaphaScore += 2;

  const scores = { vata: vataScore, pitta: pittaScore, kapha: kaphaScore };
  const maxDoshaScore = Math.max(...Object.values(scores));
  const dominantDoshas = Object.entries(scores)
    .filter(([_, score]) => score === maxDoshaScore)
    .map(([dosha, _]) => dosha);

  if (dominantDoshas.length > 1) return "mixed";
  return (dominantDoshas[0] as any) || "mixed";
}

function estimateBMR(age: number, gender: string, bodyType: string): number {
  // Estimate weight based on body type and gender
  let estimatedWeight = 70; // Default 70kg

  if (gender === "female") {
    estimatedWeight = bodyType === "ectomorph" ? 55 : bodyType === "endomorph" ? 75 : 65;
  } else {
    estimatedWeight = bodyType === "ectomorph" ? 65 : bodyType === "endomorph" ? 90 : 75;
  }

  // Estimate height (cm)
  let estimatedHeight = 170;
  if (gender === "female") estimatedHeight = 160;

  // Mifflin-St Jeor equation
  const genderFactor = gender === "male" ? 5 : -161;
  const bmr =
    10 * estimatedWeight + 6.25 * estimatedHeight - 5 * age + genderFactor;

  return Math.round(bmr);
}

function calculateMacronutrients(
  tdee: number,
  goal: string,
  gender: string,
  metabolismType: string,
  bodyType: string
): { protein: number; carbs: number; fats: number } {
  let proteinGPerKg = 1.8; // Default 1.8g/kg
  let carbPercentage = 0.45;
  let fatPercentage = 0.25;

  // Adjust based on goal
  if (goal === "lose-weight") {
    proteinGPerKg = 2.2; // Higher protein to preserve muscle
    carbPercentage = 0.35;
    fatPercentage = 0.25;
  } else if (goal === "gain-weight") {
    proteinGPerKg = 1.8;
    carbPercentage = 0.55;
    fatPercentage = 0.2;
  }

  // Adjust based on metabolism
  if (metabolismType === "fast") {
    carbPercentage += 0.1;
    fatPercentage -= 0.05;
  } else if (metabolismType === "slow") {
    carbPercentage -= 0.1;
    fatPercentage += 0.05;
  }

  // Estimate weight (same as BMR estimation)
  let estimatedWeight = gender === "female" ? 65 : 75;
  if (bodyType === "ectomorph") estimatedWeight -= 10;
  else if (bodyType === "endomorph") estimatedWeight += 10;

  const proteinCalories = estimatedWeight * proteinGPerKg * 4;
  const proteinGrams = Math.round(estimatedWeight * proteinGPerKg);
  const carbCalories = tdee * carbPercentage;
  const carbGrams = Math.round(carbCalories / 4);
  const fatCalories = tdee * fatPercentage;
  const fatGrams = Math.round(fatCalories / 9);

  return {
    protein: proteinGrams,
    carbs: carbGrams,
    fats: fatGrams,
  };
}

function getRecommendedBloodTests(
  goal: string,
  conditions: string[],
  gender: string,
  age: number
): string[] {
  const testsSet = new Set<string>();

  // Add tests based on goal
  if (goal === "lose-weight") {
    BLOOD_TEST_RECOMMENDATIONS["weight-loss"].forEach((t) => testsSet.add(t));
  } else if (goal === "gain-weight") {
    BLOOD_TEST_RECOMMENDATIONS["muscle-gain"].forEach((t) => testsSet.add(t));
  }

  // Add tests based on conditions
  conditions.forEach((condition) => {
    const tests =
      BLOOD_TEST_RECOMMENDATIONS[condition] ||
      BLOOD_TEST_RECOMMENDATIONS[`${condition}-risk`];
    if (tests) tests.forEach((t) => testsSet.add(t));
  });

  // Add age-based tests
  if (age > 40) {
    testsSet.add("Complete Metabolic Panel");
    testsSet.add("Lipid Panel");
  }

  // Add gender-specific tests
  if (gender === "female") {
    testsSet.add("Iron Panel");
    testsSet.add("Ferritin");
  }

  // Ensure basics
  testsSet.add("Vitamin D");
  testsSet.add("Thyroid Panel (TSH, Free T4)");

  return Array.from(testsSet);
}

function getSupplementStack(
  gender: string,
  age: number,
  conditions: string[],
  stressScore: number,
  sleepScore: number,
  digestiveIssues: string[],
  ayurvedicType: string
): string[] {
  const stack: string[] = [];

  // Essential for all
  stack.push("Vitamin D3 (1000-2000 IU)");
  stack.push("Omega-3 (1000-2000mg EPA/DHA)");

  // Age-based
  if (age > 40) {
    stack.push("Multivitamin");
  }

  // Gender-specific
  if (gender === "female") {
    stack.push("Iron (if deficient)");
  }

  // Stress support
  if (stressScore > 70) {
    stack.push("Magnesium (300-400mg)");
    stack.push("Ashwagandha (300-500mg)");
  } else if (stressScore > 50) {
    stack.push("Magnesium (200-300mg)");
  }

  // Sleep support
  if (sleepScore < 60) {
    stack.push("Magnesium Glycinate");
    stack.push("L-Theanine (100-200mg)");
  }

  // Digestive support
  if (digestiveIssues.includes("gas") || digestiveIssues.includes("acidity")) {
    stack.push("Probiotics (10-50 billion CFU)");
  }

  // Ayurvedic support
  if (ayurvedicType === "vata") {
    stack.push("Ashwagandha");
  } else if (ayurvedicType === "pitta") {
    stack.push("Brahmi");
  } else if (ayurvedicType === "kapha") {
    stack.push("Ginger + Black Pepper");
  }

  return stack.slice(0, 7); // Return top 7 supplements
}

function generateInsights(
  profile: UserProfile,
  quizData: any,
  ayurvedicType: string
): PersonalizationData["insights"] {
  const ayurvedicInfo = (AYURVEDIC_CHARACTERISTICS as any)[ayurvedicType] || {
    traits: [],
    recommendations: {},
  };

  // Meal times based on wake time
  const wakeTime = quizData.wakeUpTime || "6-8";
  const mealTimes =
    wakeTime === "before-6"
      ? ["6:30-7:30 AM", "12:30-1:30 PM", "7:00-8:00 PM"]
      : wakeTime === "after-10"
      ? ["11:00 AM-12:00 PM", "3:00-4:00 PM", "9:00-10:00 PM"]
      : ["8:00-9:00 AM", "1:00-2:00 PM", "7:30-8:30 PM"];

  return {
    metabolicInsight: `Your ${profile.metabolismType} metabolism indicates ${
      profile.metabolismType === "fast"
        ? "you burn calories quickly and benefit from frequent meals"
        : profile.metabolismType === "slow"
        ? "you burn calories slowly and benefit from portion control and thermogenic foods"
        : "you have a balanced metabolism that responds well to consistent meal timing"
    }. Estimated daily calorie needs: ${profile.estimatedTDEE} calories.`,

    ayurvedicInsight: `Your Ayurvedic constitution is ${ayurvedicType.toUpperCase()}. ${
      ayurvedicInfo.recommendations.meals || "Follow balanced meal timing"
    }. Focus on: ${ayurvedicInfo.recommendations.foods?.join(", ") || "nourishing foods"}. Avoid: ${
      ayurvedicInfo.recommendations.avoid?.join(", ") || "incompatible foods"
    }.`,

    recommendedMealTimes: mealTimes,

    calorieRange: {
      min: Math.round(profile.estimatedTDEE * 0.85),
      max: Math.round(profile.estimatedTDEE * 1.15),
    },

    macroRatios: {
      protein: Math.round((profile.proteinGrams / profile.estimatedTDEE) * 100 * 4),
      carbs: Math.round((profile.carbsGrams / profile.estimatedTDEE) * 100 * 4),
      fats: Math.round((profile.fatsGrams / profile.estimatedTDEE) * 100 * 9),
    },

    supplementStack: profile.supplementPriority.map((supp) => ({
      name: supp,
      reason: `Supports your ${ayurvedicType} type and current wellness needs`,
    })),

    workoutStrategy: `${profile.exerciseIntensity.charAt(0).toUpperCase() + profile.exerciseIntensity.slice(1)} intensity training, ${
      profile.exerciseIntensity === "low"
        ? "3 days per week"
        : profile.exerciseIntensity === "moderate"
        ? "4-5 days per week"
        : "5-6 days per week"
    } is optimal for your profile.`,

    sleepStrategy: `Your sleep score is ${profile.sleepScore}/100. ${
      profile.sleepScore < 50
        ? "Prioritize sleep improvement with consistent bedtime, dark room, and sleep support supplements."
        : profile.sleepScore < 75
        ? "Maintain good sleep hygiene and consider sleep support supplements."
        : "Your sleep is good; maintain current schedule."
    }`,

    stressStrategy: `Your stress score is ${profile.stressScore}/100. ${
      profile.stressScore > 70
        ? "Daily meditation, breathing exercises, and stress-support supplements recommended."
        : profile.stressScore > 50
        ? "Incorporate 15-20 minutes daily stress-reduction practice."
        : "Maintain your low-stress lifestyle with regular self-care."
    }`,
  };
}

export function getBMRInsight(profile: UserProfile): string {
  return `Your estimated Basal Metabolic Rate (BMR) is ${profile.estimatedBMR} calories, meaning you burn approximately ${profile.estimatedBMR} calories at complete rest. With your ${profile.activityScore}/100 activity level, your Total Daily Energy Expenditure (TDEE) is approximately ${profile.estimatedTDEE} calories.`;
}

export function getMacroBreakdown(profile: UserProfile): string {
  return `Based on your profile, daily macro targets: Protein ${profile.proteinGrams}g (${Math.round(
    (profile.proteinGrams * 4) / profile.estimatedTDEE * 100
  )}%), Carbs ${profile.carbsGrams}g (${Math.round(
    (profile.carbsGrams * 4) / profile.estimatedTDEE * 100
  )}%), Fats ${profile.fatsGrams}g (${Math.round(
    (profile.fatsGrams * 9) / profile.estimatedTDEE * 100
  )}%).`;
}
