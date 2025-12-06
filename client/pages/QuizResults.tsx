import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  CheckCircle,
  Crown,
  Download,
  Mail,
  User,
  CreditCard,
  Lock,
  Star,
  Brain,
  Heart,
  Target,
  Clock,
  Zap,
  FileText,
  ArrowRight,
  Gift,
  ArrowLeft,
} from "lucide-react";
import LegalFooter from "@/components/LegalFooter";

const planFeatures = {
  "free": {
    name: "Free Blueprint",
    price: 0,
    features: [
      "Complete lifestyle questionnaire analysis",
      "Metabolic baseline assessment",
      "Simple meal timing recommendations",
      "General fitness guidance",
      "Sleep hygiene tips",
    ],
    icon: Gift,
    color: "from-gray-500 to-gray-600",
  },
  "essential": {
    name: "Essential Blueprint",
    price: 999,
    features: [
      "Advanced lifestyle & nutrition analysis",
      "Evidence-based macro & calorie targets",
      "15-page personalized PDF blueprint",
      "Customized 7-day meal plan",
      "Home-based workout routines",
      "Supplement recommendations",
      "Sleep optimization protocol",
      "Stress management techniques",
    ],
    icon: Gift,
    color: "from-emerald-500 to-green-600",
  },
  "premium": {
    name: "Premium Blueprint",
    price: 1999,
    features: [
      "Everything in Essential",
      "Optional DNA analysis integration",
      "Metabolic optimization insights",
      "Customized supplement stack",
      "Weekly meal prep guides & recipes",
      "Advanced fitness routine (6x/week)",
      "Mental health & cognitive optimization",
      "Hormone balance insights",
      "30-day progress tracking tools",
    ],
    icon: Star,
    color: "from-purple-500 to-pink-600",
  },
  "pro": {
    name: "Complete Coaching",
    price: 4999,
    features: [
      "Everything in Premium Plan",
      "1-on-1 wellness consultation (2 sessions)",
      "Monthly accountability calls (3 months)",
      "WhatsApp group support access",
      "Custom shopping list by location",
      "Recipe variations & meal flexibility",
      "Advanced blood work recommendations",
      "Family nutrition planning",
    ],
    icon: Crown,
    color: "from-yellow-500 to-orange-600",
  },
};

const recommendPlan = (
  quiz: any,
  blueprint: any,
): keyof typeof planFeatures => {
  if (!quiz || !blueprint) {
    return "premium";
  }

  const supplementDepth = blueprint?.supplementPlan?.optional?.length || 0;
  if (quiz.dnaUpload === "yes-upload" || quiz.medicalConditions !== "none" || supplementDepth > 2) {
    return "pro";
  }

  if (
    quiz.weightGoal !== "maintain" ||
    quiz.stressLevel === "very-high" ||
    quiz.sleepHours === "less-than-5" ||
    supplementDepth > 0 ||
    quiz.exercisePreference === "none"
  ) {
    return "premium";
  }

  return "essential";
};

export default function QuizResults() {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<any>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisId, setAnalysisId] = useState<string>("");
  const [blueprint, setBlueprint] = useState<any>(null);

  useEffect(() => {
    const savedQuizData = localStorage.getItem("quizData");
    const savedAnalysisId = localStorage.getItem("analysisId");
    const savedBlueprint = localStorage.getItem("blueprint");
    if (!savedQuizData || !savedAnalysisId || !savedBlueprint) {
      navigate("/quiz");
      return;
    }

    const parsedQuiz = JSON.parse(savedQuizData);
    const parsedBlueprint = JSON.parse(savedBlueprint);

    setQuizData(parsedQuiz);
    setAnalysisId(savedAnalysisId);
    setBlueprint(parsedBlueprint);
    setAnalysisComplete(true);
  }, [navigate]);

  const handlePayment = async () => {
    if (!email || !selectedPlan || !analysisId) return;

    setIsProcessing(true);

    try {
      const amount = planFeatures[selectedPlan as keyof typeof planFeatures]?.price || 0;
      const resp = await fetch("/api/wellness/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, email, planType: selectedPlan, amount }),
      });
      if (!resp.ok) throw new Error("Payment API failed");
      const data = await resp.json();

      localStorage.setItem(
        "purchaseData",
        JSON.stringify({
          email,
          name,
          plan: selectedPlan,
          quizData,
          analysisId,
          downloadUrl: data.downloadUrl,
          purchaseDate: new Date().toISOString(),
        }),
      );
      navigate("/download");
    } catch (error) {
      console.error("Payment failed:", error);
      setIsProcessing(false);
    }
  };

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!analysisComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900">Preparing your results...</h2>
        </div>
      </div>
    );
  }

  const currentPlan = planFeatures[selectedPlan as keyof typeof planFeatures];
  const PlanIcon = currentPlan?.icon || Star;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Genewell
                </span>
                <div className="text-xs text-gray-500 font-medium">
                  WELLNESS AI
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-700">
                ✅ Analysis Complete
              </Badge>
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎉 Your Wellness Blueprint is Ready!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your responses, we've created a personalized plan that's
            perfect for your body type, lifestyle, and goals
          </p>
        </div>

        {/* Key Insights Preview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 border-purple-200 bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Your Type</h3>
              <p className="text-sm text-gray-600">
                {blueprint?.metabolismType?.type
                  ? `${blueprint.metabolismType.type[0].toUpperCase()}${blueprint.metabolismType.type.slice(1)} Metabolism`
                  : "Metabolism"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-200 bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Best Foods</h3>
              <p className="text-sm text-gray-600">
                {blueprint?.nutritionPlan?.bestFoods?.slice(0, 1)?.[0] || "Personalized foods"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Meal Timing</h3>
              <p className="text-sm text-gray-600">
                Breakfast {blueprint?.nutritionPlan?.mealTiming?.breakfast}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Exercise Style</h3>
              <p className="text-sm text-gray-600">
                {blueprint?.fitnessRoutine?.workoutType?.[0] || "Personalized"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Plan Selection */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {Object.entries(planFeatures).map(([planId, plan]) => {
            const isSelected = selectedPlan === planId;
            const isPopular = planId === "moderate-199";
            const IconComponent = plan.icon;

            return (
              <Card
                key={planId}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-2 border-purple-500 shadow-2xl scale-105"
                    : "border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg"
                } ${isPopular ? "ring-2 ring-purple-200" : ""}`}
                onClick={() => setSelectedPlan(planId)}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-purple-600">
                    ₹{plan.price}
                  </div>
                  <CardDescription>One-time payment</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-6 ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedPlan(planId)}
                  >
                    {isSelected ? "Selected Plan" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Checkout Form */}
        <Card className="max-w-2xl mx-auto border-2 border-purple-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center space-x-2">
              <CreditCard className="h-6 w-6 text-purple-600" />
              <span>Complete Your Order</span>
            </CardTitle>
            <CardDescription>
              Get instant access to your personalized wellness blueprint
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Selected Plan Summary */}
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${currentPlan?.color} rounded-xl flex items-center justify-center`}
                  >
                    <PlanIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {currentPlan?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Instant PDF download
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ₹{currentPlan?.price}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={!email || !name || isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-3 h-5 w-5" />
                  Get My Blueprint Now - ₹{currentPlan?.price}
                </>
              )}
            </Button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm pt-4 border-t">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>🔒 Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span>📧 Instant Email Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-pink-500" />
                <span>💰 30-Day Guarantee</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Preview */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What You'll Get Inside
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  15-Page PDF
                </h3>
                <p className="text-sm text-gray-600">
                  Complete wellness blueprint designed just for you
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Meal Plans</h3>
                <p className="text-sm text-gray-600">
                  7-day meal plan with exact timings and portions
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Exercise Guide
                </h3>
                <p className="text-sm text-gray-600">
                  Home workouts designed for your body type
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Progress Tracker
                </h3>
                <p className="text-sm text-gray-600">
                  Weekly goals and progress monitoring tools
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Button variant="outline" className="px-6 py-3">
              <Download className="mr-2 h-4 w-4" />
              Preview Sample Report
            </Button>
          </div>
        </div>
      </div>

      {/* Footer with Legal Links */}
      <LegalFooter />
    </div>
  );
}
