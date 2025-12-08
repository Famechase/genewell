import PDFDocument from "pdfkit";
import { UserProfile, PersonalizationData } from "./personalization-engine";

export interface PDFGenerationOptions {
  tier: "free" | "essential" | "premium" | "coaching";
  addOns?: string[];
  orderId: string;
  timestamp: string;
}

interface PDFChunks {
  buffer: Buffer;
  filename: string;
  pageCount: number;
}

export async function generatePersonalizedPDF(
  personalizationData: PersonalizationData,
  options: PDFGenerationOptions
): Promise<PDFChunks> {
  const { profile, insights } = personalizationData;
  const { tier, addOns = [], orderId, timestamp } = options;

  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    bufferPages: true,
    info: {
      Title: `${profile.name} - Wellness Blueprint (${tier})`,
      Author: "Genewell",
      Subject: "Personalized Wellness Blueprint",
      CreationDate: new Date(),
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (d) => chunks.push(d as Buffer));

  let currentPage = 0;
  doc.on("pageAdded", () => {
    currentPage++;
  });

  // Helper functions
  const addHeaderSection = (title: string, subtitle?: string) => {
    doc.fontSize(24).font("Helvetica-Bold").fillColor("#2d3748").text(title);
    if (subtitle) {
      doc.fontSize(12).font("Helvetica").fillColor("#718096").text(subtitle);
    }
    doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke("#e5e7eb");
    doc.moveDown(0.5);
  };

  const addSubSection = (title: string) => {
    doc.fontSize(14).font("Helvetica-Bold").fillColor("#4a5568").text(title);
    doc.moveDown(0.3);
  };

  const addBulletPoint = (text: string, indent: number = 20) => {
    doc.fontSize(11).font("Helvetica").fillColor("#111827");
    doc.text(`• ${text}`, { indent });
    doc.moveDown(0.1);
  };

  // === COVER PAGE ===
  doc
    .fontSize(32)
    .font("Helvetica-Bold")
    .fillColor("#7c3aed")
    .text("Your Wellness Blueprint");

  doc.moveDown(0.5);
  doc
    .fontSize(28)
    .font("Helvetica-Bold")
    .fillColor("#111827")
    .text(profile.name);

  doc.moveDown(0.8);
  const tierNames: Record<string, string> = {
    free: "Free Edition",
    essential: "Essential Edition",
    premium: "Premium Edition",
    coaching: "Complete Coaching Edition",
  };
  
  doc
    .fontSize(16)
    .font("Helvetica")
    .fillColor("#4a5568")
    .text(`${tierNames[tier]} — Science-Based & Fully Personalized`);

  doc.moveDown(1);
  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#718096")
    .text(
      `Generated: ${new Date(timestamp).toLocaleDateString()} at ${new Date(timestamp).toLocaleTimeString()}`
    );
  doc.text(`Order ID: ${orderId}`);
  doc.text(`Plan Tier: ${tier.toUpperCase()}`);
  
  doc.moveDown(0.5);
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#111827")
    .text(`Age: ${profile.age} | Gender: ${profile.gender}`);
  doc.text(
    `Height: ${profile.estimatedHeightCm}cm | Weight: ${profile.estimatedWeightKg}kg`
  );

  doc.moveDown(2);
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#111827")
    .text(
      `Dear ${profile.name},\n\nThis personalized wellness blueprint is uniquely designed for you, based on your quiz answers, lifestyle, and goals. Every recommendation is science-backed and actionable.\n\nFollow the daily and weekly steps consistently, and you'll see measurable improvements within 30 days.`
    );

  doc.addPage();

  // === PAGE 1: EXECUTIVE SUMMARY ===
  addHeaderSection(
    "Executive Summary",
    `Your Personalized Wellness Analysis`
  );

  doc.moveDown(0.3);
  doc.fontSize(11).font("Helvetica").fillColor("#111827");
  doc.text(insights.metabolicInsight);

  doc.moveDown(0.5);
  addSubSection("Your Wellness Baseline");
  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.text(`Energy Level: ${profile.energyScore}/100`);
  doc.text(`Sleep Quality: ${profile.sleepScore}/100`);
  doc.text(`Stress Resilience: ${profile.stressScore}/100`);
  doc.text(`Physical Activity: ${profile.activityScore}/100`);

  doc.moveDown(0.5);
  addSubSection("Critical Blood Work (Baseline)");
  doc.fontSize(9).font("Helvetica").fillColor("#111827");
  doc.text("Get these tests done BEFORE starting (compare at 6 & 12 weeks):");
  doc.moveDown(0.2);
  profile.recommendedTests.slice(0, 6).forEach((test) => {
    addBulletPoint(test);
  });

  doc.addPage();

  // === METABOLISM & CALORIES (for paid tiers) ===
  if (tier !== "free") {
    addHeaderSection(
      "Your Metabolic Profile",
      `${profile.name}'s Personal Energy Calculation`
    );

    doc.fontSize(11).font("Helvetica").fillColor("#111827");
    doc.moveDown(0.3);

    doc.text("Based on your age, gender, activity level, and body composition:");
    doc.moveDown(0.2);

    doc.text(
      `Basal Metabolic Rate (BMR): ${profile.estimatedBMR} calories/day`
    );
    doc.fontSize(9).fillColor("#6b7280");
    doc.text("Energy your body burns at complete rest (breathing, circulation, brain).");
    doc.moveDown(0.1);

    doc.fontSize(11).fillColor("#111827");
    doc.text(
      `Total Daily Energy Expenditure (TDEE): ${profile.estimatedTDEE} calories/day`
    );
    doc.fontSize(9).fillColor("#6b7280");
    doc.text("Your actual daily calorie burn, including activity.");
    doc.moveDown(0.3);

    doc.fontSize(11).fillColor("#111827");
    addSubSection("What This Means for Weight Management");
    doc.fontSize(10);
    doc.text(
      `→ To maintain weight: Eat ~${profile.estimatedTDEE} calories daily`
    );
    doc.text(
      `→ To lose fat: Eat ${profile.estimatedTDEE - 300} - ${profile.estimatedTDEE - 500} calories/day`
    );
    doc.text(
      `→ To gain muscle: Eat ${profile.estimatedTDEE + 300} - ${profile.estimatedTDEE + 500} calories/day`
    );

    doc.moveDown(0.3);
    addSubSection("Daily Macronutrient Targets");
    const proteinPct = Math.round(
      (profile.proteinGrams * 4) / profile.estimatedTDEE * 100
    );
    const carbsPct = Math.round(
      (profile.carbsGrams * 4) / profile.estimatedTDEE * 100
    );
    const fatsPct = Math.round(
      (profile.fatsGrams * 9) / profile.estimatedTDEE * 100
    );

    doc.fontSize(10);
    doc.text(`Protein: ${profile.proteinGrams}g/day (${proteinPct}%)`);
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "For muscle preservation and satiety. 1.8-2.2g per kg body weight is optimal.",
      { indent: 20 }
    );
    doc.moveDown(0.1);

    doc.fontSize(10).fillColor("#111827");
    doc.text(`Carbs: ${profile.carbsGrams}g/day (${carbsPct}%)`);
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "Fuels workouts, brain, and recovery. Timing matters (pre/post-workout).",
      { indent: 20 }
    );
    doc.moveDown(0.1);

    doc.fontSize(10).fillColor("#111827");
    doc.text(`Fats: ${profile.fatsGrams}g/day (${fatsPct}%)`);
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "Essential for hormones, brain, and nutrient absorption.",
      { indent: 20 }
    );

    doc.addPage();
  }

  // === NUTRITION PLAN (Essential, Premium, Coaching) ===
  if (tier === "essential" || tier === "premium" || tier === "coaching") {
    addHeaderSection(
      "Personalized Nutrition Plan",
      `${profile.name}'s Optimal Eating Strategy`
    );

    addSubSection("Your Meal Timing (Circadian Optimization)");
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    insights.recommendedMealTimes.forEach((time, idx) => {
      const meals = ["Breakfast", "Lunch", "Dinner"];
      doc.text(`${meals[idx]}: ${time}`);
    });
    doc.moveDown(0.2);
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "Research shows eating within consistent windows synchronizes your circadian rhythm, improves digestion, and stabilizes blood sugar."
    );

    doc.moveDown(0.3);
    addSubSection("Core Nutrition Framework (Every Meal)");
    doc.fontSize(10).fillColor("#111827");
    addBulletPoint("Protein source (eggs, Greek yogurt, paneer, dal, chicken, tofu)");
    addBulletPoint("Carb source (rice, roti, oats, sweet potato, quinoa)");
    addBulletPoint("Vegetable (minimum 2 cups, variety of colors)");
    addBulletPoint("Healthy fat (olive oil, ghee, nuts, avocado)");

    if (tier === "premium" || tier === "coaching") {
      doc.addPage();

      addSubSection("7-Day Meal Plan Framework");
      doc.fontSize(10).font("Helvetica").fillColor("#111827");
      doc.text(
        "Use this as a template. Mix and match based on your preferences:"
      );
      doc.moveDown(0.2);

      const sampleMeals = [
        "Breakfast: 2-3 eggs + oats with banana + 1 tsp ghee",
        "Mid-morning: Greek yogurt + berries + almonds",
        "Lunch: Grilled chicken + brown rice + roasted broccoli + olive oil",
        "Afternoon: Apple + peanut butter",
        "Dinner: Lentil dal + roti + spinach curry",
        "Optional evening: Casein (Greek yogurt) if hungry after 8 PM",
      ];

      sampleMeals.forEach((meal) => {
        addBulletPoint(meal);
      });

      doc.moveDown(0.3);
      addSubSection("Indian Grocery Shopping List");
      doc.fontSize(9).font("Helvetica").fillColor("#111827");
      doc.text("Proteins: Chicken breast, Fish, Paneer, Moong/Arhar dal, Eggs");
      doc.text(
        "Vegetables: Spinach, Broccoli, Bell peppers, Carrots, Cauliflower, Tomatoes"
      );
      doc.text(
        "Grains: Brown rice, Whole wheat roti, Oats, Quinoa, Millets"
      );
      doc.text("Healthy Fats: Olive oil, Ghee, Almonds, Peanuts, Sesame oil");

      doc.moveDown(0.3);
      addSubSection("Hydration Protocol (Science-Based)");
      doc.fontSize(10);
      addBulletPoint("Upon waking: 500ml water (rehydrates after 8-hour fast)");
      addBulletPoint("With meals: 250ml water (aids digestion)");
      addBulletPoint("Between meals: Drink when thirsty");
      addBulletPoint("Daily target: 2-2.5 liters (adjust for climate, activity)");
      addBulletPoint("After 7 PM: Reduce intake (minimize nighttime urination)");

      doc.addPage();
    }
  }

  // === SLEEP OPTIMIZATION (All tiers) ===
  addHeaderSection(
    "Sleep Optimization Protocol",
    `${profile.name}'s Critical Recovery Foundation`
  );

  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.text(insights.sleepStrategy);

  doc.moveDown(0.3);
  addSubSection("Sleep Hygiene Checklist");
  addBulletPoint("Consistent sleep-wake time (even weekends) ← Most important");
  addBulletPoint("Dark room: <5 lux (blackout curtains or eye mask)");
  addBulletPoint("Cool temperature: 65-68°F (18-20°C)");
  addBulletPoint("Quiet environment: <30 dB (earplugs or white noise)");
  addBulletPoint("No blue light 60-90 min before bed");
  addBulletPoint("No caffeine after 2 PM (5-6 hour half-life)");
  addBulletPoint("Warm bath/tea 90 min before bed (triggers melatonin)");

  if (tier !== "free") {
    doc.moveDown(0.3);
    addSubSection("Sleep Supplements (If Protocol Alone Isn't Enough)");
    doc.fontSize(10);
    addBulletPoint("Magnesium Glycinate: 300-400mg, 60 min before bed");
    addBulletPoint("L-Theanine: 100-200mg, optional with magnesium");
    addBulletPoint("Herbal tea: Chamomile or passionflower (traditional)");
    doc.moveDown(0.2);
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "→ Try protocol first for 2 weeks minimum. Then add one supplement at a time."
    );
  }

  doc.addPage();

  // === MOVEMENT & FITNESS ===
  if (tier === "essential" || tier === "premium" || tier === "coaching") {
    addHeaderSection(
      "Movement & Training Plan",
      `${profile.name}'s Personalized Exercise Protocol`
    );

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text(insights.workoutStrategy);

    doc.moveDown(0.3);
    const workoutType =
      tier === "essential"
        ? "3-Day Beginner"
        : tier === "premium"
        ? "5-Day Intermediate"
        : "6-Day Advanced";

    addSubSection(`${workoutType} Weekly Schedule`);
    doc.fontSize(10);

    if (tier === "essential") {
      doc.text("Monday: Full Body Strength (30 min)");
      doc.text("  Push-ups or chest press: 3 sets x 8-12 reps");
      doc.text("  Squats or leg press: 3 sets x 12-15 reps");
      doc.text("  Plank or core: 3 sets x 30-60 seconds");
      doc.moveDown(0.1);

      doc.text("Wednesday: Zone 2 Cardio (30 min, conversational pace)");
      doc.text("  Brisk walk, jog, or cycle at easy pace");
      doc.moveDown(0.1);

      doc.text("Friday: Flexibility & Recovery (20 min)");
      doc.text("  Yoga, stretching, deep breathing");
    } else if (tier === "premium") {
      doc.text("Monday: Lower Body Strength (45 min)");
      doc.text("  Focus: Squat, deadlift variations");
      doc.moveDown(0.1);

      doc.text("Tuesday: Upper Body Push (45 min)");
      doc.text("  Focus: Chest, shoulders, triceps");
      doc.moveDown(0.1);

      doc.text("Wednesday: Active Recovery (30 min)");
      doc.text("  Walk, yoga, or light mobility");
      doc.moveDown(0.1);

      doc.text("Thursday: Upper Body Pull (45 min)");
      doc.text("  Focus: Back, biceps, rear delts");
      doc.moveDown(0.1);

      doc.text("Friday: Full Body Power (45 min)");
      doc.text("  Focus: Olympic lift patterns, explosive movements");
      doc.moveDown(0.1);

      doc.text("Sat-Sun: Optional light activity or complete rest");
    } else {
      doc.text("6-day periodized program with progressive overload");
      doc.text("Phases: Strength (weeks 1-4) → Hypertrophy (weeks 5-8) → Power (weeks 9-12)");
    }

    doc.moveDown(0.3);
    addSubSection("Progressive Overload Formula");
    doc.fontSize(9);
    doc.text("Weeks 1-4: Master form with moderate weight");
    doc.text("Weeks 5-8: Increase weight or reps by 5-10%");
    doc.text("Weeks 9-12: New variations or higher intensity");

    doc.addPage();
  }

  // === STRESS MANAGEMENT ===
  addHeaderSection(
    "Stress Management & Nervous System Optimization",
    `${profile.name}'s Daily Resilience Protocol`
  );

  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.text(insights.stressStrategy);

  doc.moveDown(0.3);
  addSubSection("Daily Stress Management Tools");
  doc.fontSize(10);
  addBulletPoint(
    "Box Breathing: 4-4-4-4 count. Activates parasympathetic in 5 minutes."
  );
  addBulletPoint(
    "Movement: 20-30 min moderate activity (walk, yoga, gym). Reduces cortisol comparable to medication."
  );
  addBulletPoint(
    "Social connection: 30+ min meaningful interaction 3x/week."
  );
  addBulletPoint("Fix sleep first: One bad night increases anxiety by 60%.");

  if (tier !== "free") {
    doc.moveDown(0.3);
    addSubSection("Advanced Stress Techniques");
    doc.fontSize(10);
    addBulletPoint("Progressive Muscle Relaxation: Tense & release each muscle group");
    addBulletPoint("Meditation: 10-15 min daily (Headspace, Calm, or free YT)");
    addBulletPoint("Nature exposure: 20+ min in nature (park, forest) 1-2x/week");
    addBulletPoint("Creative hobbies: Art, music, or writing (activate parasympathetic)");
  }

  doc.addPage();

  // === SUPPLEMENTS (Premium & Coaching) ===
  if (tier === "premium" || tier === "coaching") {
    addHeaderSection(
      "Smart Supplement Strategy",
      `${profile.name}'s Science-Backed Nutritional Support`
    );

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    addSubSection("Your Supplement Priority Stack");
    profile.supplementPriority.forEach((supp, idx) => {
      doc.text(`${idx + 1}. ${supp}`);
    });

    doc.moveDown(0.3);
    addSubSection("Supplement Timing Protocol");
    doc.fontSize(10);
    doc.text("Morning (with breakfast):");
    addBulletPoint("Vitamin D3: 2000-4000 IU (immune, mood, metabolism)", 30);
    addBulletPoint("Omega-3 (fish oil or algae): 2-3g EPA+DHA", 30);
    addBulletPoint("Multivitamin: If deficient (optional)", 30);

    doc.text("Evening (with dinner):");
    addBulletPoint("Magnesium: Only if prescribed or sleep issues", 30);

    doc.moveDown(0.3);
    addSubSection("Supplement Selection Rules");
    doc.fontSize(9);
    doc.text("1. Start ONE supplement at a time (2-week minimum)");
    doc.text("2. Buy from reputable brands: USP, NSF, Informed Choice certified");
    doc.text("3. Food first — supplements fill gaps, not replace real nutrition");
    doc.text("4. Consult doctor before starting anything");
    doc.text("5. Store in cool, dry place away from sunlight");

    doc.addPage();
  }

  // === PROGRESS TRACKING ===
  addHeaderSection(
    "90-Day Progress Tracking System",
    `${profile.name}'s Transformation Timeline`
  );

  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  addSubSection("Weekly Check-In (2 Minutes)");
  doc.text("Track every Sunday evening:");
  addBulletPoint("Energy levels (morning, midday, evening): 1-10 scale");
  addBulletPoint("Sleep quality & duration: hours + 1-10 rating");
  addBulletPoint("Stress level: 1-10 scale");
  addBulletPoint("Workouts completed this week: __/3 or __/5");
  addBulletPoint("Meal plan adherence: __%");

  doc.moveDown(0.3);
  addSubSection("Monthly Assessment (Week 4, 8, 12)");
  doc.fontSize(10);
  addBulletPoint("Photos: Same time, same place, same light (front & side)");
  addBulletPoint(
    "Measurements: Weight, waist, chest, arms (if applicable)"
  );
  addBulletPoint("Performance: Push-ups, squats, running time, etc.");
  addBulletPoint("Blood work: If doing 6 & 12 week testing");
  addBulletPoint("Mood & energy consistency");

  doc.moveDown(0.3);
  addSubSection("Expected 90-Day Timeline");
  doc.fontSize(10);
  doc.text("Weeks 1-2: Sleep improves, energy stabilizes");
  doc.text("Weeks 3-4: Mood lifts, stress improves, workouts feel easier");
  doc.text("Weeks 5-8: Visible changes, muscle/strength gains");
  doc.text("Weeks 9-12: Major transformation, habits feel automatic");

  doc.addPage();

  // === ADD-ONS ===
  if (addOns.includes("addon_dna") || addOns.includes("addon_supplement")) {
    addHeaderSection("Premium Add-On Content", `${profile.name}'s Enhanced Insights`);

    if (addOns.includes("addon_dna")) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text("DNA Analysis Insights");
      doc.fontSize(9).font("Helvetica").fillColor("#111827");
      doc.text(
        "Your genetic profile reveals key optimization opportunities for personalization."
      );
      doc.moveDown(0.2);
      doc.text("FTO Gene (Appetite & Weight Management):");
      doc.text(
        "  May affect hunger signals. Use structured eating times and meal prep.",
        { indent: 20 }
      );
      doc.text("CYP1A2 Gene (Caffeine Metabolism):");
      doc.text("  Determines if you're a fast or slow metabolizer. Adjust timing.",
        { indent: 20 }
      );
      doc.text("ACTN3 Gene (Athletic Performance):");
      doc.text("  Influences exercise response and recovery capacity.",
        { indent: 20 }
      );
      doc.moveDown(0.2);
      doc.fontSize(8).fillColor("#6b7280");
      doc.text("Important: Genes are not destiny. Lifestyle choices override genetics.");

      doc.addPage();
    }

    if (addOns.includes("addon_supplement")) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text("Advanced Supplement Analysis");
      doc.fontSize(9).font("Helvetica").fillColor("#111827");
      doc.text(
        "This add-on includes a comprehensive 12-week supplement protocol based on your deficiencies."
      );
      doc.moveDown(0.2);
      doc.text("Included:");
      addBulletPoint("Deficiency testing interpretation", 20);
      addBulletPoint("Periodized 12-week protocol (loading, maintenance, deload)", 20);
      addBulletPoint("Brand recommendations & vendor guides", 20);
      addBulletPoint("Timing & stacking strategy", 20);

      doc.addPage();
    }
  }

  // === ACTION PLAN ===
  addHeaderSection(
    "Your 90-Day Action Plan",
    `${profile.name}'s Step-by-Step Implementation`
  );

  doc.fontSize(11).font("Helvetica").fillColor("#111827");
  doc.text("Week 1: Foundation");
  addBulletPoint("Review this entire blueprint thoroughly", 30);
  addBulletPoint("Schedule baseline blood work (if recommended)", 30);
  addBulletPoint("Setup meal prep container and grocery plan", 30);
  addBulletPoint("Create tracking system (spreadsheet or app)", 30);

  doc.moveDown(0.2);
  doc.text("Weeks 2-4: System Establishment");
  addBulletPoint("Lock in meal times (most important step)", 30);
  addBulletPoint("Complete 3-4 workouts, focus on form", 30);
  addBulletPoint("Practice daily stress management (5 min minimum)", 30);
  addBulletPoint("Track sleep, energy, mood daily", 30);

  doc.moveDown(0.2);
  doc.text("Weeks 5-12: Momentum & Optimization");
  addBulletPoint("Adjust calories/macros based on results", 30);
  addBulletPoint("Increase workout intensity or volume", 30);
  addBulletPoint("Refine supplement stack if needed", 30);
  addBulletPoint("Build lasting habits—consistency beats perfection", 30);

  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#7c3aed")
    .text("Remember: Small consistent steps create lasting transformation.");

  doc.moveDown(0.3);
  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.text(
    `${profile.name}, you have the evidence-based roadmap. Commit to the process, and results will follow.`
  );

  doc.moveDown(1);
  doc.fontSize(9).fillColor("#6b7280");
  doc.text("This blueprint is for educational purposes and not medical advice.");
  doc.text(
    "Always consult healthcare professionals before major lifestyle changes."
  );
  doc.text(`Generated by Genewell Wellness • Order: ${orderId}`);

  // Finalize PDF
  doc.end();

  const buffer: Buffer = await new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const sanitizedName = profile.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
  const filename = `${sanitizedName}_${tier}_blueprint_${orderId}.pdf`;

  return {
    buffer,
    filename,
    pageCount: currentPage,
  };
}
