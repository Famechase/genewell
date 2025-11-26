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
import { Link, useNavigate } from "react-router-dom";
import {
  Dna,
  Check,
  Star,
  Crown,
  Shield,
  Zap,
  Users,
  ArrowLeft,
  Phone,
  Mail,
  Heart,
  Brain,
  FileText,
  Target,
  AlertCircle,
} from "lucide-react";
import QuizGateModal from "@/components/QuizGateModal";
import LegalFooter from "@/components/LegalFooter";
import {
  FREE_BLUEPRINT,
  ESSENTIAL_BLUEPRINT,
  PREMIUM_BLUEPRINT,
  COMPLETE_COACHING,
  addOns,
} from "@/lib/products";

export default function Pricing() {
  const navigate = useNavigate();
  const [quizGateOpen, setQuizGateOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handleBuyClick = (planId: string, link: string) => {
    const quizCompleted = localStorage.getItem("analysisId");
    if (!quizCompleted && planId !== "free") {
      setSelectedPlan(planId);
      setQuizGateOpen(true);
    } else if (link) {
      // For demo, just navigate. In production, this would go to payment.
      window.location.href = link;
    }
  };

  const plans = [
    {
      ...FREE_BLUEPRINT,
      popular: false,
      buttonText: "Get Free Blueprint",
    },
    {
      ...ESSENTIAL_BLUEPRINT,
      popular: false,
      buttonText: "Get Essential - ₹599",
    },
    {
      ...PREMIUM_BLUEPRINT,
      popular: true,
      buttonText: "Get Premium - ₹1,499",
    },
    {
      ...COMPLETE_COACHING,
      popular: false,
      buttonText: "Start Coaching - ₹9,999/3mo",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-blue-900">Genewell</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Evidence-Based Wellness, Every Budget
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Science-backed plans personalized to your sleep, nutrition, training, and stress. No pseudoscience. No gimmicks.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "scale-105 border-2 border-blue-500 shadow-xl lg:row-span-2"
                  : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-2 text-sm font-semibold">
                  <Star className="inline h-4 w-4 mr-1" />
                  Most Popular
                </div>
              )}

              <CardHeader className={plan.popular ? "pt-12" : ""}>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {plan.description}
                </CardDescription>

                <div className="pt-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-slate-900">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-slate-600">
                      {plan.id === "free" ? "Free" : "one-time"}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  onClick={() => handleBuyClick(plan.id, plan.link)}
                  className={`w-full font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    Includes:
                  </h4>
                  <ul className="space-y-2">
                    {plan.details.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-sm text-slate-700"
                      >
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ADD-ONS SECTION */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Premium Add-Ons
            </h2>
            <p className="text-slate-600">
              Enhance any plan with specialized modules tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon) => {
              const IconMap: Record<string, React.ReactNode> = {
                dna: <Dna className="h-6 w-6" />,
                pill: <FileText className="h-6 w-6" />,
                target: <Target className="h-6 w-6" />,
                users: <Users className="h-6 w-6" />,
                heart: <Heart className="h-6 w-6" />,
                zap: <Zap className="h-6 w-6" />,
              };

              return (
                <Card key={addon.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-3 text-blue-600">
                      {IconMap[addon.icon] || <Zap className="h-6 w-6" />}
                    </div>
                    <CardTitle className="text-lg text-slate-900">
                      {addon.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {addon.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{addon.price.toLocaleString("en-IN")}
                    </div>
                    <ul className="space-y-2">
                      {addon.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-600 flex items-start space-x-2"
                        >
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        handleBuyClick(addon.id, `/buy-addon/${addon.id}`)
                      }
                    >
                      Add to Plan
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Common Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Is this really personalized?
              </h3>
              <p className="text-slate-700 text-sm">
                Yes. Your 28-question quiz captures sleep patterns, activity level, stress profile, dietary preferences, and health history. Your plan reflects your actual life, not generic advice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                What if I start Free and want to upgrade?
              </h3>
              <p className="text-slate-700 text-sm">
                No problem. Your quiz data carries forward. Upgrade anytime. Premium includes everything Essential covered, plus advanced metrics and training periodization.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                What makes this different from other apps?
              </h3>
              <p className="text-slate-700 text-sm">
                Evidence-based only. Every recommendation is backed by peer-reviewed research (sleep neurobiology, exercise science, clinical nutrition, behavioral psychology). No metabolic types. No body type classifications. No pseudoscience.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-slate-700 text-sm">
                Yes. 30-day money-back guarantee on Premium and Coaching if you're not satisfied. Free tier is always free—no refund needed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                How is Coaching different from Premium?
              </h3>
              <p className="text-slate-700 text-sm">
                Premium is self-directed with tools and structure. Coaching adds a real person: weekly check-ins, video form review, behavior-change coaching, adjustments based on YOUR progress, and direct messaging support.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Do you use DNA testing?
              </h3>
              <p className="text-slate-700 text-sm">
                Optional. DNA Analysis Add-on (₹1,499) provides insights into nutrient processing, caffeine sensitivity, and exercise response based on genetic markers. But it's not required—your quiz data is powerful alone.
              </p>
            </div>
          </div>
        </div>

        {/* SUPPORT SECTION */}
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-slate-600 mb-6">
            Our team is here to help you choose the right plan for your wellness journey
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:support@genewell.com">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-300"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
            </a>
            <a href="https://calendly.com/genewell" target="_blank" rel="noopener noreferrer">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                <Phone className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <LegalFooter />
    </div>
  );
}
