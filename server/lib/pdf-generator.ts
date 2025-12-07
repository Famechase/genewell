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
      `${tier.charAt(0).toUpperCase() + tier.slice(1)} Blueprint — Personalized for ${profile.name}`
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
  doc.text(`Estimated Height: ${profile.estimatedHeightCm}cm | Estimated Weight: ${profile.estimatedWeightKg}kg`);

  doc.moveDown(2);
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#111827")
    .text(`${profile.name}, this personalized wellness blueprint is based on your unique profile,`);
  doc.text("quiz responses, lifestyle factors, and health goals.");
  doc.text(
    "Follow the recommendations consistently for optimal results over 90 days."
  );

  doc.addPage();

  // === PAGE 1: EXECUTIVE SUMMARY ===
  addHeaderSection("Executive Summary", `Your Personalized Wellness Analysis, ${profile.name}`);

  doc.moveDown(0.3);
  doc.fontSize(11).font("Helvetica").fillColor("#111827");
  doc.text(insights.metabolicInsight);

  doc.moveDown(0.5);
  addSubSection("Your Wellness Scores");
  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.text(`Energy Level: ${profile.energyScore}/100`);
  doc.text(`Sleep Quality: ${profile.sleepScore}/100`);
  doc.text(`Stress Level: ${profile.stressScore}/100`);
  doc.text(`Activity Level: ${profile.activityScore}/100`);

  doc.moveDown(0.5);
  addSubSection("Recommended Blood Work Panel");
  doc.fontSize(9).font("Helvetica").fillColor("#111827");
  doc.text("Evidence-based tests to track your health and optimize your plan:");
  doc.moveDown(0.2);
  profile.recommendedTests.slice(0, 8).forEach((test) => {
    addBulletPoint(test);
  });
  doc.moveDown(0.2);
  doc.fontSize(9).fillColor("#6b7280");
  doc.text(
    "Schedule these tests at baseline (before starting), at 6 weeks, and at 12 weeks to measure adaptation."
  );

  doc.addPage();

  // === PAGE 2: METABOLIC PROFILE (for non-free tiers) ===
  if (tier !== "free") {
    addHeaderSection("Your Metabolic Profile", `${profile.name}'s Energy & Calorie Needs`);

    doc.fontSize(11).font("Helvetica").fillColor("#111827");
    doc.moveDown(0.3);

    doc.text("Based on exercise physiology research (Mifflin-St Jeor equation):");
    doc.moveDown(0.2);

    doc.text(
      `Your Basal Metabolic Rate (BMR): ${profile.estimatedBMR} calories/day`
    );
    doc.fontSize(9).fillColor("#6b7280");
    doc.text("This is what your body burns at complete rest.");
    doc.moveDown(0.1);

    doc.fontSize(11).fillColor("#111827");
    doc.text(
      `Total Daily Energy Expenditure (TDEE): ${profile.estimatedTDEE} calories/day`
    );
    doc.fontSize(9).fillColor("#6b7280");
    doc.text("This accounts for your activity level and is your maintenance calorie target.");
    doc.moveDown(0.3);

    doc.fontSize(11).fillColor("#111827");
    addSubSection("Calorie & Macronutrient Targets");
    doc.fontSize(10);
    doc.text(
      `Daily Calorie Range: ${insights.calorieRange.min} - ${insights.calorieRange.max} calories`
    );
    doc.moveDown(0.3);

    doc.text("Daily Macronutrient Targets:");
    const proteinPct = Math.round((profile.proteinGrams * 4) / profile.estimatedTDEE * 100);
    const carbsPct = Math.round((profile.carbsGrams * 4) / profile.estimatedTDEE * 100);
    const fatsPct = Math.round((profile.fatsGrams * 9) / profile.estimatedTDEE * 100);
    
    doc.text(
      `  • Protein: ${profile.proteinGrams}g (${proteinPct}% of calories) - Preserves muscle and supports satiety`
    );
    doc.text(
      `  • Carbohydrates: ${profile.carbsGrams}g (${carbsPct}% of calories) - Fuels performance and recovery`
    );
    doc.text(
      `  • Healthy Fats: ${profile.fatsGrams}g (${fatsPct}% of calories) - Supports hormones and nutrient absorption`
    );

    doc.moveDown(0.3);
    addSubSection("Metabolism Notes");
    doc.fontSize(10).fillColor("#111827");
    doc.text("Your metabolic rate is based on your age, gender, height, and activity level.");
    doc.text("This is your unique number—track results and adjust calories as needed.");
    doc.text("Small adjustments (±200 calories) every 2-3 weeks optimize progress.");

    doc.addPage();
  }

  // === NUTRITION PLAN ===
  if (tier === "essential" || tier === "premium" || tier === "coaching") {
    addHeaderSection("Nutrition Plan", `${profile.name}'s Personalized Eating Strategy`);

    addSubSection("Optimal Meal Timing");
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text("Based on your schedule and circadian rhythm:");
    doc.moveDown(0.2);
    insights.recommendedMealTimes.forEach((time, idx) => {
      const meals = ["Breakfast", "Lunch", "Dinner"];
      doc.text(`${meals[idx]}: ${time}`);
    });
    if (profile.mealFrequency === 4) {
      doc.text(`Snacks: Mid-morning and mid-afternoon`);
    }
    doc.moveDown(0.2);
    doc.fontSize(9).fillColor("#6b7280");
    doc.text("Eating within consistent windows aligns with your circadian system and optimizes digestion.");

    doc.moveDown(0.3);
    addSubSection("Core Nutrition Framework");
    doc.fontSize(10).fillColor("#111827");
    doc.text("Each meal should include:");
    addBulletPoint("Protein source (eggs, Greek yogurt, paneer, chicken, lentils, tofu)", 30);
    addBulletPoint("Fiber source (oats, vegetables, fruit, legumes)", 30);
    addBulletPoint("Healthy fat (olive oil, nuts, avocado, coconut oil)", 30);

    doc.moveDown(0.3);
    addSubSection("Hydration Protocol");
    doc.fontSize(10).fillColor("#111827");
    doc.text("Research shows chronic mild dehydration impairs cognition and mood (Popkin et al., 2010):");
    addBulletPoint("Upon waking: 500ml water", 30);
    addBulletPoint("With each meal: 250ml water", 30);
    addBulletPoint("Between meals: Drink when thirsty", 30);
    addBulletPoint("Daily target: 2-2.5 liters (adjusted for climate and activity)", 30);

    if (tier === "premium" || tier === "coaching") {
      doc.addPage();

      addSubSection("7-Day Meal Plan Framework");
      doc.fontSize(10).font("Helvetica").fillColor("#111827");

      doc.text("Day 1-7 Example Structure (Customize based on preferences):");
      doc.moveDown(0.2);

      const mealPlanExample = [
        "Breakfast: Protein + Complex Carbs + Healthy Fat (e.g., eggs, oats, olive oil)",
        "Mid-morning: Fruit + Protein (e.g., banana, almonds)",
        "Lunch: Protein + Vegetables + Grains (e.g., chicken, broccoli, rice)",
        "Afternoon: Snack (fruit/nuts/yogurt)",
        "Dinner: Protein + Vegetables + Minimal Carbs (e.g., fish, spinach)",
        "Evening (optional): Casein or Greek yogurt if hungry",
      ];

      mealPlanExample.forEach((meal) => {
        addBulletPoint(meal);
      });

      doc.moveDown(0.3);
      addSubSection("Shopping List for India");
      doc.fontSize(10).font("Helvetica").fillColor("#111827");
      doc.text("Proteins: Chicken, Fish, Paneer, Dals, Eggs, Tofu");
      doc.text("Vegetables: Spinach, Broccoli, Carrots, Tomatoes, Bell Peppers, Cauliflower");
      doc.text("Grains: Brown Rice, Roti (Whole Wheat), Oats, Quinoa");
      doc.text(
        "Healthy Fats: Olive Oil, Coconut Oil, Almonds, Groundnuts, Sesame Seeds"
      );

      doc.addPage();
    }
  }

  // === FITNESS ROUTINE ===
  if (tier === "essential" || tier === "premium" || tier === "coaching") {
    addHeaderSection(
      "Fitness Routine",
      `${profile.name}'s ${tier === "coaching" || tier === "premium" ? "Advanced" : "Beginner-Friendly"} Workout Program`
    );

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.moveDown(0.3);
    doc.text(insights.workoutStrategy);

    doc.moveDown(0.3);
    addSubSection(
      `${tier === "essential" ? "3-Day" : tier === "premium" ? "5-Day" : "6-Day Advanced"} Weekly Structure`
    );

    const workoutDays =
      tier === "essential"
        ? [
            {
              day: "Monday",
              focus: "Full Body Strength",
              exercises: [
                "Push-ups or chest press: 3 sets x 8-12 reps",
                "Squats or leg press: 3 sets x 12-15 reps",
                "Plank or core work: 3 sets x 30-60 seconds",
              ],
            },
            {
              day: "Wednesday",
              focus: "Zone 2 Cardio (Conversational Pace)",
              exercises: [
                "Brisk walking, jogging, or cycling: 25-35 minutes",
                "Maintain pace where you can speak short sentences",
              ],
            },
            {
              day: "Friday",
              focus: "Flexibility & Recovery",
              exercises: [
                "Yoga or stretching: 20-30 minutes",
                "Focus on hip, shoulder, and spine mobility",
                "Deep breathing: 5 minutes",
              ],
            },
          ]
        : [
            { day: "Monday", focus: "Lower Body Strength (Squat emphasis)" },
            { day: "Tuesday", focus: "Upper Body Push (Chest, shoulders, triceps)" },
            { day: "Wednesday", focus: "Active Recovery (Walk, mobility, yoga)" },
            { day: "Thursday", focus: "Upper Body Pull (Back, biceps)" },
            { day: "Friday", focus: "Full-Body Power (Olympic lift patterns)" },
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
    doc.text("Weeks 1-4: Establish proper form, neural adaptation");
    doc.text("Weeks 5-8: Increase reps, sets, or weight by 5-10%");
    doc.text("Weeks 9-12: Introduce new variations or higher intensity");
    doc.text("Periodization beats random training for strength and muscle gains (Schoenfeld et al., 2016)");

    doc.addPage();
  }

  // === SLEEP OPTIMIZATION ===
  addHeaderSection("Sleep Optimization", `${profile.name}'s Essential Recovery Protocol`);

  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.moveDown(0.3);
  doc.text(insights.sleepStrategy);

  doc.moveDown(0.3);
  addSubSection("Sleep Hygiene Protocol (Evidence-Based)");
  doc.fontSize(10);
  addBulletPoint("Consistent sleep-wake time (even weekends)—circadian consistency matters most");
  addBulletPoint("Dark room (<5 lux): Use blackout curtains or eye mask");
  addBulletPoint("Cool temperature (65-68°F / 18-20°C): Optimal for sleep depth");
  addBulletPoint("Quiet environment (<30 dB): Use earplugs or white noise if needed");
  addBulletPoint("No screens 60-90 minutes before bed (blue light suppresses melatonin by 85%)");
  addBulletPoint("Warm bath or herbal tea 90 minutes before bed: Triggers melatonin release");
  addBulletPoint("Avoid caffeine after 2 PM: Half-life is 5-6 hours");

  if (tier !== "free") {
    doc.moveDown(0.3);
    addSubSection("Sleep Support (If Protocol Alone Isn't Enough)");
    doc.fontSize(10);
    addBulletPoint("Magnesium Glycinate 300-400mg 60 minutes before bed (Abbasi et al., 2012)");
    addBulletPoint("L-Theanine 100-200mg: Promotes relaxation without sedation");
    addBulletPoint("Herbal tea: Chamomile, passionflower (traditional, minimal evidence)");
    doc.moveDown(0.2);
    doc.fontSize(9).fillColor("#6b7280");
    doc.text("Start with protocol consistency first (2 weeks minimum). Then add supplements if needed.");
  }

  doc.addPage();

  // === STRESS MANAGEMENT ===
  addHeaderSection("Stress Management", `${profile.name}'s Nervous System Optimization`);

  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.moveDown(0.3);
  doc.text(insights.stressStrategy);

  doc.moveDown(0.3);
  addSubSection("Daily Stress Management Tools (Science-Backed)");
  doc.fontSize(10);
  addBulletPoint("Box Breathing (4-4-4-4): Inhale 4, hold 4, exhale 4, hold 4. Activates parasympathetic in 5 min.");
  addBulletPoint("Movement (20-30 min moderate): Walking, cycling, yoga. Reduces cortisol comparable to medication (Schuch et al., 2016).");
  addBulletPoint("Social Connection: 30 min meaningful interaction weekly. Loneliness increases inflammation and cortisol.");
  addBulletPoint("Consistent Sleep: One night of poor sleep increases amygdala (fear center) reactivity by 60% (Walker, 2017).");

  if (tier !== "free") {
    doc.moveDown(0.3);
    addSubSection("Advanced Techniques");
    doc.fontSize(10);
    addBulletPoint("Progressive Muscle Relaxation: Tense and release each muscle group");
    addBulletPoint("Mindfulness Meditation: 10-15 min daily reduces cortisol and anxiety");
    addBulletPoint("Nature Exposure: 20+ min in nature reduces cortisol and improves mood");
    addBulletPoint("Creative Hobbies: Engaging activities activate parasympathetic tone");
  }

  doc.addPage();

  // === SUPPLEMENTS ===
  if (tier === "essential" || tier === "premium" || tier === "coaching") {
    addHeaderSection("Supplement Protocol", `${profile.name}'s Science-Backed Nutritional Support`);

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    addSubSection(
      `Your ${tier === "coaching" || tier === "premium" ? "Comprehensive" : "Essential"} Supplement Stack`
    );

    profile.supplementPriority.forEach((supp, idx) => {
      doc.text(`${idx + 1}. ${supp}`);
    });

    doc.moveDown(0.3);
    addSubSection("Supplement Timing");
    doc.fontSize(10);
    doc.text("Morning (with breakfast):");
    addBulletPoint("Vitamin D3 (2000-4000 IU) + Omega-3 (EPA+DHA 2-3g)", 30);

    doc.text("Evening (with dinner):");
    addBulletPoint("Magnesium (if prescribed) with meal", 30);

    doc.text("Before bed (if sleep protocol alone isn't enough):");
    addBulletPoint("Magnesium Glycinate 300-400mg + L-Theanine (optional)", 30);

    doc.moveDown(0.3);
    addSubSection("Important Notes");
    doc.fontSize(10);
    addBulletPoint(
      "Start one supplement at a time to monitor for reactions (2-week minimum per supplement)"
    );
    addBulletPoint(
      "Consult your healthcare provider before starting supplements"
    );
    addBulletPoint("Buy from reputable brands with third-party testing (USP, NSF certified)");
    addBulletPoint(
      "Store in cool, dry places away from sunlight and moisture"
    );
    addBulletPoint("Food first—supplements fill gaps, not replace nutrition");

    doc.addPage();
  }

  // === PROGRESS TRACKING ===
  addHeaderSection("Progress Tracking", `${profile.name}'s 90-Day Transformation`);

  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  addSubSection("Weekly Check-In (2 Minutes)");
  doc.text("Track these metrics each week:");
  addBulletPoint("Energy levels (morning, afternoon, evening) 1-10 scale");
  addBulletPoint("Sleep duration and quality (1-10 scale)");
  addBulletPoint("Stress levels (1-10 scale)");
  addBulletPoint("Workouts completed / exercise performance");
  addBulletPoint("Meal plan adherence (%)");
  addBulletPoint("Digestive comfort (1-10 scale)");

  doc.moveDown(0.3);
  addSubSection("Monthly Assessment");
  doc.text("Evaluate at weeks 4, 8, and 12:");
  addBulletPoint("Photos (same time, same place, same light)");
  addBulletPoint("Weight and measurements (waist, chest, arms)");
  addBulletPoint("Fitness improvements (reps, weight, duration)");
  addBulletPoint("Repeat blood work (if available at 6 and 12 weeks)");
  addBulletPoint("Mental health improvements (mood, clarity)");
  addBulletPoint("Energy and stress resilience");

  doc.moveDown(0.3);
  addSubSection("Expected 90-Day Timeline");
  doc.text("Weeks 1-2: Sleep improves, energy stabilizes, systems establish");
  doc.text("Weeks 3-4: Mood lifts, stress response improves, exercise performance begins");
  doc.text("Weeks 5-8: Visible changes, strength/muscle gains, energy consistency");
  doc.text("Weeks 9-12: Major visual transformation, habits feel automatic, long-term sustainability");

  doc.addPage();

  // === SCIENTIFIC EVIDENCE ===
  if (tier !== "free") {
    addHeaderSection("Scientific Evidence", "Research Behind These Recommendations");

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text(
      "Sleep & Recovery"
    );
    doc.fontSize(9).font("Helvetica").fillColor("#6b7280");
    doc.text(
      "Cappuccio FP, et al. (2010). Sleep duration and all-cause mortality. Sleep Medicine Reviews."
    );
    doc.text(
      "Walker M. (2017). Why We Sleep: The New Science of Sleep and Dreams. Scribner."
    );

    doc.moveDown(0.2);
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text(
      "Nutrition & Metabolism"
    );
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "Morton RW, et al. (2018). A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. Br J Sports Med."
    );
    doc.text(
      "Mifflin MD, et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr."
    );

    doc.moveDown(0.2);
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text(
      "Exercise & Training"
    );
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "Schoenfeld BJ, et al. (2016). Dose-response relationships between resistance training volume and muscle hypertrophy. Sports Medicine."
    );
    doc.text(
      "Seiler S, Tønnessen E. (2009). Intervals, thresholds and long slow distance: The role of intensity and duration in endurance training. SportScience."
    );

    doc.moveDown(0.2);
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#4a5568").text(
      "Stress & Mental Health"
    );
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "Thoma MV, et al. (2013). The effect of music on the human stress response. PLoS ONE."
    );
    doc.text(
      "Laborde S, et al. (2016). The capacity to regulate emotions is associated with prolonged survival in aging. Journal of Aging Research."
    );

    doc.addPage();
  }

  // === ADD-ONS ===
  if (addOns.includes("dna-analysis") && profile.dnaConsent) {
    addHeaderSection(
      "DNA Analysis Insights",
      `${profile.name}'s Genetic Optimization`
    );
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text("Your genetic profile reveals key insights for personalization:");
    doc.moveDown(0.2);

    doc.text("FTO Gene (Appetite & Weight Management):");
    doc.text(
      "  May affect your natural appetite signals. Consider structured eating times and meal prep.",
      { indent: 20 }
    );

    doc.text("CYP1A2 Gene (Caffeine Metabolism):");
    doc.text(
      "  Determines if you're a fast or slow caffeine metabolizer. Adjust timing accordingly.",
      { indent: 20 }
    );

    doc.text("ACTN3 Gene (Athletic Performance):");
    doc.text("  Influences your natural exercise response patterns and recovery capacity.",
      { indent: 20 }
    );

    doc.moveDown(0.2);
    doc.fontSize(9).fillColor("#6b7280");
    doc.text(
      "Important: Genes are not destiny. Your lifestyle choices override genetic predisposition."
    );
    doc.text(
      "References: Frayling TM, et al. (2007). Nature Genetics; Speakman JR, et al. (2008). Cell."
    );

    doc.addPage();
  }

  if (addOns.includes("womens-hormonal") && profile.gender === "female") {
    addHeaderSection(
      "Women's Hormonal Health",
      `${profile.name}'s Cycle-Based Nutrition`
    );

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    addSubSection("Follicular Phase (Days 1-14: Estrogen Rising)");
    doc.text("Nutrition Focus: Higher carbs, moderate protein and fat");
    doc.text("Training Focus: Best for strength training and higher intensity workouts");
    doc.text("Why: Rising estrogen supports performance and energy availability");

    doc.moveDown(0.3);
    addSubSection("Luteal Phase (Days 15-28: Progesterone Rising)");
    doc.text("Nutrition Focus: Higher fat, moderate protein, lower carbs");
    doc.text("Training Focus: Lower intensity, recovery-focused activities");
    doc.text("Why: Rising progesterone increases calorie needs and benefits different training stimulus");

    doc.moveDown(0.3);
    addSubSection("Supplement Support for Women");
    doc.fontSize(10);
    addBulletPoint("Iron-rich foods (especially days 1-7 post-menstruation)");
    addBulletPoint("Magnesium (200-400mg daily, especially luteal phase for PMS)");
    addBulletPoint("B vitamins for energy and mood support");
    addBulletPoint("Omega-3 (2-3g EPA/DHA daily for inflammation management)");

    doc.addPage();
  }

  if (addOns.includes("mens-fitness") && profile.gender === "male") {
    addHeaderSection(
      "Men's Fitness Optimization",
      `${profile.name}'s Strength & Muscle Building`
    );

    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    addSubSection("Testosterone Optimization Strategy");
    doc.text("Heavy resistance training: 3-6x weekly with compound movements");
    doc.text("Adequate sleep: 7-9 hours nightly (critical for testosterone)");
    doc.text("Zinc intake: 11-15mg daily (supports testosterone production)");
    doc.text("Manage stress: Chronic cortisol suppresses testosterone");

    doc.moveDown(0.3);
    addSubSection("Muscle Building Protocol");
    doc.fontSize(10);
    addBulletPoint("Progressive overload: Increase reps, sets, or weight each week");
    addBulletPoint("Compound movements: Squats, deadlifts, bench press, rows, pull-ups");
    addBulletPoint("High protein: 1.8-2.2g per kg body weight daily");
    addBulletPoint("Calorie surplus if bulking: 300-500 above TDEE for muscle gain");

    doc.moveDown(0.3);
    addSubSection("Training Phases (12-Week Cycle)");
    doc.fontSize(10);
    doc.text("Weeks 1-4: Strength foundation (80-85% 1RM, 4-6 reps)");
    doc.text("Weeks 5-8: Hypertrophy (65-75% 1RM, 8-12 reps, shorter rest)");
    doc.text("Weeks 9-12: Power & volume (varied intensity, explosive reps)");

    doc.addPage();
  }

  if (addOns.includes("family-nutrition")) {
    addHeaderSection(
      "Family Nutrition Plan",
      `${profile.name}'s Complete Family Wellness`
    );
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text("This add-on extends personalized wellness to up to 4 family members.");
    doc.text("Each receives their own customized blueprint based on their unique:");
    doc.moveDown(0.2);
    addBulletPoint("Age, gender, and health status");
    addBulletPoint("Health goals and activity level");
    addBulletPoint("Medical history and dietary preferences");
    addBulletPoint("Personal wellness priorities");

    doc.moveDown(0.3);
    doc.text("Family benefits:");
    addBulletPoint("Shared meal planning that accommodates everyone");
    addBulletPoint("Grocery optimization (buying for everyone's needs)");
    addBulletPoint("Recipes that work for the whole household");
    addBulletPoint("Group fitness activities and accountability");

    doc.addPage();
  }

  // === FINAL ACTION STEPS ===
  addHeaderSection("Your Action Plan", `${profile.name}'s 90-Day Roadmap`);

  doc.fontSize(11).font("Helvetica").fillColor("#111827");
  doc.moveDown(0.2);
  doc.text("Week 1: Foundation & Assessment");
  addBulletPoint("Review this blueprint thoroughly", 30);
  addBulletPoint("Schedule blood work if recommended", 30);
  addBulletPoint("Set up meal planning and grocery shopping system", 30);
  addBulletPoint("Prepare workout space and gather equipment", 30);
  addBulletPoint("Download tracking app or create spreadsheet", 30);

  doc.moveDown(0.3);
  doc.text("Weeks 2-4: System Establishment");
  addBulletPoint("Implement consistent meal timing (most important)", 30);
  addBulletPoint("Complete 3-4 workouts per week, focus on form", 30);
  addBulletPoint("Practice daily stress management (5 min minimum)", 30);
  addBulletPoint("Track sleep, energy, and mood daily", 30);

  doc.moveDown(0.3);
  doc.text("Weeks 5-12: Momentum & Optimization");
  addBulletPoint("Adjust calories/macros based on results", 30);
  addBulletPoint("Increase workout intensity or volume progressively", 30);
  addBulletPoint("Refine supplement stack if needed", 30);
  addBulletPoint("Build lasting habits—consistency > perfection", 30);

  doc.moveDown(0.5);
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor("#7c3aed")
    .text("Remember: Small, consistent steps create lasting change.");
  doc.fontSize(10).font("Helvetica").fillColor("#111827");
  doc.text(
    `${profile.name}, you have the evidence-based roadmap. Commit to the process, and transformation will follow.`
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

  const sanitizedName = profile.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  const filename = `${sanitizedName}_${tier}_blueprint_${orderId}.pdf`;

  return {
    buffer,
    filename,
    pageCount: currentPage,
  };
}
