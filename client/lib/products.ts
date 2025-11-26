export interface Product {
  id: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  color: string;
  icon: string;
  link: string;
  pdfContent?: string;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  features: string[];
}

// FREE BLUEPRINT - Basic wellness foundation
export const FREE_BLUEPRINT: Product = {
  id: "free-blueprint",
  name: "Free Blueprint",
  description: "Science-based wellness foundation",
  details: [
    "Sleep & circadian rhythm assessment",
    "Stress and energy evaluation",
    "5 daily habit recommendations",
    "Hydration & movement guidelines",
    "30-day quick-start checklist",
  ],
  price: 0,
  color: "gray",
  icon: "gift",
  link: "/view-sample-report",
  pdfContent: `# FREE BLUEPRINT
Your Personal Wellness Foundation
Generated: ${new Date().toLocaleDateString()}

## START HERE

This free guide gives you science-backed basics to improve your energy, sleep, and stress without guesswork. No diet hype. No workout gimmicks. Just what research shows actually works.

## WHAT WE'RE ASSESSING

Based on your answers, we've gathered data on:
- Your current sleep patterns and circadian timing
- Baseline energy and stress levels  
- Daily movement and activity habits
- Hydration and nutrition timing
- Recovery and rest capacity

## YOUR ENERGY & SLEEP PROFILE

Research from sleep neurobiology shows that circadian timing—when you wake, eat, and rest—directly drives energy production (Dijk & Archer, 2010, PNAS). Your answers show your natural patterns. We're not changing them; we're optimizing what you already do.

Your current rhythm:
- Natural wake time and sleep pressure build
- Peak energy windows throughout the day
- Stress patterns tied to your schedule
- Recovery gaps and rest quality

## 5 CHANGES THAT WORK (Backed by Research)

### 1. Fixed Sleep-Wake Timing (Consistency > Duration)
Clinical sleep research shows sleeping 7 hours at irregular times harms you more than sleeping 6 hours consistently (Walker, 2017). Pick a wake time. Stick to it—even weekends.
→ Your baseline: Set one wake time for 30 days.

### 2. Morning Light Exposure (30 Minutes, No Glasses)
Light hitting your eyes 30 minutes after waking sets your circadian clock forward, making evening sleep come earlier (Chang et al., 2015, PNAS). No special light box needed. Real sunlight works.
→ Your action: Step outside for 20-30 minutes after waking.

### 3. Meal Timing Windows (Eating Inside a 10–12 Hour Window)
Eating across a compressed window (e.g., 8am–6pm) aligns with your circadian system. Eating 16+ hours per day disrupts insulin sensitivity and sleep quality (Chaix et al., 2014, Cell Metabolism).
→ Your action: Identify your natural eating window and stay consistent.

### 4. Movement Before Afternoon (Any Intensity)
Physical activity in the morning and early afternoon strengthens circadian signals and reduces evening cortisol (Thorp et al., 2015, Diabetes Care). Gym-level intensity isn't required.
→ Your action: 20-minute walk, yoga, or light strength work—morning or midday.

### 5. No Screens 1 Hour Before Sleep
Blue light suppresses melatonin by 85% (Chang et al., 2015). Reading, conversation, or a warm shower trigger melatonin release instead.
→ Your action: Stop screens at your target bedtime minus 60 minutes.

## HYDRATION BASICS

Chronic mild dehydration impairs cognition and mood (Popkin et al., 2010, Nutrition Reviews). Simple protocol:
- Upon waking: 500ml water
- With each meal: 250ml water
- Between meals: Drink if thirsty

That's it. No "gallon per day" nonsense—context matters (climate, activity, diet).

## STRESS ASSESSMENT

Your stress score reflects how your nervous system is currently regulated. Chronic elevation suppresses immune function and disrupts sleep architecture (Slavich & Irwin, 2014). Three evidence-backed tools:

**Box Breathing** (Laborde et al., 2016)
- Inhale 4 counts, hold 4, exhale 4, hold 4.
- Do 5 rounds when stress spikes.
- Activates parasympathetic nervous system in minutes.

**Movement as stress relief** (Schuch et al., 2016)
- 20-30 minutes of moderate activity reduces cortisol comparable to anti-anxiety medication.
- Walking counts. Intensity doesn't define benefit.

**Sleep debt compounds stress** (Walker, 2017)
- One night of poor sleep increases amygdala (fear center) reactivity by 60%.
- Fix sleep first. Stress tools work better when rested.

## YOUR 30-DAY START

Week 1: Fix sleep timing
- Set one wake time. Commit to it.
- Get morning light.

Week 2: Add meal consistency
- Define your 10–12 hour eating window.
- Eat breakfast within 2 hours of waking.

Week 3: Add movement
- 20-minute walk or light workout, morning or midday, 3x this week.
- Journal energy levels before and after.

Week 4: Assess & reset
- How's your energy? Sleep quality improved?
- Which changes stuck? Which didn't?
- Plan next steps: Free Blueprint has given you a foundation. Premium adds structure.

## SCIENCE CITED

Dijk, D. J., & Archer, S. N. (2010). PERIOD3, Circadian Phenotypes, and Sleep Homeostasis. Sleep Health, 33(Suppl 1), S7–S13.

Walker, M. (2017). Why We Sleep. Scribner.

Chaix, A., et al. (2014). Time-Restricted Feeding Is a Preventative and Therapeutic Intervention Against Diverse Nutritional Challenges. Cell Metabolism, 20(6), 991–1005.

Chang, A. M., et al. (2015). Evening Use of Light-Emitting eReaders Negatively Affects Sleep, Circadian Timing, and Next-Morning Alertness. PNAS, 112(4), 1232–1237.

Popkin, B. M., et al. (2010). Water, Hydration, and Health. Nutrition Reviews, 68(8), 439–458.

Schuch, F. B., et al. (2016). Exercise as a Treatment for Depression: A Meta-Analysis Adjusting for Publication Bias. Journal of Psychiatric Research, 77, 42–51.

Slavich, G. M., & Irwin, M. R. (2014). From Stress to Inflammation and Major Depressive Disorder: A Social Signal Transduction Theory of Depression. Psychological Bulletin, 140(3), 774–815.

---

Next Step: Ready to go deeper? Upgrade to Essential Blueprint for personalized meal timing, movement plans, and sleep optimization specific to your schedule.
`,
};

// ESSENTIAL BLUEPRINT - Structured beginner plan
export const ESSENTIAL_BLUEPRINT: Product = {
  id: "essential-blueprint",
  name: "Essential Blueprint",
  description: "Personalized meal timing and movement framework",
  price: 599,
  color: "blue",
  icon: "star",
  link: "/buy-essential",
  details: [
    "Meal timing customized to your schedule",
    "3-day structured movement plan",
    "Sleep environment & hygiene protocol",
    "Stress tools for your nervous system",
    "8-week progress tracking system",
    "Weekly accountability checklist",
  ],
  pdfContent: `# ESSENTIAL BLUEPRINT
Your Personalized 8-Week Plan
Generated: ${new Date().toLocaleDateString()}
Price: ₹599

## YOUR CUSTOM FOUNDATION

This blueprint tailors sleep, food timing, and movement to your actual schedule. Not generic advice—what works for you, based on your answers.

## SECTION 1: YOUR CIRCADIAN PROFILE

Circadian science shows your natural wake time, eating schedule, and activity timing must align for optimal function (Dominques et al., 2014, Nutrients). We've mapped your pattern.

### Your Sleep & Wake Cycle
[Based on quiz responses]
- Optimal wake time: [Your time]
- Optimal sleep onset: [Time for 7–8 hours]
- Peak energy windows: [Morning / midday / evening]
- Energy dip times: [When cortisol naturally drops]

Action: Keep wake time within 30 minutes every day, including weekends. Even sleep hygiene fails without circadian consistency.

## SECTION 2: MEAL TIMING FRAMEWORK

Meal timing isn't about macros yet—it's about when you eat. Research shows eating outside your circadian window impairs glucose control, sleep, and satiety hormones (Chaix et al., 2014; Scheer et al., 2009).

### Your Eating Window
Based on your natural wake time and activity patterns:
- Breakfast target: [Time, within 2 hours of waking]
- Lunch target: [Time, ~6 hours after breakfast]
- Dinner target: [Time, 2–3 hours before sleep]
- Eating window closes: [Typically 10–12 hours]

### Basic Protein + Fiber at Each Meal
Research shows protein and fiber reduce hunger, stabilize blood glucose, and improve satiety (Veldhorst et al., 2008, American Journal of Clinical Nutrition).

Each meal should have:
- Protein source: Egg, Greek yogurt, paneer, chicken, lentils, tofu
- Fiber source: Oat, vegetables, fruit, legume
- Healthy fat: Olive oil, nuts, avocado, coconut oil

Specific foods matched to your dietary preferences [from quiz].

### Hydration Protocol
Link between water intake and cognitive performance is strong (Edmonds et al., 2013, Appetite). Your plan:
- Morning: 500ml within 30 minutes of waking
- Before lunch: 250ml
- Lunch: 250ml with food
- Afternoon: 250ml
- Evening: Reduce 3 hours before sleep (minimizes nighttime urination)
- Total target: 2–2.5 liters daily [adjusted for climate and activity]

## SECTION 3: MOVEMENT FRAMEWORK (3 DAYS/WEEK)

Exercise physiology shows consistency beats intensity for beginners (Schoenfeld et al., 2016). Three days per week of modest activity produces better adherence and results than sporadic high effort.

### Your 3-Day Weekly Structure

**Day 1: Full-Body Resistance (20–30 min)**
Light resistance or bodyweight. Progressive: Week 1–2, learn movement. Week 3–4, add weight. Week 5–8, increase reps/weight.
- 5 min warm-up (walking, mobility)
- 15 min: 3 sets each of 2–3 compound movements (push, pull, squat, hinge)
- 5 min cool-down (stretching)
Examples: Bodyweight push-ups, assisted pull-ups, goblet squats, dumbbell rows.

**Day 2: Zone 2 Cardio (25–35 min)**
"Zone 2" is conversational pace—you can speak in short sentences but not sing (Seiler & Tønnessen, 2009). This is where endurance and fat oxidation improvements happen.
- Walk, jog, bike, swim, row—your choice
- Pace: You can hold a conversation
- Duration: 25–35 minutes
- Frequency: 1x/week minimum for aerobic adaptation

**Day 3: Movement + Flexibility (20–30 min)**
Mobility work, stretching, and low-intensity activity reduce injury risk and improve movement quality (Behm et al., 2016, Applied Physiology, Nutrition & Metabolism).
- Yoga, tai chi, Pilates, or guided stretching
- Or: 20-minute leisurely walk + 10 minutes static stretching
- Focus areas: Hip, shoulder, spine mobility based on your desk/activity patterns

Spacing: Ideally Mon / Wed / Fri or similar (recovery days between).

## SECTION 4: SLEEP PROTOCOL

Eight-week evidence shows sleep is the foundation (Walker, 2017). Everything else—diet, exercise, stress tools—works better when sleep is consistent and adequate (7–9 hours).

### Your Sleep Environment
- Room temperature: 65–68°F (18–20°C) is optimal for most (Okamoto-Mizuno & Mizuno, 2012)
- Darkness: < 5 lux (blackout curtains, eye mask)
- Quiet: < 30 dB (earplugs, white noise if needed)
- Bed: Comfortable mattress and pillow (critical—cheap sleep surfaces impair sleep quality)

### Your Evening Routine (Start 60 Minutes Before Sleep)
- [Your sleep time] minus 60 min: Screen cutoff. No blue light.
- [minus 30 min]: Warm bath/shower or herbal tea (chamomile, passionflower)
- [minus 10 min]: Dim lights. Cool room. Consistency matters more than ritual.

### Sleep Supplements (If Needed)
Magnesium glycinate (300–400mg) 60 minutes before bed is evidence-backed for sleep latency and depth (Abbasi et al., 2012). Only if poor sleep persists after 2 weeks of protocol consistency.

## SECTION 5: STRESS TOOLS

Chronic stress dysregulates cortisol, impairs sleep, and suppresses immunity (Slavich & Irwin, 2014). Three evidence-backed tools for your nervous system:

### Tool 1: Breathing (5 minutes daily)
Box breathing activates parasympathetic tone in 5 minutes (Laborde et al., 2016):
- Inhale 4 counts
- Hold 4 counts
- Exhale 4 counts
- Hold 4 counts
- Repeat 5 rounds

Do daily, or when stress spikes.

### Tool 2: Movement (20–30 minutes, 3x/week)
Your movement plan already covers this. But separately: Any low-to-moderate intensity activity reduces cortisol and anxiety comparable to medication (Schuch et al., 2016). Walking counts.

### Tool 3: Social Connection (Minimum 1x/week)
Loneliness increases inflammation and cortisol (Holt-Lunstad et al., 2015). 30 minutes of meaningful social interaction (in-person or video) weekly buffers stress resilience.

## SECTION 6: 8-WEEK PROGRESS TRACKING

### Weekly Check-In (2 minutes)
Track:
- Sleep hours and quality (1–10)
- Energy level (1–10) morning / midday / evening
- Stress level (1–10)
- Movement sessions completed
- Meal timing consistency (%)
- Focus / mood (1–10)

### Monthly Assessment (Week 4 & 8)
- Photos (same time, same place, same light)
- Measurements (waist, chest)
- How clothes fit
- Exercise performance (reps, weights, duration)
- Sleep improvements
- Energy consistency
- Stress reactivity (getting better?)
- Any injuries or pain changes?

### Expected Timeline
- Week 1–2: Sleep improves, energy stabilizes
- Week 3–4: Mood lifts, stress response improves
- Week 5–8: Visible changes, exercise performance increases, consistency becomes automatic

## SCIENCE CITED

Abbasi, B., et al. (2012). The Effect of Magnesium Supplementation on Primary Insomnia in Elderly. Journal of Research in Medical Sciences, 17(12), 1161–1169.

Behm, D. G., et al. (2016). Current Concepts in Flexibility and Mobility. Applied Physiology, Nutrition & Metabolism, 41(6), S1–S11.

Chaix, A., et al. (2014). Time-Restricted Feeding Is a Preventative and Therapeutic Intervention. Cell Metabolism, 20(6), 991–1005.

Dominques, R., et al. (2014). Meal Timing. Nutrients, 6(10), 4694–4717.

Edmonds, C. J., et al. (2013). Dehydration Impairs Cognition and Mood. Appetite, 65, 27–33.

Holt-Lunstad, J., et al. (2015). Loneliness and Social Isolation as Risk Factors. Perspectives on Psychological Science, 10(2), 227–237.

Laborde, S., et al. (2016). The Capacity to Regulate Emotions is Associated with Prolonged Survival in Aging. Journal of Aging Research, 2016, 9816148.

Okamoto-Mizuno, K., & Mizuno, K. (2012). Effects of Thermal Environment on Sleep. Sleep Medicine Reviews, 16(4), 298–310.

Scheer, F. A., et al. (2009). Impact of the Daily Timing of Physical Exercise on Biological Rhythms. PNAS, 106(34), 14069–14074.

Schoenfeld, B. J., et al. (2016). Dose-Response Relationships Between Exercise Volume and Muscle Hypertrophy. Sports Medicine, 46(11), 1689–1697.

Schuch, F. B., et al. (2016). Exercise as a Treatment for Depression. Journal of Psychiatric Research, 77, 42–51.

Seiler, S., & Tønnessen, E. (2009). Intervals, Thresholds, and Long Slow Distance. SportScience, 13, 32–53.

Slavich, G. M., & Irwin, M. R. (2014). From Stress to Inflammation and Major Depressive Disorder. Psychological Bulletin, 140(3), 774–815.

Veldhorst, M. A., et al. (2008). Protein-Induced Satiety. American Journal of Clinical Nutrition, 87(5), 1562S–1569S.

Walker, M. (2017). Why We Sleep. Scribner.

---

Ready for advanced optimization? Premium Blueprint adds personalized nutrient strategy, advanced fitness periodization, and blood work recommendations.
`,
};

// PREMIUM BLUEPRINT - Advanced, detailed, high-value
export const PREMIUM_BLUEPRINT: Product = {
  id: "premium-blueprint",
  name: "Premium Blueprint",
  description: "Metabolic optimization + periodized training system",
  price: 1499,
  color: "green",
  icon: "zap",
  link: "/buy-premium",
  details: [
    "Calorie & macro calculation for your goals",
    "Recommended blood work panel",
    "5-day periodized training program",
    "Evidence-based supplement strategy",
    "90-day nutrition & performance protocol",
    "Monthly updates and adjustments",
    "Priority email support",
  ],
  pdfContent: `# PREMIUM BLUEPRINT
90-Day Advanced System
Generated: ${new Date().toLocaleDateString()}
Price: ₹1,499

## METABOLIC FOUNDATION

Your metabolic rate and calorie needs are calculated—not estimated. This section translates nutrient science into numbers specific to your goal.

### Your Calculated Resting Metabolic Rate (RMR)
Using Mifflin-St Jeor equation based on your age, sex, height, weight:
- RMR: [X] calories/day at complete rest
- This is your biological minimum energy expenditure

### Total Daily Energy Expenditure (TDEE)
Adding your activity level:
- TDEE: [X] calories/day with your current activity
- This is maintenance level—no change in body composition

### Calorie Strategy by Goal
**If losing weight:**
- Calorie deficit: 300–500 calories below TDEE
- This produces ~0.5 lb/week fat loss (Helms et al., 2014)
- Target protein: 1.8–2.2 g/kg to preserve muscle (Helms et al., 2014)

**If gaining muscle:**
- Calorie surplus: 300–500 calories above TDEE
- This supports muscle protein synthesis (Schoenfeld et al., 2016)
- Target protein: 1.8–2.2 g/kg for hypertrophy

**If maintaining:**
- Eat at TDEE
- Protein: 1.6–1.8 g/kg for health and body composition

### Your Macronutrient Targets
Based on your goal and activity level:
- Protein: [X]g/day ([Y]% of calories)
- Carbohydrates: [X]g/day ([Y]% of calories)
- Fat: [X]g/day ([Y]% of calories)

Ratios matter because protein preserves muscle, carbs fuel performance, and fat supports hormones and satiety.

## RECOMMENDED BLOOD WORK PANEL

Evidence-based testing informs your personalization and tracks adaptation (Helms et al., 2014). Testing before, at week 6, and week 12 shows what's working.

### Core Panel (Baseline + Week 12)
- Complete Metabolic Panel (glucose, kidney, liver, electrolytes)
- Lipid Panel (cholesterol, LDL, HDL, triglycerides)
- Thyroid Function (TSH, Free T4)
- Vitamin D (25-hydroxyvitamin D)
- Iron status (ferritin, serum iron, TIBC)
- Hemoglobin (anaemia screening)

### Why Each Matters
- Glucose & insulin: Shows how your body tolerates carbs
- Lipids: Baseline cardiovascular health
- Thyroid: Confirms metabolic rate assumptions
- Vitamin D: Linked to immunity, mood, bone health
- Iron: Women especially—low iron impairs performance and mood

Talk to your doctor. These tests cost ₹2,000–4,000 in India.

## 5-DAY PERIODIZED TRAINING SYSTEM

Periodization—varying volume, intensity, and movement patterns—produces better strength and muscle gains than random training (Schoenfeld et al., 2016). Five days/week allows focused stimulus and adequate recovery.

### Your 5-Day Split
Day 1: Lower Body Strength (Squat emphasis)
Day 2: Upper Body Push (Chest, shoulders, triceps)
Day 3: Active Recovery (Walk, mobility, yoga)
Day 4: Upper Body Pull (Back, biceps)
Day 5: Full-Body Power (Olympic lift patterns)
Day 6–7: Rest

### Progression Model (12 Weeks)
**Weeks 1–4: Strength Foundation**
- Higher weight (80–85% of 1RM est.), lower reps (4–6)
- Focus: Technique, neural adaptation
- Volume: 12–15 sets/muscle group/week
- Rest: 3–4 minutes between heavy sets

**Weeks 5–8: Hypertrophy (Muscle)**
- Moderate weight (65–75% of 1RM), higher reps (8–12)
- Focus: Time under tension, metabolic stress
- Volume: 15–20 sets/muscle group/week
- Rest: 60–90 seconds between sets

**Weeks 9–12: Power + Volume**
- Variable intensity, explosive reps
- Focus: Rate of force development
- Volume: 15–18 sets/muscle group/week
- Rest: 2–3 minutes, fully recovered

### Example Day: Lower Body Strength

Warm-up (5 min):
- 30 jumping jacks, 10 bodyweight squats, 10 leg swings each direction

Main Work:
- Back squat: 5 sets x 3–5 reps (heavy, 3 min rest)
- Romanian deadlift: 4 sets x 6–8 reps (2 min rest)
- Leg press or hack squat: 3 sets x 8–10 reps (90 sec rest)
- Leg curl or Nordics: 3 sets x 8–10 reps (90 sec rest)
- Planks or core: 3 sets x max time / 20 reps (60 sec rest)

Total: ~45 minutes, 16 sets/leg muscles.

## SUPPLEMENT STRATEGY

Supplements enhance basics—sleep, food, training—not replace them (Schoenfeld et al., 2017). This strategy is based on evidence and gaps in your diet.

### Essential (Daily)
- Creatine monohydrate: 3–5g/day (Schoenfeld et al., 2017; Kreider et al., 2017)
  Proven: Increases strength, muscle mass, cognition. Safe at this dose.
  
- Vitamin D3: 2,000–4,000 IU/day (reviewed in Wacker & Holick, 2013)
  Your level from blood work determines if you need more.

- Omega-3 (EPA+DHA): 2–3g/day (Simopoulos, 2016)
  Anti-inflammatory, supports cardiovascular and mental health.

### If Your Testing Shows Deficiency
- Vitamin B12: If low on blood test
- Iron: Only if you test iron-deficient
- Magnesium glycinate: If your sleep protocol alone isn't working

### For Performance (Optional)
- Caffeine: 3–6 mg/kg 30–60 min before training (Grgic et al., 2019)
  Only if tolerated; skip if sensitive to stimulants.
  
- Beta-alanine: 3–5g/day split doses (Schoenfeld et al., 2017)
  Buffers lactate in high-rep work. Noticeable in weeks 3–4.

### NOT Recommended (Limited Evidence)
- Fat burners, testosterone boosters, "metabolic enhancers"
- Focus on the proven interventions above.

### Timing
- Creatine, Omega-3, D3: With breakfast
- Magnesium: 60 min before sleep
- Caffeine: 30–60 min before training
- Food first. Supplements fill gaps.

## 90-DAY NUTRITION PROTOCOL

Eating patterns support your training goal.

### Example Day (Calorie & Macro Target: 2,200 cal, 150g protein, 225g carbs, 73g fat)

**Breakfast (7 AM)**
2-egg omelette + 50g oats + 1 tbsp olive oil
- 550 cal | 22g protein | 55g carbs | 18g fat

**Snack (10 AM)**
Greek yogurt 150g + 30g granola
- 220 cal | 20g protein | 22g carbs | 4g fat

**Lunch (1 PM)**
150g chicken breast + 150g basmati rice + 100g broccoli
- 560 cal | 45g protein | 65g carbs | 8g fat

**Pre-Training Snack (3:30 PM, before 4:30 PM training)**
1 medium banana + 20g peanut butter
- 320 cal | 10g protein | 35g carbs | 16g fat

**Dinner (7 PM)**
150g salmon + 200g sweet potato + 100g spinach + 1 tsp olive oil
- 550 cal | 35g protein | 48g carbs | 18g fat

**Before Sleep (10 PM, optional)**
Casein protein shake or Greek yogurt: 200 cal | 20g protein | 10g carbs | 3g fat

**Total: ~2,400 cal | 152g protein | 235g carbs | 67g fat**

Adjust portions up/down based on your calculated TDEE.

## SCIENCE CITED

Grgic, J., et al. (2019). Caffeine Ingestion and Muscle Strength: A Meta-Analysis. Journal of the International Society of Sports Nutrition, 16(1), 13.

Helms, E. R., et al. (2014). Evidence-Based Recommendations for Natural Bodybuilding Contest Preparation. Journal of Sports Medicine & Physical Fitness, 54(2), 171–186.

Kreider, R. B., et al. (2017). International Society of Sports Nutrition Position Stand: Safety and Efficacy of Creatine Supplementation. Journal of the International Society of Sports Nutrition, 14, 18.

Schoenfeld, B. J., et al. (2016). Dose-Response Relationships Between Exercise Volume and Muscle Hypertrophy. Sports Medicine, 46(11), 1689–1697.

Schoenfeld, B. J., et al. (2017). International Society of Sports Nutrition Position Stand: Protein and Exercise. Journal of the International Society of Sports Nutrition, 14, 20.

Simopoulos, A. P. (2016). An Increase in the Omega-6/Omega-3 Fatty Acid Ratio Increases the Risk. Open Heart, 3(1), e000385.

Wacker, M., & Holick, M. F. (2013). Sunlight and Vitamin D: A Global Perspective. Dermato-Endocrinology, 5(1), 51–108.

---

Need 1-on-1 adjustments and accountability? Complete Coaching adds personalized guidance and weekly check-ins.
`,
};

// COMPLETE COACHING - Elite, personalized, high-touch
export const COMPLETE_COACHING: Product = {
  id: "complete-coaching",
  name: "Complete Coaching",
  description: "12-week personalized coaching program with weekly support",
  price: 9999, // 3-month flat rate; can also offer ₹3,999/month
  color: "orange",
  icon: "heart",
  link: "/buy-coaching",
  details: [
    "Two 1-on-1 strategy sessions (60 min each)",
    "Weekly accountability & form checks",
    "Personalized nutrition & training adjustments",
    "Direct messaging support (24–48 hr response)",
    "Video form review for your lifts",
    "Behavior-change coaching & habit building",
    "Monthly progress assessments",
    "Private community access",
  ],
  pdfContent: `# COMPLETE COACHING
12-Week Personalized Program
Generated: ${new Date().toLocaleDateString()}
Price: ₹9,999 for 3 months (or ₹3,999/month)

## YOU GET A COACH

This isn't just information. It's a real person who reviews your work, adjusts your plan, and keeps you accountable.

## WEEK 1: ASSESSMENT & CUSTOMIZATION

### Session 1 (60 minutes): Your Baseline
- Detailed review of your health history, injuries, goals
- Movement assessment (how you squat, deadlift, push, pull)
- Lifestyle audit (sleep, stress, work, recovery)
- Goal clarification: What does success look like?
- Personalized training & nutrition plan creation

### Session 2 (60 minutes, Week 2): Deep Dive Implementation
- Detailed walkthrough of your nutrition plan (meal prep, timing, food choices)
- Training plan review (how to perform each exercise, progression)
- Sleep protocol optimization for your specific schedule
- Stress tools matched to your preferences
- Success metrics definition—how we measure progress

## WEEKS 1–12: WEEKLY ACCOUNTABILITY

### What Happens Each Week
- You submit: Photos, body weight, workouts completed, nutrition adherence, sleep logs, stress/mood
- Coach reviews and provides: Form corrections (video analysis if needed), nutrition tweaks, training progression, motivation, barriers troubleshooting
- Direct messaging: You ask questions; I answer within 24–48 hours
- Biweekly check-in calls: 15–20 min progress review + plan adjustments

### Example Week Check-In
Mon: You log your training (squat, bench, deadlift videos uploaded if form question)
Wed: I review form, suggest tweaks, adjust weights for next session
Fri: You submit nutrition adherence and sleep logs
Sat: I review, suggest meal timing shifts or food swaps if needed
Sun: You book time for weekly call

## BEHAVIOR CHANGE COMPONENT

The biggest gap between plans and results is behavior. This program includes:

- **Habit stacking**: Linking new behaviors to existing routines (e.g., "after morning coffee, I take vitamin D")
- **Barrier ID**: What's preventing consistency? We remove obstacles.
- **Accountability design**: Your check-in style (e.g., daily logs vs. weekly summary; public vs. private)
- **Motivation tuning**: Why does your goal matter? We keep it clear and connected.
- **Progress celebration**: Wins matter, small and large.

Research shows coaching+behavior change produces 3–4x better adherence than plans alone (Teixeira et al., 2015).

## FORM REVIEW & INJURY PREVENTION

One of coaching's biggest benefits: You never perform an exercise wrong for 8 weeks.

- Video submission: You record a set or rep of your main lifts
- Analysis: Form cues, corrections, regressions if needed
- Safety: Injury prevention is embedded, not an afterthought

## MONTHLY DEEP-DIVE ASSESSMENT (Weeks 4, 8, 12)

Full progress evaluation:
- Photos, weight, measurements
- Strength metrics (how much weight, how many reps?)
- Energy, sleep, mood, stress levels
- Lab review (if done: comparing to baseline)
- Plan adjustments based on adaptation
- Next month's focus (double down on what's working; pivot what isn't)

## COMMUNITY ACCESS

Private community of other coaching clients:
- Meal ideas and recipes
- Workout motivation and support
- Q&A with coach and peers
- Monthly group challenge (optional)
- No judgment, high accountability

## WHAT'S INCLUDED

✅ Personalized training plan (12 weeks, auto-progressively adjusted)
✅ Nutrition plan (calorie, macro, meal timing customized to your life)
✅ Sleep & stress protocol personalized
✅ Blood work recommendations and interpretation
✅ Supplement strategy (only evidence-backed)
✅ Weekly accountability
✅ Form review (unlimited video submissions)
✅ 24–48 hour support response (email/messaging)
✅ Monthly assessments and adjustments
✅ Behavior-change coaching
✅ Private community access

## EXPECTED TIMELINE

**Weeks 1–2:** Foundation + baseline habits
- Sleep consistency improves
- Meal timing lock-in
- Training momentum begins

**Weeks 3–6:** Visible adaptation
- Strength gains (neural adaptation)
- Slight body composition change
- Energy consistency
- Exercise performance improves

**Weeks 7–10:** Acceleration
- Strength/muscle gains accelerate
- Noticeable visual changes
- Stress resilience improves
- Habits feel automatic

**Weeks 11–12:** Integration
- Habits are lifestyle now
- Plan for long-term (beyond coaching)
- Sustainability strategy
- Reflect on wins

## SCIENCE CITED

Teixeira, P. J., et al. (2015). Exercise, Physical Activity, and Self-Determination Theory: A Systematic Review. International Journal of Behavioral Nutrition & Physical Activity, 12(1), 154.

---

**Ready to start? Click below to book your first session.**
/contact-coach
`,
};

// PRODUCTS ARRAY FOR BACKWARDS COMPATIBILITY
export const products: Product[] = [
  FREE_BLUEPRINT,
  ESSENTIAL_BLUEPRINT,
  PREMIUM_BLUEPRINT,
  COMPLETE_COACHING,
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

// PREMIUM ADD-ONS - Six distinct, evidence-based micro-products
export const addOns: AddOn[] = [
  {
    id: "dna-analysis",
    name: "DNA Analysis Add-on",
    description:
      "Genetic insight into nutrient absorption, caffeine sensitivity, and exercise response",
    price: 1499,
    icon: "dna",
    features: [
      "MTHFR methylation status (folate processing)",
      "CYP1A2 caffeine metabolism (fast vs. slow)",
      "ACTN3 muscle fiber type (power vs. endurance)",
      "What your genes can't predict (limitations explained)",
    ],
  },
  {
    id: "advanced-supplement-stack",
    name: "Advanced Supplement Stack",
    description:
      "Lab-backed supplement protocol specific to your deficiencies and goals",
    price: 2999,
    icon: "pill",
    features: [
      "Deficiency testing interpretation",
      "Personalized 7–10 supplement protocol",
      "Sourcing guide (brands, vendors)",
      "Timing and stacking strategy",
    ],
  },
  {
    id: "athletic-performance",
    name: "Athletic Performance Add-on",
    description:
      "Sport-specific training, energy systems, and fuel-timing strategy",
    price: 1999,
    icon: "target",
    features: [
      "Sport-specific periodization (12-week protocol)",
      "Energy system training (aerobic, lactate, alactic)",
      "Fueling strategy for competition",
      "Recovery protocols post-competition",
    ],
  },
  {
    id: "family-nutrition",
    name: "Family Nutrition Plan",
    description: "Extend your plan to up to 4 family members with customized blueprints",
    price: 3499,
    icon: "users",
    features: [
      "Up to 4 family member assessments",
      "Individual meal timing frameworks",
      "Family-friendly recipes (accommodating all)",
      "Grocery list optimization for whole household",
    ],
  },
  {
    id: "womens-hormonal-health",
    name: "Women's Hormonal Health Add-on",
    description:
      "Menstrual cycle nutrition, PCOS/thyroid support, and hormone-aware training",
    price: 1799,
    icon: "heart",
    features: [
      "Menstrual cycle-synced nutrition (follicular/luteal)",
      "PCOS insulin-sensitivity strategies",
      "Thyroid-supporting protocols",
      "Training adjustments by cycle phase",
    ],
  },
  {
    id: "mens-fitness-optimization",
    name: "Men's Fitness Optimization Add-on",
    description:
      "Muscle-building framework, testosterone-supporting habits, and strength progressions",
    price: 1799,
    icon: "zap",
    features: [
      "Muscle-building nutrition (calorie surplus, protein timing)",
      "Testosterone-supporting sleep and strength training",
      "Progressive overload programming (12 weeks)",
      "Performance plateau-breaking strategies",
    ],
  },
];
