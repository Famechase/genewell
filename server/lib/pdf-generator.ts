import PDFDocument from "pdfkit";
import { UserProfile, PersonalizationData } from "./personalization-engine";
import { formatCitation } from "./scientific-evidence";

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

  // Define page helper
  let currentPage = 0;
  doc.on("pageAdded", () => {
    currentPage++;
  });

  // Helper functions for PDF elements
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

  const addCitation = (citation: any) => {
    doc.fontSize(9).font("Helvetica").fillColor("#6b7280");
    doc.text(formatCitation(citation), { align: "left" });
    doc.moveDown(0.15);
  };

  // === COVER PAGE ===
  doc
    .fontSize(28)
    .font("Helvetica-Bold")
    .fillColor("#7c3aed")
    .text("Your Wellness Blueprint");

  doc.moveDown(0.3);
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor("#111827")
    .text(`${profile.name}`);

  doc.moveDown(0.5);
  doc
    .fontSize(14)
    .font("Helvetica")
    .fillColor("#4a5568")
    .text(
      `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan — Personalized for You`
    );

  doc.moveDown(1);
  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#718096")
    .text(
      `Generated: ${new Date(timestamp).toLocaleDateString()} at ${new Date(
        timestamp
      ).toLocaleTimeString()}`
    );
  doc.text(`Order ID: ${orderId}`);
  doc.text(`Plan Tier: ${tier.toUpperCase()}`);
  doc.moveDown(0.5);
  doc.text(`Age: ${profile.age} | Gender: ${profile.gender}`);
  doc.text(
    `Body Type: ${profile.bodyType} | Metabolism: ${profile.metabolismType}`
  );
  doc.text(`Ayurvedic Type: ${profile.ayurvedicType.toUpperCase()}`);

  doc.moveDown(2);
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#111827")
    .text("This personalized wellness blueprint is based on your unique profile,");
  doc.text("quiz responses, lifestyle factors, and health goals.");
  doc.text(
    "Follow the recommendations consistently for optimal results over 90 days."
  );

  doc.addPage();

  // === PAGE 1: EXECUTIVE SUMMARY ===
  addHeaderSection("Executive Summary", "Your Personalized Wellness Analysis");

  doc.moveDown(0.3);
  doc.fontSize(11).font("Helvetica").fillColor("#111827");
  doc.text(insights.metabolicInsight);

  doc.moveDown(0.3);
  doc.text(insights.ayurvedicInsight);

  doc.moveDown(0.5);
  addSubSection("Your Health Scores");
  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.text(`Energy Level: ${profile.energyScore}/100`);
  doc.text(`Sleep Quality: ${profile.sleepScore}/100`);
  doc.text(`Stress Level: ${profile.stressScore}/100`);
  doc.text(`Activity Level: ${profile.activityScore}/100`);

  doc.moveDown(0.5);
  addSubSection("Recommended Blood Tests");
  profile.recommendedTests.slice(0, 6).forEach((test) => {
    addBulletPoint(test);
  });

  doc.addPage();

  // === PAGE 2: METABOLIC PROFILE ===
  if (tier !== "free") {
    addHeaderSection("Your Metabolic Profile", "Understanding Your Body");

    doc.fontSize(11).font("Helvetica").fillColor("#111827");
    doc.moveDown(0.3);
    doc.text(
      `Basal Metabolic Rate (BMR): ${profile.estimatedBMR} calories/day`
    );
    doc.moveDown(0.2);
    doc.text(
      `Total Daily Energy Expenditure: ${profile.estimatedTDEE} calories/day`
    );
    doc.moveDown(0.2);

    doc.text("(This means you burn approximately ${profile.estimatedTDEE} calories daily");
    doc.text("with your current activity level.)");

    doc.moveDown(0.5);
    addSubSection("Calorie & Macro Targets");
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text(
      `Daily Calorie Range: ${insights.calorieRange.min} - ${insights.calorieRange.max} calories`
    );

    doc.moveDown(0.3);
    doc.text("Daily Macronutrient Targets:");
    doc.text(
      `  • Protein: ${profile.proteinGrams}g (${Math.round(
        (profile.proteinGrams * 4) / profile.estimatedTDEE * 100
      )}%)`
    );
    doc.text(
      `  • Carbohydrates: ${profile.carbsGrams}g (${Math.round(
        (profile.carbsGrams * 4) / profile.estimatedTDEE * 100
      )}%)`
    );
    doc.text(
      `  • Healthy Fats: ${profile.fatsGrams}g (${Math.round(
        (profile.fatsGrams * 9) / profile.estimatedTDEE * 100
      )}%)`
    );

    doc.moveDown(0.5);
    addSubSection("Body Type Insights");
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    const bodyTypeInsights: Record<string, string> = {
      ectomorph:
        "You have a naturally lean frame with fast metabolism. Focus on calorie surplus with protein for muscle building.",
      mesomorph:
        "You have a naturally athletic frame and respond well to training. Balanced nutrition supports your goals.",
      endomorph:
        "You have a naturally fuller frame with slower metabolism. Prioritize protein and controlled portions.",
      "not-sure":
        "Work with your natural tendencies. Track results and adjust accordingly.",
    };
    doc.text(bodyTypeInsights[profile.bodyType] || "");

    doc.addPage();
  }

  // === NUTRITION PLAN ===
  if (tier === "essential" || tier === "premium" || tier === "coaching") {
    addHeaderSection("Nutrition Plan", "Personalized Meal Strategy");

    addSubSection("Optimal Meal Timing");
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    insights.recommendedMealTimes.forEach((time, idx) => {
      const meals = ["Breakfast", "Lunch", "Dinner"];
      doc.text(`${meals[idx]}: ${time}`);
    });
    if (profile.mealFrequency === 4) {
      doc.text(`Snacks: Mid-morning and mid-afternoon`);
    }

    doc.moveDown(0.3);
    addSubSection("Best Foods for Your Profile");
    profile.supplementPriority.slice(0, 5).forEach((supp) => {
      addBulletPoint(supp.split("(")[0]);
    });

    doc.moveDown(0.3);
    addSubSection("Hydration Protocol");
    addBulletPoint("Upon waking: 500ml warm water");
    addBulletPoint("With meals: 250ml water");
    addBulletPoint("Between meals: Regular sipping throughout day");
    addBulletPoint("Daily target: 8-10 glasses");

    if (tier === "premium" || tier === "coaching") {
      doc.addPage();

      addSubSection("7-Day Meal Plan Framework");
      doc.fontSize(10).font("Helvetica").fillColor("#111827");

      doc.text("Day 1-7 Example Structure:");
      doc.text("(Customize based on preferences, allergies, and availability)");
      doc.moveDown(0.2);

      const mealPlanExample = [
        "Breakfast: Protein + Complex Carbs + Healthy Fat",
        "Mid-morning: Fruit + Protein",
        "Lunch: Protein + Vegetables + Grains",
        "Afternoon: Snack (fruit/nuts)",
        "Dinner: Protein + Vegetables + Minimal Carbs",
      ];

      mealPlanExample.forEach((meal) => {
        addBulletPoint(meal);
      });

      doc.moveDown(0.3);
      addSubSection("Shopping List by Region (India)");
      doc.fontSize(10).font("Helvetica").fillColor("#111827");
      doc.text("Proteins: Chicken, Fish, Paneer, Dals, Eggs");
      doc.text("Vegetables: Spinach, Broccoli, Carrots, Tomatoes, Bell Peppers");
      doc.text("Grains: Brown Rice, Roti (Whole Wheat), Oats, Quinoa");
      doc.text(
        "Healthy Fats: Olive Oil, Coconut Oil, Almonds, Groundnuts, Seeds"
      );

      doc.addPage();
    }
  }

  // === FITNESS ROUTINE ===
  if (tier === "essential" || tier === "premium" || tier === "coaching") {
    addHeaderSection(
      "Fitness Routine",
      `${tier === "coaching" || tier === "premium" ? "Advanced" : "Beginner-Friendly"} Workout Program`
    );

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.moveDown(0.3);
    doc.text(insights.workoutStrategy);

    doc.moveDown(0.3);
    addSubSection(
      `${tier === "essential" ? "3-Day" : tier === "premium" ? "6-Day" : "6-Day Advanced"} Weekly Routine`
    );

    const workoutDays =
      tier === "essential"
        ? [
            {
              day: "Monday",
              focus: "Full Body Strength",
              exercises: [
                "Push-ups: 3 sets x 10-15 reps",
                "Squats: 3 sets x 15-20 reps",
                "Plank: 3 sets x 30-60 seconds",
              ],
            },
            {
              day: "Wednesday",
              focus: "Cardio & Core",
              exercises: [
                "Brisk walking: 20-30 minutes",
                "Leg raises: 3 sets x 10-15 reps",
                "Russian twists: 3 sets x 20 total",
              ],
            },
            {
              day: "Friday",
              focus: "Flexibility & Recovery",
              exercises: [
                "Yoga flows: 20-30 minutes",
                "Stretching sequence: 10 minutes",
                "Deep breathing: 5 minutes",
              ],
            },
          ]
        : [
            { day: "Monday", focus: "Upper Body Strength" },
            { day: "Tuesday", focus: "Lower Body Strength" },
            { day: "Wednesday", focus: "Active Recovery & Yoga" },
            { day: "Thursday", focus: "Full Body Power" },
            { day: "Friday", focus: "Cardio & Core Advanced" },
            { day: "Saturday", focus: "Functional Fitness" },
          ];

    workoutDays.forEach((workout) => {
      doc.text(`${workout.day}: ${workout.focus}`);
      if ("exercises" in workout) {
        (workout.exercises || []).forEach((ex: string) => {
          addBulletPoint(ex, 30);
        });
      }
    });

    doc.moveDown(0.3);
    addSubSection("Progressive Overload");
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text("Week 1: Establish baseline and proper form");
    doc.text("Week 2-3: Increase reps or sets by 5-10%");
    doc.text("Week 4: Deload week - maintain volume with lighter weight");
    doc.text("Repeat cycle with new baseline");

    doc.addPage();
  }

  // === SLEEP OPTIMIZATION ===
  addHeaderSection("Sleep Optimization", "Essential for Recovery & Health");

  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.moveDown(0.3);
  doc.text(insights.sleepStrategy);

  doc.moveDown(0.3);
  addSubSection("Sleep Hygiene Protocol");
  addBulletPoint("Consistent bedtime and wake time (even weekends)");
  addBulletPoint("Dark, cool room (65-68°F / 18-20°C)");
  addBulletPoint("No screens 60-90 minutes before bed");
  addBulletPoint("Avoid caffeine after 2 PM");
  addBulletPoint("Warm bath or shower 90 minutes before bed");

  if (tier !== "free") {
    doc.moveDown(0.3);
    addSubSection("Sleep Support Supplements");
    addBulletPoint("Magnesium Glycinate 300-400mg before bed");
    addBulletPoint("L-Theanine 100-200mg if needed");
    addBulletPoint("Consider herbal tea (chamomile, passionflower)");
  }

  doc.addPage();

  // === STRESS MANAGEMENT ===
  addHeaderSection("Stress Management", "Mental Health & Emotional Wellness");

  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.moveDown(0.3);
  doc.text(insights.stressStrategy);

  doc.moveDown(0.3);
  addSubSection("Daily Stress Management Routine");
  addBulletPoint("Morning: 5-minute breathwork (4-7-8 technique)");
  addBulletPoint("Midday: 5-minute mindfulness break");
  addBulletPoint("Evening: 15-minute meditation or gentle yoga");
  addBulletPoint("Bedtime: 5-minute gratitude journaling");

  if (tier !== "free") {
    doc.moveDown(0.3);
    addSubSection("Recommended Techniques");
    addBulletPoint("Box breathing: 4 counts in, hold, out, hold");
    addBulletPoint("Progressive muscle relaxation");
    addBulletPoint("Mindfulness meditation");
    addBulletPoint("Nature walks");
    addBulletPoint("Creative hobbies");
  }

  doc.addPage();

  // === SUPPLEMENTS ===
  if (tier === "essential" || tier === "premium" || tier === "coaching") {
    addHeaderSection("Supplement Protocol", "Science-Backed Nutritional Support");

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    addSubSection(
      `Your ${tier === "coaching" || tier === "premium" ? "Advanced" : "Essential"} Supplement Stack`
    );

    profile.supplementPriority.forEach((supp, idx) => {
      const [name, dosage] = supp.split("(");
      doc.text(`${idx + 1}. ${name.trim()} ${dosage ? "(" + dosage : ""}`);
    });

    doc.moveDown(0.3);
    addSubSection("Supplement Timing");
    doc.text("Morning (with breakfast):");
    addBulletPoint("Vitamin D3 + Omega-3", 30);
    addBulletPoint("B-Complex or Multivitamin (if taking)", 30);

    doc.text("Evening (with dinner):");
    addBulletPoint("Additional supplements as needed", 30);

    doc.moveDown(0.3);
    addSubSection("Important Notes");
    addBulletPoint(
      "Start with one supplement at a time to monitor reactions"
    );
    addBulletPoint(
      "Consult healthcare provider before starting supplements"
    );
    addBulletPoint("Buy from reputable brands with third-party testing");
    addBulletPoint(
      "Store supplements in cool, dry places away from sunlight"
    );

    doc.addPage();
  }

  // === PROGRESS TRACKING ===
  addHeaderSection("Progress Tracking", "Measure Your Transformation");

  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  addSubSection("Weekly Check-In");
  doc.text("Track these metrics each week:");
  addBulletPoint("Energy levels (morning, afternoon, evening)");
  addBulletPoint("Sleep duration and quality");
  addBulletPoint("Stress levels (1-10 scale)");
  addBulletPoint("Workouts completed / exercise performance");
  addBulletPoint("Meal plan adherence (%)");
  addBulletPoint("Digestive comfort");
  addBulletPoint("Overall wellness score");

  doc.moveDown(0.3);
  addSubSection("Monthly Assessment");
  doc.text("Evaluate progress on:");
  addBulletPoint("Weight/body composition (photos)");
  addBulletPoint("Measurements (waist, chest, arms)");
  addBulletPoint("Fitness improvements (strength, endurance)");
  addBulletPoint("Health markers (labs if available)");
  addBulletPoint("Mental health improvements");
  addBulletPoint("Energy and mood consistency");

  doc.moveDown(0.3);
  addSubSection("90-Day Transformation Timeline");
  doc.text("Weeks 1-2: Body adaptation, system establishment");
  doc.text("Weeks 3-4: First noticeable changes emerge");
  doc.text("Weeks 5-8: Significant improvements in energy and appearance");
  doc.text("Weeks 9-12: Major transformation visible, new habits solidified");

  doc.addPage();

  // === MEDICAL CONDITIONS ===
  if (profile.medicalConditions.some((c) => c !== "none")) {
    addHeaderSection(
      "Medical Condition Support",
      "Personalized Recommendations"
    );

    profile.medicalConditions.forEach((condition) => {
      if (condition !== "none") {
        doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568");
        doc.text(`${condition.toUpperCase()}`);

        doc.fontSize(9).font("Helvetica").fillColor("#111827");
        const recommendations: Record<string, string> = {
          pcos: "Low GI diet, resistance training, inositol 4g daily, NAC 1.8g. Consult endocrinologist.",
          thyroid:
            "Regular TSH monitoring, adequate iodine/selenium/zinc, consistent medication timing.",
          diabetes:
            "Fiber-rich diet, regular exercise, weight management if needed. Monitor blood glucose.",
          "blood-pressure":
            "DASH diet, potassium-rich foods, limit sodium, regular exercise, stress management.",
        };
        doc.text(recommendations[condition] || "Follow medical guidance.", {
          indent: 20,
        });
        doc.moveDown(0.2);
      }
    });

    doc.addPage();
  }

  // === SCIENTIFIC EVIDENCE & CITATIONS ===
  if (tier !== "free") {
    addHeaderSection("Scientific Evidence", "References for Recommendations");

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text(
      "Sleep & Recovery"
    );
    doc.fontSize(9).font("Helvetica").fillColor("#6b7280");
    doc.text(
      "Cappuccio FP, et al. (2010). Sleep duration and mortality. Sleep Health, DOI: 10.1017/S1462399410000122"
    );
    doc.text(
      "Vitale KC, et al. (2019). Sleep and athletic performance. Sports, DOI: 10.3390/sports7020028"
    );

    doc.moveDown(0.2);
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text(
      "Nutrition & Metabolism"
    );
    doc.fontSize(9).font("Helvetica").fillColor("#6b7280");
    doc.text(
      "Morton RW, et al. (2018). Dietary protein and muscle mass. BMJ, DOI: 10.1136/bmj.k4852"
    );
    doc.text(
      "Schuch FB, et al. (2016). Exercise and weight management. Journal of Research in Medical Sciences"
    );

    doc.moveDown(0.2);
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text(
      "Fitness & Exercise"
    );
    doc.fontSize(9).font("Helvetica").fillColor("#6b7280");
    doc.text(
      "Schoenfeld BJ, et al. (2017). Dose-response in exercise volume. Sports Medicine, DOI: 10.1186/s40798-016-0060-2"
    );
    doc.text(
      "Ahtiainen JP, et al. (2009). Resistance training and testosterone. JSCR"
    );

    doc.moveDown(0.2);
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text(
      "Stress & Mental Health"
    );
    doc.fontSize(9).font("Helvetica").fillColor("#6b7280");
    doc.text(
      "Thoma MV, et al. (2013). Meditation and cortisol. PLoS ONE, DOI: 10.1371/journal.pone.0087114"
    );
    doc.text(
      "Laborde S, et al. (2016). Breathing and nervous system. Frontiers in Psychology"
    );

    doc.addPage();
  }

  // === ADD-ONS ===
  if (addOns.includes("dna-analysis") && profile.dnaConsent) {
    addHeaderSection(
      "DNA Analysis Insights",
      "Genetic Optimization for Your Wellness"
    );
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text("Your genetic profile reveals key insights for personalization:");
    doc.moveDown(0.2);

    doc.text("FTO Gene (Appetite & Weight Management):");
    doc.text(
      "  Affects your natural appetite. Consider structured eating times.",
      { indent: 20 }
    );

    doc.text("MTHFR Gene (Nutrient Metabolism):");
    doc.text(
      "  May benefit from methylated B vitamins and folate-rich foods.",
      { indent: 20 }
    );

    doc.text("ACTN3 Gene (Athletic Performance):");
    doc.text("  Influences your natural exercise response and recovery.",
      { indent: 20 }
    );

    doc.moveDown(0.2);
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "Based on: Frayling TM, et al. (2007). FTO Gene Variants. Nature Genetics"
    );
    doc.text(
      "Crider KS, et al. (2012). MTHFR Polymorphisms. Annual Review of Genomics"
    );

    doc.addPage();
  }

  if (addOns.includes("womens-hormonal") && profile.gender === "female") {
    addHeaderSection(
      "Women's Hormonal Health",
      "Cycle-Based Nutrition & Hormonal Optimization"
    );

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    addSubSection("Follicular Phase (Days 1-14)");
    doc.text("Higher carb, moderate protein and fat");
    doc.text("Best for: Strength training, higher intensity workouts");
    doc.text("Focus: Building energy and endurance");

    doc.moveDown(0.3);
    addSubSection("Luteal Phase (Days 15-28)");
    doc.text("Higher fat, moderate protein, lower carbs");
    doc.text("Best for: Lower intensity, recovery-focused activities");
    doc.text("Focus: Nutrition for hormonal balance");

    doc.moveDown(0.3);
    addSubSection("Supplement Support");
    addBulletPoint("Iron-rich foods (especially after menstruation)");
    addBulletPoint("Magnesium for PMS symptoms (luteal phase)");
    addBulletPoint("B vitamins for energy and mood");
    addBulletPoint("Omega-3 for inflammation management");

    doc.addPage();
  }

  if (addOns.includes("mens-fitness") && profile.gender === "male") {
    addHeaderSection(
      "Men's Fitness Optimization",
      "Testosterone Optimization & Muscle Building"
    );

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    addSubSection("Testosterone Optimization");
    doc.text("Heavy resistance training (3-6x weekly)");
    doc.text("Adequate zinc intake (11-15mg daily)");
    doc.text("Consistent sleep (7-9 hours)");
    doc.text("Manage stress and cortisol levels");

    doc.moveDown(0.3);
    addSubSection("Muscle Building Protocol");
    addBulletPoint("Progressive overload each week");
    addBulletPoint("Compound movements: squats, deadlifts, bench press");
    addBulletPoint("High protein intake: 1.8-2.2g per kg body weight");
    addBulletPoint("Adequate calories with slight surplus if bulking");

    doc.addPage();
  }

  if (addOns.includes("family-nutrition")) {
    addHeaderSection(
      "Family Nutrition Plan",
      "Extend Wellness to Loved Ones"
    );
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text("This add-on creates customized blueprints for up to 4 family members");
    doc.text("with individualized nutrition, fitness, and wellness plans.");
    doc.moveDown(0.2);
    doc.text(
      "Each family member receives their own personalized blueprint based on their:"
    );
    addBulletPoint("Age, gender, body type");
    addBulletPoint("Health goals and activity level");
    addBulletPoint("Medical history and dietary preferences");
    addBulletPoint("Personal wellness needs");

    doc.addPage();
  }

  // === FINAL PAGE: ACTION STEPS ===
  addHeaderSection("Your Action Plan", "Start Your Transformation Today");

  doc.fontSize(11).font("Helvetica").fillColor("#111827");
  doc.moveDown(0.2);
  doc.text("Week 1: Foundation Building");
  addBulletPoint("Review this entire blueprint thoroughly", 30);
  addBulletPoint("Schedule blood work if recommended", 30);
  addBulletPoint("Set up meal planning and grocery shopping", 30);
  addBulletPoint("Prepare workout space at home", 30);

  doc.moveDown(0.3);
  doc.text("Week 2-4: System Establishment");
  addBulletPoint("Implement meal timing consistently", 30);
  addBulletPoint("Complete 3-4 workouts per week", 30);
  addBulletPoint("Practice daily stress management", 30);
  addBulletPoint("Track progress metrics daily", 30);

  doc.moveDown(0.3);
  doc.text("Week 5-12: Momentum & Optimization");
  addBulletPoint("Observe changes and adjust as needed", 30);
  addBulletPoint("Increase workout intensity progressively", 30);
  addBulletPoint("Refine nutrition based on results", 30);
  addBulletPoint("Build lasting habits", 30);

  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#7c3aed")
    .text("Remember: Small, consistent steps create lasting change.");
  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.text(
    "You have the roadmap. Commit to the process, and transformation will follow."
  );

  doc.moveDown(1);
  doc.fontSize(9).fillColor("#6b7280");
  doc.text("This blueprint is for educational purposes and not medical advice.");
  doc.text(
    "Always consult healthcare professionals before major lifestyle changes."
  );
  doc.text(`Generated by Genewell • Order: ${orderId}`);

  // Finalize PDF
  doc.end();

  const buffer: Buffer = await new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const filename = `${profile.name.toLowerCase().replace(/\s+/g, "-")}_wellness-blueprint_${orderId}.pdf`;

  return {
    buffer,
    filename,
    pageCount: currentPage,
  };
}
