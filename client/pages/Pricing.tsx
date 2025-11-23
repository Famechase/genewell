import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import {
  Dna,
  Check,
  Star,
  Crown,
  Shield,
  Zap,
  Users,
  Download,
  ArrowLeft,
  Phone,
  Mail,
  Heart,
  Brain,
  FileText,
  Target,
} from "lucide-react";
import QuizGateModal from "@/components/QuizGateModal";
import LegalFooter from "@/components/LegalFooter";

const pricingPlans = {
  monthly: [
    {
      id: "free",
      name: "Free Blueprint",
      price: 0,
      currency: "₹",
      period: "One-time",
      description: "Start your wellness journey with basic insights",
      features: [
        "Complete lifestyle questionnaire analysis",
        "Basic body type classification",
        "Simple meal timing recommendations",
        "General fitness guidance",
        "Sleep hygiene tips",
        "Instant access to blueprint",
      ],
      limitations: [
        "No DNA integration",
        "Limited supplement guidance",
        "No coaching support",
      ],
      buttonText: "Get Free Blueprint",
      popular: false,
      color: "border-gray-200",
    },
    {
      id: "essential",
      name: "Essential Blueprint",
      price: 999,
      currency: "₹",
      period: "One-time",
      description: "Comprehensive personalized wellness plan",
      features: [
        "Advanced lifestyle & body composition analysis",
        "Ayurvedic constitution mapping",
        "15-page personalized PDF blueprint",
        "Customized 7-day meal plan with timing",
        "Home-based workout routines (3x per week)",
        "Supplement recommendations (3-5 items)",
        "Sleep optimization protocol",
        "Stress management techniques",
        "Progress tracking guide",
        "Email delivery & instant download",
      ],
      limitations: [],
      buttonText: "Buy Essential - ₹999",
      popular: false,
      color: "border-wellness-500",
    },
    {
      id: "premium",
      name: "Premium Blueprint",
      price: 1999,
      currency: "₹",
      period: "One-time",
      description: "Complete transformation with DNA analysis available",
      features: [
        "Everything in Essential",
        "Optional DNA analysis integration",
        "Metabolic optimization insights",
        "Customized supplement stack protocol",
        "Weekly meal prep guides & recipes",
        "Advanced fitness routine (6x per week)",
        "Mental health & cognitive optimization",
        "Hormone balance insights",
        "Energy and immunity protocols",
        "30-day progress tracking tools",
        "Priority email support",
        "Lifetime access & updates",
      ],
      limitations: [],
      buttonText: "Buy Premium - ₹1999",
      popular: true,
      color: "border-wellness-500",
    },
    {
      id: "pro",
      name: "Complete Coaching",
      price: 4999,
      currency: "₹",
      period: "One-time + 3-month support",
      description: "Premium plan plus personal wellness coaching",
      features: [
        "Everything in Premium Plan",
        "1-on-1 wellness consultation (2 sessions)",
        "Monthly accountability calls (3 months)",
        "WhatsApp group support access",
        "Custom shopping list by location",
        "Recipe variations & meal flexibility",
        "Supplement sourcing guidance",
        "Advanced blood work recommendations",
        "Lifestyle adjustment coaching",
        "Family nutrition planning",
        "24/7 priority support",
        "Quarterly progress assessments",
      ],
      limitations: [],
      buttonText: "Get Coaching - ₹4999",
      popular: false,
      color: "border-yellow-500",
    },
  ],
  yearly: [
    {
      id: "free",
      name: "Free Blueprint",
      price: 0,
      currency: "₹",
      period: "One-time",
      description: "Start your wellness journey with basic insights",
      features: [
        "Complete lifestyle questionnaire analysis",
        "Basic body type classification",
        "Simple meal timing recommendations",
        "General fitness guidance",
        "Sleep hygiene tips",
        "Instant access to blueprint",
      ],
      limitations: [
        "No DNA integration",
        "Limited supplement guidance",
        "No coaching support",
      ],
      buttonText: "Get Free Blueprint",
      popular: false,
      color: "border-gray-200",
    },
    {
      id: "essential",
      name: "Essential + 6-Month Support",
      price: 1999,
      originalPrice: 2997,
      currency: "₹",
      period: "6-month access",
      description: "Essential blueprint with extended support",
      features: [
        "Everything in Essential Blueprint",
        "6 months of email support",
        "Quarterly blueprint updates",
        "Monthly wellness newsletters",
        "Community access",
        "Follow-up consultation (1 session)",
        "Progress reassessment at month 3",
        "Seasonal meal plan adjustments",
      ],
      limitations: [],
      buttonText: "Get Essential + Support",
      popular: false,
      color: "border-wellness-500",
      savings: "Save ₹998",
    },
    {
      id: "premium",
      name: "Premium Yearly Plan",
      price: 3999,
      originalPrice: 5997,
      currency: "₹",
      period: "1 year access",
      description: "Complete wellness with yearly support",
      features: [
        "Everything in Premium Blueprint",
        "12 months of priority support",
        "Monthly wellness check-ins",
        "Quarterly in-depth assessments",
        "Bi-weekly recipe & meal ideas",
        "Advanced fitness progression plans",
        "Seasonal lifestyle adjustments",
        "Annual progress celebration & reset",
        "Early access to new features",
        "Guest pass for 1 family member",
      ],
      limitations: [],
      buttonText: "Get Premium Yearly",
      popular: true,
      color: "border-wellness-500",
      savings: "Save ₹1998",
    },
    {
      id: "pro",
      name: "Master Coaching",
      price: 9999,
      originalPrice: 14997,
      currency: "₹",
      period: "1 year + personal coaching",
      description: "Complete transformation with ongoing support",
      features: [
        "Everything in Premium Yearly Plan",
        "Monthly 1-on-1 coaching calls (12 months)",
        "Private WhatsApp coaching group",
        "Custom meal plan adjustments every month",
        "Supplement optimization quarterly",
        "Advanced testing recommendations",
        "Family nutrition planning",
        "Lifestyle habit formation support",
        "Performance optimization protocols",
        "Annual wellness retreat invitation",
        "VIP priority support 24/7",
        "Lifetime access to all materials",
      ],
      limitations: [],
      buttonText: "Get Master Coaching",
      popular: false,
      color: "border-yellow-500",
      savings: "Save ₹4998",
    },
  ],
};

const addOns = [
  {
    name: "DNA Analysis Add-on",
    price: 1499,
    period: "one-time",
    description: "Get deeper insights with optional DNA integration (works with any plan)",
    icon: FileText,
  },
  {
    name: "Advanced Supplement Stack",
    price: 2999,
    period: "one-time",
    description: "Complete personalized supplement recommendations with sourcing guide",
    icon: Heart,
  },
  {
    name: "Athletic Performance",
    price: 1999,
    period: "one-time",
    description: "Sport-specific training protocols and sports nutrition planning",
    icon: Zap,
  },
  {
    name: "Family Nutrition Plan",
    price: 3499,
    period: "one-time",
    description: "Extend your plan to up to 4 family members with customized blueprints",
    icon: Users,
  },
  {
    name: "Women's Hormonal Health",
    price: 1799,
    period: "one-time",
    description: "PCOS, thyroid, and cycle-based nutrition optimization",
    icon: Heart,
  },
  {
    name: "Men's Fitness Optimization",
    price: 1799,
    period: "one-time",
    description: "Muscle building, testosterone optimization, and strength protocols",
    icon: Target,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [quizGateOpen, setQuizGateOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const plans = isYearly ? pricingPlans.yearly : pricingPlans.monthly;

  const handleBack = () => {
    navigate(-1);
  };

  const handleBuyClick = (planName: string) => {
    const quizCompleted = localStorage.getItem("analysisId");
    if (!quizCompleted) {
      setSelectedPlan(planName);
      setQuizGateOpen(true);
    } else {
      // User has completed quiz, redirect to download
      navigate("/download");
    }
  };

  return (
    <div className="min-h-screen bg-wellness-50">
      <QuizGateModal
        isOpen={quizGateOpen}
        onClose={() => setQuizGateOpen(false)}
        productName={selectedPlan}
      />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-wellness-gradient rounded-lg">
                <Dna className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-wellness-900">
                GeneWell
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-wellness-900 mb-6">
            Choose Your Wellness Journey
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Unlock the power of your genetics with personalized health insights
            tailored to your unique DNA profile
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span
              className={`text-lg font-medium ${
                !isYearly ? "text-wellness-900" : "text-foreground/70"
              }`}
            >
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-wellness-600"
            />
            <span
              className={`text-lg font-medium ${
                isYearly ? "text-wellness-900" : "text-foreground/70"
              }`}
            >
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-wellness-100 text-wellness-800 hover:bg-wellness-200">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular
                  ? "scale-105 border-wellness-500 shadow-xl"
                  : plan.color
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-wellness-gradient text-white text-center py-2 text-sm font-medium">
                  <Star className="inline h-4 w-4 mr-1" />
                  Most Popular
                </div>
              )}

              <CardHeader className={plan.popular ? "pt-12" : ""}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-wellness-900">
                    {plan.name}
                  </CardTitle>
                  {plan.id === "pro" && (
                    <Crown className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <CardDescription className="text-foreground/70">
                  {plan.description}
                </CardDescription>

                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-wellness-900">
                    {plan.currency}
                    {plan.price.toLocaleString("en-IN")}
                  </span>
                  {plan.originalPrice && (
                    <span className="text-lg text-foreground/50 line-through">
                      {plan.currency}
                      {plan.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="text-foreground/70">/{plan.period}</span>
                </div>

                {plan.savings && (
                  <Badge className="bg-green-100 text-green-800 w-fit">
                    {plan.savings}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  onClick={() => handleBuyClick(plan.name)}
                  className={`w-full ${
                    plan.popular
                      ? "bg-wellness-gradient hover:opacity-90"
                      : plan.id === "pro"
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : ""
                  }`}
                  variant={
                    plan.popular || plan.id === "pro" ? "default" : "outline"
                  }
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-wellness-900">
                    What's included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-wellness-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/80">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-foreground/70 text-sm">
                      Limitations:
                    </h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li
                          key={index}
                          className="text-xs text-foreground/60 flex items-start space-x-2"
                        >
                          <span className="w-1 h-1 bg-foreground/40 rounded-full mt-2 flex-shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-wellness-900 mb-4">
              Premium Add-ons
            </h2>
            <p className="text-foreground/70">
              Enhance your genetic insights with specialized reports and
              services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => {
              const IconComponent = addon.icon;
              return (
                <Card
                  key={index}
                  className="border-wellness-200 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-wellness-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-wellness-900">
                      {addon.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {addon.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-wellness-600 mb-3">
                      ₹{addon.price.toLocaleString("en-IN")}
                    </div>
                    <div className="text-sm text-foreground/70 mb-4">
                      {addon.period}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-wellness-200 hover:bg-wellness-50"
                    >
                      Add to Plan
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-wellness-100 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-wellness-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-wellness-900 mb-2">
                Is my genetic data secure?
              </h3>
              <p className="text-foreground/70 text-sm">
                Yes, we use zero-knowledge processing and bank-level encryption.
                Your raw DNA data is never stored on our servers and is deleted
                after analysis if you choose.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-wellness-900 mb-2">
                What DNA file formats do you accept?
              </h3>
              <p className="text-foreground/70 text-sm">
                We accept raw DNA files from 23andMe, AncestryDNA, MyHeritage,
                and FTDNA in .txt, .csv, and .tsv formats.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-wellness-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-foreground/70 text-sm">
                Yes, you can cancel your subscription at any time. You'll
                continue to have access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-wellness-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-foreground/70 text-sm">
                We offer a 30-day money-back guarantee if you're not satisfied
                with your genetic insights and recommendations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-wellness-900 mb-2">
                How accurate are the recommendations?
              </h3>
              <p className="text-foreground/70 text-sm">
                Our recommendations are based on peer-reviewed scientific
                research and validated genetic markers, with 80-95% confidence
                levels.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-wellness-900 mb-2">
                Is there family plan pricing?
              </h3>
              <p className="text-foreground/70 text-sm">
                Yes, our Pro plan includes family sharing for up to 4 members,
                or you can add individual family members for ₹999/month each.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-wellness-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-foreground/70 mb-6">
            Our team is here to help you choose the right plan for your wellness
            journey
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </Button>
            <Button variant="outline" className="flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              Schedule Call
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex justify-center items-center space-x-8 opacity-60">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">256-bit SSL</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">ISO 27001 Certified</span>
          </div>
        </div>
      </div>

      {/* Footer with Legal Links */}
      <LegalFooter />
    </div>
  );
}
