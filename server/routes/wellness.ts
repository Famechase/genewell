import { RequestHandler } from "express";
import PDFDocument from "pdfkit";
import {
  WellnessQuizSchema,
  WellnessBlueprint,
  QuizSubmissionResponse,
  PaymentResponse,
  DownloadResponse,
} from "../../shared/api";
import { products, Product, getProductById } from "../../client/lib/products";

// In-memory storage for wellness data
const wellnessAnalyses = new Map<string, WellnessBlueprint>();
const quizSubmissions = new Map<string, any>();
const payments = new Map<string, any>();

// Fetch a small snippet from authoritative public sources to include as references
interface EvidenceItem {
  title: string;
  url: string;
  snippet: string;
}

async function fetchEvidence(): Promise<EvidenceItem[]> {
  const sources = [
    {
      url: "https://www.cdc.gov/physicalactivity/basics/adults/index.htm",
      title: "CDC: Physical Activity Basics for Adults",
    },
    {
      url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
      title: "WHO: Healthy diet factsheet",
    },
    {
      url: "https://www.nhlbi.nih.gov/health/sleep-deprivation",
      title: "NIH: Sleep Deprivation and Deficiency",
    },
  ];

  const results: EvidenceItem[] = [];

  await Promise.all(
    sources.map(async (s) => {
      try {
        const res = await fetch(s.url, { next: { revalidate: 60 * 60 } as any });
        if (!res.ok) throw new Error(`Failed to fetch ${s.url}`);
        const html = await res.text();
        const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
        const pMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);
        const text = (metaMatch?.[1] || pMatch?.[1] || "").replace(/<[^>]+>/g, "").trim();
        if (text) {
          results.push({ title: s.title, url: s.url, snippet: text.slice(0, 400) });
        } else {
          results.push({ title: s.title, url: s.url, snippet: "Reference included. See source for details." });
        }
      } catch {
        results.push({ title: s.title, url: s.url, snippet: "Reference included. See source for details." });
      }
    }),
  );

  return results;
}

// Advanced AI-powered wellness analysis engine (rule-based + configurable)
const generateWellnessBlueprint = (
  quizData: any,
  userId: string,
): WellnessBlueprint => {
  const getMetabolismType = () => {
    let score = 0;

    if (quizData.age < 25) score += 2;
    else if (quizData.age > 45) score -= 2;

    if (quizData.activityLevel === "highly-active") score += 3;
    else if (quizData.activityLevel === "sedentary") score -= 3;

    if (quizData.bodyType === "ectomorph") score += 3;
    else if (quizData.bodyType === "endomorph") score -= 3;

    if (quizData.energyLevels === "very-high") score += 2;
    else if (quizData.energyLevels === "very-low") score -= 2;

    if (quizData.hungerFrequency === "1-2-hours") score += 2;
    else if (quizData.hungerFrequency === "rarely") score -= 2;

    if (score >= 4) return "fast" as const;
    if (score <= -4) return "slow" as const;
    return "moderate" as const;
  };

  const getAyurvedicConstitution = () => {
    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    if (quizData.bodyType === "ectomorph") vataScore += 3;
    else if (quizData.bodyType === "mesomorph") pittaScore += 3;
    else if (quizData.bodyType === "endomorph") kaphaScore += 3;

    if (quizData.energyLevels === "very-high") vataScore += 2;
    if (quizData.activityLevel === "highly-active") pittaScore += 2;
    if (quizData.sleepHours === "more-than-8") kaphaScore += 2;

    if (quizData.bloatingFrequency === "often") vataScore += 2;
    if (quizData.cravings === "spicy-sour") pittaScore += 2;
    if (quizData.cravings === "sweet-foods") kaphaScore += 2;

    if (quizData.stressLevel === "very-high") vataScore += 2;
    if (quizData.stressLevel === "moderate") pittaScore += 1;
    if (quizData.stressLevel === "low") kaphaScore += 1;

    const maxScore = Math.max(vataScore, pittaScore, kaphaScore);
    if (vataScore === maxScore) return "vata" as const;
    if (pittaScore === maxScore) return "pitta" as const;
    if (kaphaScore === maxScore) return "kapha" as const;
    return "mixed" as const;
  };

  const metabolismType = getMetabolismType();
  const constitution = getAyurvedicConstitution();

  const getMealTiming = () => {
    const wakeTime = quizData.wakeUpTime;
    let breakfastTime, lunchTime, dinnerTime;

    if (wakeTime === "before-6") {
      breakfastTime = "6:30-7:30 AM";
      lunchTime = "12:00-1:00 PM";
      dinnerTime = "6:30-7:30 PM";
    } else if (wakeTime === "6-8") {
      breakfastTime = "8:00-9:00 AM";
      lunchTime = "1:00-2:00 PM";
      dinnerTime = "7:30-8:30 PM";
    } else if (wakeTime === "8-10") {
      breakfastTime = "10:00-11:00 AM";
      lunchTime = "2:00-3:00 PM";
      dinnerTime = "8:00-9:00 PM";
    } else {
      breakfastTime = "11:00 AM-12:00 PM";
      lunchTime = "3:00-4:00 PM";
      dinnerTime = "9:00-10:00 PM";
    }

    return {
      breakfast: breakfastTime,
      lunch: lunchTime,
      dinner: dinnerTime,
      snacks:
        metabolismType === "fast"
          ? ["10:00 AM", "4:00 PM", "8:00 PM"]
          : ["11:00 AM", "5:00 PM"],
    };
  };

  const getFoodRecommendations = () => {
    const baseFoods = [
      "Lean proteins (chicken, fish, tofu)",
      "Complex carbohydrates (quinoa, oats, sweet potato)",
      "Healthy fats (avocado, nuts, olive oil)",
      "Leafy greens (spinach, kale, methi)",
      "Seasonal fruits",
    ];

    const avoidFoods = ["Processed foods", "Refined sugar", "Trans fats"];

    if (constitution === "vata") {
      baseFoods.push("Warm, cooked foods", "Ghee", "Root vegetables");
      avoidFoods.push("Cold drinks", "Raw foods", "Excessive caffeine");
    } else if (constitution === "pitta") {
      baseFoods.push("Cooling foods", "Coconut", "Cucumber", "Mint");
      avoidFoods.push("Spicy foods", "Excessive heat", "Fermented foods");
    } else if (constitution === "kapha") {
      baseFoods.push("Light foods", "Ginger", "Spices", "Bitter vegetables");
      avoidFoods.push("Heavy foods", "Dairy", "Cold foods");
    }

    if (metabolismType === "fast") {
      baseFoods.push("Frequent small meals", "Healthy snacks");
    } else if (metabolismType === "slow") {
      baseFoods.push("Thermogenic spices", "Green tea", "Fiber-rich foods");
      avoidFoods.push("Late-night eating", "High-calorie snacks");
    }

    if (quizData.weightGoal === "lose-weight") {
      baseFoods.push("High-fiber foods", "Protein-rich snacks");
      avoidFoods.push("Calorie-dense foods", "Liquid calories");
    } else if (quizData.weightGoal === "gain-weight") {
      baseFoods.push("Nutrient-dense calories", "Healthy smoothies");
    }

    return { bestFoods: baseFoods.slice(0, 12), worstFoods: avoidFoods };
  };

  const getFitnessRoutine = () => {
    const preferences = Array.isArray(quizData.exercisePreference)
      ? quizData.exercisePreference
      : quizData.exercisePreference
      ? [quizData.exercisePreference]
      : [];
    const activityLevel = quizData.activityLevel;
    const age = quizData.age;

    let frequency, duration, intensity: "low" | "moderate" | "high";

    if (activityLevel === "sedentary") {
      frequency = 3;
      duration = 20;
      intensity = "low";
    } else if (activityLevel === "lightly-active") {
      frequency = 4;
      duration = 30;
      intensity = "moderate";
    } else if (activityLevel === "moderately-active") {
      frequency = 5;
      duration = 40;
      intensity = "moderate";
    } else {
      frequency = 6;
      duration = 45;
      intensity = "high";
    }

    if (age > 45) {
      intensity = intensity === "high" ? "moderate" : "low";
      duration = Math.max(duration - 10, 20);
    }

    const workoutTypes = preferences.length > 0 ? preferences : ["walking"];

    const weeklyPlan = [
      {
        day: "Monday",
        activity: workoutTypes.includes("strength")
          ? "Strength Training"
          : "Full Body Workout",
        duration: `${duration} min`,
        intensity,
      },
      {
        day: "Tuesday",
        activity: workoutTypes.includes("cardio") ? "Cardio" : "Active Recovery",
        duration: `${Math.floor(duration * 0.7)} min`,
        intensity: "moderate" as const,
      },
      {
        day: "Wednesday",
        activity: workoutTypes.includes("yoga") ? "Yoga" : "Flexibility",
        duration: `${Math.floor(duration * 0.6)} min`,
        intensity: "low" as const,
      },
      {
        day: "Thursday",
        activity: "Upper Body Focus",
        duration: `${duration} min`,
        intensity,
      },
      {
        day: "Friday",
        activity: workoutTypes.includes("dance") ? "Dance" : "HIIT",
        duration: `${Math.floor(duration * 0.6)} min`,
        intensity: "moderate" as const,
      },
      {
        day: "Saturday",
        activity: "Active Recovery",
        duration: `${Math.floor(duration * 0.5)} min`,
        intensity: "low" as const,
      },
      { day: "Sunday", activity: "Rest Day", duration: "0 min", intensity: "low" as const },
    ];

    return {
      workoutType: workoutTypes,
      frequency,
      duration,
      weeklyPlan: weeklyPlan.slice(0, frequency),
      homeExercises: [
        { name: "Push-ups", sets: "3 sets", reps: "8-12 reps", description: "Builds upper body strength" },
        { name: "Squats", sets: "3 sets", reps: "12-15 reps", description: "Strengthens legs and glutes" },
        { name: "Plank", sets: "3 sets", reps: "30-60 seconds", description: "Core strengthening" },
        { name: "Mountain Climbers", sets: "3 sets", reps: "30 seconds", description: "Cardio and core workout" },
      ],
    };
  };

  const getStressManagement = () => {
    const stressLevel = quizData.stressLevel;

    let techniques: string[] = [];
    let dailyRoutine: Array<{ time: string; activity: string; duration: string }> = [];

    if (stressLevel === "very-high" || stressLevel === "moderate") {
      techniques = [
        "Deep breathing exercises",
        "Progressive muscle relaxation",
        "Mindfulness meditation",
        "Journaling",
        "Nature walks",
      ];

      dailyRoutine = [
        { time: "Morning", activity: "5-minute breathing exercise", duration: "5 min" },
        { time: "Lunch", activity: "Mindful eating", duration: "10 min" },
        { time: "Evening", activity: "Meditation or yoga", duration: "15 min" },
        { time: "Night", activity: "Gratitude journaling", duration: "5 min" },
      ];
    } else {
      techniques = ["Regular exercise", "Adequate sleep", "Social connections", "Hobby time"];
      dailyRoutine = [
        { time: "Morning", activity: "Positive affirmations", duration: "2 min" },
        { time: "Evening", activity: "Relaxing activity", duration: "20 min" },
      ];
    }

    return {
      techniques,
      dailyRoutine,
      emergencyProtocols: [
        "4-7-8 breathing technique",
        "Cold water on wrists",
        "Step outside for fresh air",
        "Call a trusted friend",
      ],
      breathingExercises: [
        { name: "4-7-8 Breathing", technique: "Inhale 4, hold 7, exhale 8", duration: "3-5 minutes" },
        { name: "Box Breathing", technique: "Inhale 4, hold 4, exhale 4, hold 4", duration: "5-10 minutes" },
      ],
    };
  };

  const getSupplementPlan = () => {
    const age = quizData.age;
    const gender = quizData.gender;
    const digestiveIssues = Array.isArray(quizData.digestiveIssues)
      ? quizData.digestiveIssues
      : quizData.digestiveIssues
      ? [quizData.digestiveIssues]
      : [];
    const stressLevel = quizData.stressLevel;

    const essential = [
      { name: "Vitamin D3", dosage: "1000-2000 IU", timing: "With breakfast", benefit: "Bone health and immune support" },
      { name: "Omega-3", dosage: "1000mg EPA/DHA", timing: "With largest meal", benefit: "Heart and brain health" },
    ];

    const optional: Array<{ name: string; dosage: string; timing: string; benefit: string }> = [];

    if (age > 40) {
      essential.push({ name: "Multivitamin", dosage: "As directed", timing: "With breakfast", benefit: "Overall nutritional support" });
    }

    if (gender === "female") {
      essential.push({ name: "Iron", dosage: "18mg", timing: "On empty stomach", benefit: "Prevents iron deficiency" });
    }

    if (stressLevel === "very-high" || stressLevel === "moderate") {
      optional.push({ name: "Magnesium", dosage: "400mg", timing: "Before bed", benefit: "Stress relief and better sleep" });
      optional.push({ name: "Ashwagandha", dosage: "300-500mg", timing: "With dinner", benefit: "Adaptogenic stress support" });
    }

    if (digestiveIssues.includes("gas") || digestiveIssues.includes("acidity")) {
      optional.push({ name: "Probiotics", dosage: "10 billion CFU", timing: "With breakfast", benefit: "Digestive health support" });
    }

    return {
      essential,
      optional,
      warnings: [
        "Consult healthcare provider before starting new supplements",
        "Start with one supplement at a time",
        "Monitor for any adverse reactions",
      ],
    };
  };

  const mealTiming = getMealTiming();
  const foodRecs = getFoodRecommendations();
  const fitnessRoutine = getFitnessRoutine();
  const stressManagement = getStressManagement();
  const supplementPlan = getSupplementPlan();

  const blueprint: WellnessBlueprint = {
    metabolismType: {
      type: metabolismType,
      description: `Based on your responses, you have a ${metabolismType} metabolism.`,
      characteristics: [
        metabolismType === "fast"
          ? "Burns calories quickly"
          : metabolismType === "slow"
          ? "Burns calories slowly"
          : "Balanced calorie burning",
        metabolismType === "fast"
          ? "May need frequent meals"
          : metabolismType === "slow"
          ? "Benefits from portion control"
          : "Standard meal timing works well",
      ],
    },

    nutritionPlan: {
      bestFoods: foodRecs.bestFoods,
      worstFoods: foodRecs.worstFoods,
      mealTiming,
      fastingWindow: {
        startTime:
          quizData.wakeUpTime === "before-6"
            ? "8:00 PM"
            : quizData.wakeUpTime === "after-10"
            ? "10:00 PM"
            : "9:00 PM",
        endTime:
          quizData.wakeUpTime === "before-6"
            ? "6:30 AM"
            : quizData.wakeUpTime === "after-10"
            ? "10:00 AM"
            : "8:00 AM",
        duration: "12-14 hours",
        benefits: ["Improved insulin sensitivity", "Better sleep", "Weight management"],
      },
      hydrationSchedule: [
        "Upon waking: 1-2 glasses warm water",
        "Before meals: 1 glass (30 min prior)",
        "Between meals: Sip regularly",
        "Pre-workout: 1-2 glasses",
        "Post-workout: 2-3 glasses",
      ],
      portions: {
        protein: "Palm-sized portion per meal",
        carbs: "Cupped-hand portion",
        fats: "Thumb-sized portion",
        vegetables: "2 cupped-hands portion",
      },
    },

    fitnessRoutine,
    stressManagement,

    sleepOptimization: {
      bedtime:
        quizData.wakeUpTime === "before-6"
          ? "9:30 PM"
          : quizData.wakeUpTime === "after-10"
          ? "12:00 AM"
          : "10:30 PM",
      wakeTime:
        quizData.wakeUpTime === "before-6"
          ? "5:30 AM"
          : quizData.wakeUpTime === "after-10"
          ? "8:00 AM"
          : "6:30 AM",
      sleepHygiene: [
        "Keep bedroom cool (65-68°F)",
        "No screens 1 hour before bed",
        "Consistent sleep schedule",
        "Dark, quiet environment",
      ],
      environmentTips: [
        "Use blackout curtains",
        "Consider white noise machine",
        "Comfortable mattress and pillows",
        "Remove work materials from bedroom",
      ],
      supplementSuggestions: ["Magnesium", "Melatonin (if needed)", "Chamomile tea"],
    },

    supplementPlan,

    weeklyPlanner: [
      { day: "Monday", mealPrep: ["Batch cook proteins", "Prepare grab-and-go snacks"], exercise: fitnessRoutine.weeklyPlan[0]?.activity || "Rest", selfCare: "Plan week ahead", goals: ["Start week strong", "Prep healthy meals"] },
      { day: "Tuesday", mealPrep: ["Cut fresh vegetables", "Prepare lunch portions"], exercise: fitnessRoutine.weeklyPlan[1]?.activity || "Light activity", selfCare: "Mindfulness practice", goals: ["Stay hydrated", "Complete workout"] },
      { day: "Wednesday", mealPrep: ["Mid-week meal check", "Prepare healthy snacks"], exercise: fitnessRoutine.weeklyPlan[2]?.activity || "Yoga", selfCare: "Digital detox hour", goals: ["Maintain momentum", "Practice stress relief"] },
      { day: "Thursday", mealPrep: ["Prepare weekend groceries list", "Cook in bulk"], exercise: fitnessRoutine.weeklyPlan[3]?.activity || "Strength", selfCare: "Connect with friends/family", goals: ["Push through mid-week", "Prepare for weekend"] },
      { day: "Friday", mealPrep: ["Plan weekend meals", "Stock healthy options"], exercise: fitnessRoutine.weeklyPlan[4]?.activity || "Active recovery", selfCare: "Celebrate week's wins", goals: ["Finish week strong", "Plan weekend activities"] },
      { day: "Saturday", mealPrep: ["Grocery shopping", "Prep for next week"], exercise: "Active recovery or outdoor activity", selfCare: "Hobby time", goals: ["Recharge", "Prepare for next week"] },
      { day: "Sunday", mealPrep: ["Meal prep for the week", "Organize supplements"], exercise: "Rest or gentle movement", selfCare: "Reflection and planning", goals: ["Rest and reset", "Plan upcoming week"] },
    ],

    personalizedTips: [
      `With your ${constitution} constitution, focus on ${
        constitution === "vata"
          ? "grounding and warming practices"
          : constitution === "pitta"
          ? "cooling and calming activities"
          : "energizing and stimulating routines"
      }`,
      `Your ${metabolismType} metabolism responds best to ${
        metabolismType === "fast"
          ? "frequent, balanced meals"
          : metabolismType === "slow"
          ? "portion control and thermogenic foods"
          : "regular meal timing"
      }`,
      `Based on your stress level (${quizData.stressLevel}), prioritize ${
        quizData.stressLevel === "very-high"
          ? "daily stress-reduction practices"
          : "maintaining work-life balance"
      }`,
      `Your sleep pattern (${quizData.sleepHours}) suggests ${
        quizData.sleepHours === "less-than-5"
          ? "improving sleep duration is critical"
          : quizData.sleepHours === "more-than-8"
          ? "focusing on sleep quality over quantity"
          : "maintaining your current sleep schedule"
      }`,
    ],

    progressTracking: {
      weeklyMetrics: [
        "Energy levels (1-10)",
        "Sleep quality (1-10)",
        "Stress levels (1-10)",
        "Exercise completion (%)",
        "Meal plan adherence (%)",
      ],
      monthlyGoals: [
        "Achieve target weight/body composition",
        "Improve energy consistency",
        "Reduce stress levels",
        "Establish sustainable routines",
      ],
      redFlags: [
        "Persistent fatigue despite adequate sleep",
        "Digestive issues not improving",
        "Increasing stress levels",
        "Exercise performance declining",
      ],
    },

    ayurvedicInsights: {
      constitution,
      imbalances: [
        constitution === "vata"
          ? "May experience irregular digestion"
          : constitution === "pitta"
          ? "May experience heat-related issues"
          : "May experience sluggish metabolism",
      ],
      recommendations: [
        constitution === "vata"
          ? "Favor warm, cooked foods and regular routines"
          : constitution === "pitta"
          ? "Favor cooling foods and moderate exercise"
          : "Favor light foods and vigorous exercise",
      ],
      seasonalTips: [
        "Adjust diet based on seasonal availability",
        "Modify exercise intensity with weather changes",
        "Adapt sleep schedule to natural light cycles",
      ],
    },

    confidenceScore: Math.min(95, 70 + (Object.keys(quizData).length - 10) * 2 + (quizData.dnaUpload === "yes-upload" ? 10 : 0)),
    generatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return blueprint;
};

// Build product-specific PDF
async function buildProductPdf(product: Product): Promise<{ buffer: Buffer; filename: string }> {
  const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on("data", (d) => chunks.push(d as Buffer));

  // Helper function for formatting text
  const formatMarkdownLine = (line: string): { type: string; content: string } => {
    if (line.startsWith("# ")) return { type: "h1", content: line.substring(2).trim() };
    if (line.startsWith("## ")) return { type: "h2", content: line.substring(3).trim() };
    if (line.startsWith("### ")) return { type: "h3", content: line.substring(4).trim() };
    if (line.startsWith("- ")) return { type: "li", content: line.substring(2).trim() };
    if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.match(/^\d+\. /)) {
      return { type: "ol", content: line.replace(/^\d+\.\s/, "").trim() };
    }
    if (line.trim() === "") return { type: "blank", content: "" };
    if (line.startsWith("  - ")) return { type: "subli", content: line.substring(4).trim() };
    if (line.startsWith("  ")) return { type: "indent", content: line.trim() };
    return { type: "p", content: line };
  };

  // Title Page
  doc.fontSize(28).fillColor("#2d3748").font("Helvetica-Bold").text(`${product.name}`);
  doc.moveDown(0.5);
  doc.fontSize(14).fillColor("#667eea").text(`Personalized Wellness Guide from Genewell`);
  doc.moveDown(1);
  doc.fontSize(11).fillColor("#718096");
  doc.text(`Generated: ${new Date().toLocaleDateString()}`);
  doc.text(`Valid Until: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
  doc.text(`Price: ₹${product.price}`);
  doc.moveDown(2);

  // Parse and render the pdfContent
  const lines = product.pdfContent.split("\n");

  lines.forEach((line) => {
    const formatted = formatMarkdownLine(line);

    switch (formatted.type) {
      case "h1":
        doc.fontSize(22).fillColor("#2d3748").font("Helvetica-Bold").text(formatted.content);
        doc.moveDown(0.4);
        break;
      case "h2":
        doc.fontSize(16).fillColor("#4a5568").font("Helvetica-Bold").text(formatted.content);
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#e5e7eb");
        doc.moveDown(0.2);
        break;
      case "h3":
        doc.fontSize(13).fillColor("#667eea").font("Helvetica-Bold").text(formatted.content);
        doc.moveDown(0.2);
        break;
      case "li":
        doc.fontSize(11).fillColor("#111827").font("Helvetica");
        doc.text(`• ${formatted.content}`, { indent: 20 });
        doc.moveDown(0.1);
        break;
      case "ol":
        doc.fontSize(11).fillColor("#111827").font("Helvetica");
        doc.text(formatted.content, { indent: 20 });
        doc.moveDown(0.1);
        break;
      case "subli":
        doc.fontSize(10).fillColor("#718096").font("Helvetica");
        doc.text(`  ◦ ${formatted.content}`, { indent: 40 });
        doc.moveDown(0.08);
        break;
      case "indent":
        doc.fontSize(10).fillColor("#718096").font("Helvetica");
        doc.text(formatted.content, { indent: 30 });
        doc.moveDown(0.08);
        break;
      case "p":
        if (formatted.content.trim()) {
          doc.fontSize(11).fillColor("#111827").font("Helvetica");
          doc.text(formatted.content);
          doc.moveDown(0.15);
        }
        break;
      case "blank":
        doc.moveDown(0.2);
        break;
    }
  });

  // Footer
  doc.moveDown(1);
  doc.fontSize(9).fillColor("#6b7280");
  doc.text("━".repeat(80));
  doc.text("Disclaimer: This guide is educational and should not replace professional medical advice. Always consult with healthcare professionals before making significant lifestyle changes.");
  doc.moveDown(0.2);
  doc.text("© 2024 Genewell. All rights reserved. This document is for personal use only.");

  doc.end();

  const buffer: Buffer = await new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return { buffer, filename: `${product.name.toLowerCase().replace(/\s+/g, "-")}.pdf` };
}

// Build a comprehensive real PDF using pdfkit
async function buildWellnessPdf(
  analysisId: string,
  blueprint: WellnessBlueprint,
  quizData: any,
): Promise<{ buffer: Buffer; filename: string }> {
  const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on("data", (d) => chunks.push(d as Buffer));

  // Helper function for sections
  const addSection = (title: string) => {
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor("#7c3aed").font("Helvetica-Bold").text(title);
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#e5e7eb");
    doc.moveDown(0.3);
    doc.font("Helvetica");
  };

  // Title Page
  doc.fontSize(28).fillColor("#2d3748").font("Helvetica-Bold").text("Your Personal Wellness Blueprint");
  doc.moveDown(0.3);
  doc.fontSize(16).fillColor("#4a5568").text("Your AI-Powered Health Transformation Guide");
  doc.moveDown(0.8);

  doc.fontSize(11).fillColor("#718096");
  doc.text(`Generated: ${new Date(blueprint.generatedAt).toLocaleDateString()} ${new Date(blueprint.generatedAt).toLocaleTimeString()}`);
  doc.text(`Analysis ID: ${analysisId}`);
  doc.text(`Valid Until: ${new Date(blueprint.validUntil).toLocaleDateString()}`);
  doc.text(`Confidence Score: ${blueprint.confidenceScore}%`);
  doc.moveDown(1);

  // Overview Section
  addSection("1. YOUR WELLNESS PROFILE");
  doc.fontSize(11).fillColor("#111827");
  doc.text(`Metabolism Type: ${blueprint.metabolismType.type.toUpperCase()}`);
  doc.text(`Description: ${blueprint.metabolismType.description}`);
  doc.moveDown(0.2);
  doc.text("Characteristics:", { underline: true });
  blueprint.metabolismType.characteristics.forEach((char) => {
    doc.text(`• ${char}`);
  });
  doc.moveDown(0.3);
  doc.text(`Ayurvedic Constitution: ${blueprint.ayurvedicInsights.constitution.toUpperCase()}`);
  doc.moveDown(0.2);
  doc.text("Imbalances:", { underline: true });
  blueprint.ayurvedicInsights.imbalances.forEach((imb) => {
    doc.text(`• ${imb}`);
  });

  // Nutrition Plan
  addSection("2. PERSONALIZED NUTRITION PLAN");
  doc.text("Best Foods For Your Body:", { underline: true, fontSize: 11 });
  doc.fontSize(10);
  const foodChunks = [];
  for (let i = 0; i < blueprint.nutritionPlan.bestFoods.length; i += 3) {
    foodChunks.push(blueprint.nutritionPlan.bestFoods.slice(i, i + 3).join(" • "));
  }
  foodChunks.forEach((chunk) => doc.text(`• ${chunk}`));

  doc.fontSize(11).text("\nFoods to Limit:", { underline: true });
  doc.fontSize(10);
  blueprint.nutritionPlan.worstFoods.forEach((food) => {
    doc.text(`• ${food}`);
  });

  doc.fontSize(11).text("\nOptimal Meal Timing:", { underline: true });
  doc.fontSize(10);
  doc.text(`Breakfast: ${blueprint.nutritionPlan.mealTiming.breakfast}`);
  doc.text(`Lunch: ${blueprint.nutritionPlan.mealTiming.lunch}`);
  doc.text(`Dinner: ${blueprint.nutritionPlan.mealTiming.dinner}`);
  doc.text("Snack Times:");
  blueprint.nutritionPlan.mealTiming.snacks.forEach((snack) => {
    doc.text(`  • ${snack}`);
  });

  doc.fontSize(11).text("\nFasting Window:", { underline: true });
  doc.fontSize(10);
  doc.text(`${blueprint.nutritionPlan.fastingWindow.startTime} to ${blueprint.nutritionPlan.fastingWindow.endTime}`);
  doc.text(`Duration: ${blueprint.nutritionPlan.fastingWindow.duration}`);
  doc.text("Benefits:");
  blueprint.nutritionPlan.fastingWindow.benefits.forEach((benefit) => {
    doc.text(`  • ${benefit}`);
  });

  doc.fontSize(11).text("\nPortion Guidelines:", { underline: true });
  doc.fontSize(10);
  doc.text(`Protein: ${blueprint.nutritionPlan.portions.protein}`);
  doc.text(`Carbs: ${blueprint.nutritionPlan.portions.carbs}`);
  doc.text(`Healthy Fats: ${blueprint.nutritionPlan.portions.fats}`);
  doc.text(`Vegetables: ${blueprint.nutritionPlan.portions.vegetables}`);

  doc.fontSize(11).text("\nHydration Schedule:", { underline: true });
  doc.fontSize(10);
  blueprint.nutritionPlan.hydrationSchedule.forEach((hydration) => {
    doc.text(`• ${hydration}`);
  });

  // Fitness Routine
  addSection("3. CUSTOM FITNESS ROUTINE");
  doc.fontSize(11).fillColor("#111827");
  doc.text(`Recommended Frequency: ${blueprint.fitnessRoutine.frequency} days per week`);
  doc.text(`Duration per Session: ${blueprint.fitnessRoutine.duration} minutes`);
  doc.text(`Intensity Level: ${blueprint.fitnessRoutine.intensity.toUpperCase()}`);
  doc.text("Workout Types:", { underline: true });
  blueprint.fitnessRoutine.workoutType.forEach((wt) => {
    doc.text(`• ${wt}`);
  });

  doc.fontSize(11).text("\nWeekly Workout Plan:", { underline: true });
  doc.fontSize(10);
  blueprint.fitnessRoutine.weeklyPlan.forEach((day) => {
    doc.text(`${day.day}: ${day.activity}`);
    doc.text(`  Duration: ${day.duration} | Intensity: ${day.intensity}`);
  });

  doc.fontSize(11).text("\nHome Exercises:", { underline: true });
  doc.fontSize(10);
  blueprint.fitnessRoutine.homeExercises.forEach((exercise) => {
    doc.text(`${exercise.name}`);
    doc.text(`  ${exercise.sets} - ${exercise.reps}`);
    doc.text(`  ${exercise.description}`);
  });

  // Stress Management
  addSection("4. STRESS MANAGEMENT & MENTAL WELLNESS");
  doc.fontSize(11).fillColor("#111827");
  doc.text("Daily Stress Management Routine:", { underline: true });
  doc.fontSize(10);
  blueprint.stressManagement.dailyRoutine.forEach((routine) => {
    doc.text(`${routine.time}: ${routine.activity} (${routine.duration})`);
  });

  doc.fontSize(11).text("\nRecommended Techniques:", { underline: true });
  doc.fontSize(10);
  blueprint.stressManagement.techniques.forEach((technique) => {
    doc.text(`• ${technique}`);
  });

  doc.fontSize(11).text("\nEmergency Stress Relief:", { underline: true });
  doc.fontSize(10);
  blueprint.stressManagement.emergencyProtocols.forEach((protocol) => {
    doc.text(`• ${protocol}`);
  });

  doc.fontSize(11).text("\nBreathing Exercises:", { underline: true });
  doc.fontSize(10);
  blueprint.stressManagement.breathingExercises.forEach((ex) => {
    doc.text(`${ex.name}: ${ex.technique}`);
    doc.text(`  Duration: ${ex.duration}`);
  });

  // Sleep Optimization
  addSection("5. SLEEP OPTIMIZATION PROTOCOL");
  doc.fontSize(11).fillColor("#111827");
  doc.text(`Recommended Bedtime: ${blueprint.sleepOptimization.bedtime}`);
  doc.text(`Optimal Wake Time: ${blueprint.sleepOptimization.wakeTime}`);

  doc.fontSize(11).text("\nSleep Hygiene Tips:", { underline: true });
  doc.fontSize(10);
  blueprint.sleepOptimization.sleepHygiene.forEach((tip) => {
    doc.text(`• ${tip}`);
  });

  doc.fontSize(11).text("\nBedroom Environment:", { underline: true });
  doc.fontSize(10);
  blueprint.sleepOptimization.environmentTips.forEach((tip) => {
    doc.text(`• ${tip}`);
  });

  doc.fontSize(11).text("\nSleep Support Supplements:", { underline: true });
  doc.fontSize(10);
  blueprint.sleepOptimization.supplementSuggestions.forEach((supp) => {
    doc.text(`• ${supp}`);
  });

  // Supplement Plan
  addSection("6. PERSONALIZED SUPPLEMENT PLAN");
  doc.fontSize(11).fillColor("#111827");
  doc.text("Essential Daily Supplements:", { underline: true });
  doc.fontSize(10);
  blueprint.supplementPlan.essential.forEach((supp) => {
    doc.text(`${supp.name}`);
    doc.text(`  Dosage: ${supp.dosage} | Timing: ${supp.timing}`);
    doc.text(`  Benefit: ${supp.benefit}`);
  });

  if (blueprint.supplementPlan.optional.length > 0) {
    doc.fontSize(11).text("\nOptional Supplements:", { underline: true });
    doc.fontSize(10);
    blueprint.supplementPlan.optional.forEach((supp) => {
      doc.text(`${supp.name}`);
      doc.text(`  Dosage: ${supp.dosage} | Timing: ${supp.timing}`);
      doc.text(`  Benefit: ${supp.benefit}`);
    });
  }

  doc.fontSize(11).text("\nImportant Warnings:", { underline: true });
  doc.fontSize(10);
  blueprint.supplementPlan.warnings.forEach((warn) => {
    doc.text(`• ${warn}`);
  });

  // Weekly Planner
  addSection("7. WEEKLY WELLNESS PLANNER");
  doc.fontSize(10).fillColor("#111827");
  blueprint.weeklyPlanner.slice(0, 7).forEach((day) => {
    doc.fontSize(11).font("Helvetica-Bold").text(day.day);
    doc.font("Helvetica").fontSize(10);
    doc.text(`Exercise: ${day.exercise}`);
    doc.text(`Self-Care: ${day.selfCare}`);
    doc.text("Goals:");
    day.goals.forEach((goal) => doc.text(`  • ${goal}`));
    doc.text("Meal Prep Tasks:");
    day.mealPrep.forEach((task) => doc.text(`  • ${task}`));
    doc.moveDown(0.2);
  });

  // Personalized Tips
  addSection("8. YOUR PERSONALIZED TIPS");
  doc.fontSize(10).fillColor("#111827");
  blueprint.personalizedTips.forEach((tip, idx) => {
    doc.text(`${idx + 1}. ${tip}`);
    doc.moveDown(0.2);
  });

  // Progress Tracking
  addSection("9. TRACKING YOUR PROGRESS");
  doc.fontSize(11).fillColor("#111827");
  doc.text("Weekly Metrics to Monitor:", { underline: true });
  doc.fontSize(10);
  blueprint.progressTracking.weeklyMetrics.forEach((metric) => {
    doc.text(`• ${metric}`);
  });

  doc.fontSize(11).text("\nMonthly Goals:", { underline: true });
  doc.fontSize(10);
  blueprint.progressTracking.monthlyGoals.forEach((goal) => {
    doc.text(`• ${goal}`);
  });

  doc.fontSize(11).text("\nRed Flags to Watch:", { underline: true });
  doc.fontSize(10);
  blueprint.progressTracking.redFlags.forEach((flag) => {
    doc.text(`• ${flag}`);
  });

  // Ayurvedic Insights
  addSection("10. AYURVEDIC WELLNESS INSIGHTS");
  doc.fontSize(11).fillColor("#111827");
  doc.text(`Your Ayurvedic Type: ${blueprint.ayurvedicInsights.constitution.toUpperCase()}`);
  doc.text("Recommendations for Your Type:", { underline: true });
  doc.fontSize(10);
  blueprint.ayurvedicInsights.recommendations.forEach((rec) => {
    doc.text(`• ${rec}`);
  });

  doc.fontSize(11).text("\nSeasonal Tips:", { underline: true });
  doc.fontSize(10);
  blueprint.ayurvedicInsights.seasonalTips.forEach((tip) => {
    doc.text(`• ${tip}`);
  });

  // Footer
  doc.moveDown(1);
  doc.fontSize(9).fillColor("#6b7280");
  doc.text("━".repeat(80));
  doc.text("Disclaimer: This wellness blueprint is educational and should not replace professional medical advice. Always consult with healthcare professionals before making significant changes to your diet, exercise, or supplement regimen.");
  doc.moveDown(0.2);
  doc.text("© 2024 Genewell. All rights reserved. This document is for personal use only.");

  doc.end();

  const buffer: Buffer = await new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return { buffer, filename: `wellness-blueprint-${analysisId}.pdf` };
}

export const handleWellnessQuizSubmission: RequestHandler = async (req, res) => {
  try {
    const validatedData = WellnessQuizSchema.parse(req.body);

    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    quizSubmissions.set(analysisId, {
      ...validatedData,
      submittedAt: new Date().toISOString(),
    });

    const blueprint = generateWellnessBlueprint(validatedData, analysisId);
    wellnessAnalyses.set(analysisId, blueprint);

    const response: QuizSubmissionResponse = {
      success: true,
      analysisId,
      blueprint,
      paymentRequired: false,
      message: "Wellness blueprint generated successfully!",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Quiz submission error:", error);
    res.status(400).json({ success: false, message: "Invalid quiz data" });
  }
};

export const handleWellnessPayment: RequestHandler = async (req, res) => {
  try {
    const { analysisId, email, planType, amount } = req.body;

    if (!analysisId || !email || !planType) {
      return res.status(400).json({ success: false, message: "Missing required payment information" });
    }

    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    payments.set(paymentId, {
      analysisId,
      email,
      planType,
      amount,
      status: "completed",
      paidAt: new Date().toISOString(),
    });

    const downloadUrl = `/api/wellness/download/${analysisId}`;

    const response: PaymentResponse = {
      success: true,
      paymentId,
      downloadUrl,
      message: "Payment successful! Your blueprint is ready for download.",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ success: false, message: "Payment processing failed" });
  }
};

export const handleWellnessDownload: RequestHandler = async (req, res) => {
  try {
    const { analysisId } = req.params as { analysisId: string };

    const blueprint = wellnessAnalyses.get(analysisId);
    const quizData = quizSubmissions.get(analysisId);

    if (!blueprint || !quizData) {
      return res.status(404).json({ success: false, message: "Analysis not found" });
    }

    const { buffer, filename } = await buildWellnessPdf(analysisId, blueprint, quizData);

    const base64 = buffer.toString("base64");
    const response: DownloadResponse = {
      success: true,
      pdfUrl: `data:application/pdf;base64,${base64}`,
      filename,
      expiresAt: blueprint.validUntil,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ success: false, message: "Failed to generate download" });
  }
};

export const handleProductDownload: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.params as { productId: string };

    const product = getProductById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const { buffer, filename } = await buildProductPdf(product);

    const base64 = buffer.toString("base64");
    const response: DownloadResponse = {
      success: true,
      pdfUrl: `data:application/pdf;base64,${base64}`,
      filename,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Product download error:", error);
    res.status(500).json({ success: false, message: "Failed to generate product download" });
  }
};

export { wellnessAnalyses, quizSubmissions, payments };
