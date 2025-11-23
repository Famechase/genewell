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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Sparkles,
  CheckCircle,
  Download as DownloadIcon,
  Mail,
  Star,
  Heart,
  Brain,
  Target,
  Clock,
  FileText,
  Share2,
  MessageCircle,
  ArrowLeft,
  Gift,
  AlertCircle,
  Phone,
  Loader,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LegalFooter from "@/components/LegalFooter";
import { getProductById } from "@/lib/products";

interface PDFData {
  pdfRecordId: string;
  orderId: string;
  planTier: string;
  userName: string;
  generatedAt: string;
  expiresAt: string;
  downloadUrl: string;
}

export default function Download() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");
  const [showPlanSelection, setShowPlanSelection] = useState(true);

  const analysisId = localStorage.getItem("analysisId");
  const quizData = JSON.parse(localStorage.getItem("quizData") || "{}");

  useEffect(() => {
    // Check if coming from a specific plan selection
    const planFromUrl = searchParams.get("plan");
    if (planFromUrl && analysisId) {
      setSelectedPlan(planFromUrl);
      generatePDF(planFromUrl, analysisId);
    }
  }, [searchParams, analysisId]);

  const generatePDF = async (planTier: string, analysisId: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/wellness/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          planTier,
          addOns: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate PDF");
      }

      const data = await response.json();

      setPdfData({
        pdfRecordId: data.pdfRecordId,
        orderId: data.orderId,
        planTier,
        userName: quizData.userName || "User",
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        downloadUrl: data.downloadUrl,
      });

      // Store PDF data for reference
      localStorage.setItem("lastPDFData", JSON.stringify(data));
      setShowPlanSelection(false);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfData) return;

    setIsDownloading(true);
    try {
      const response = await fetch(pdfData.downloadUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${quizData.userName || "blueprint"}_${pdfData.planTier}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewInline = async () => {
    if (!pdfData) return;

    try {
      const response = await fetch(
        `/api/wellness/download-pdf-base64/${pdfData.pdfRecordId}`
      );
      if (!response.ok) throw new Error("Failed to load PDF");

      const data = await response.json();
      // Open PDF in new window
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<iframe src="${data.pdfUrl}" style="width:100%;height:100%;border:none;" />`
        );
      }
    } catch (err) {
      console.error("View error:", err);
      setError("Failed to view PDF");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectPlan = (planTier: string) => {
    if (!analysisId) {
      navigate("/quiz");
      return;
    }
    generatePDF(planTier, analysisId);
  };

  if (!analysisId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Analysis Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Please complete the wellness quiz first to generate your personalized
              blueprint.
            </p>
            <Button onClick={() => navigate("/quiz")} className="w-full">
              Take Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show plan selection if no PDF generated yet
  if (showPlanSelection && !pdfData) {
    const plans = [
      {
        id: "free",
        name: "Free Blueprint",
        price: 0,
        pages: "5",
        description: "Basic wellness insights",
      },
      {
        id: "essential",
        name: "Essential Blueprint",
        price: 999,
        pages: "15",
        description: "Comprehensive personalized plan",
      },
      {
        id: "premium",
        name: "Premium Blueprint",
        price: 1999,
        pages: "30",
        description: "Complete transformation guide",
      },
      {
        id: "coaching",
        name: "Complete Coaching",
        price: 4999,
        pages: "35+",
        description: "Premium with 1-on-1 support",
      },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Genewell
                </span>
              </Link>
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Wellness Blueprint
            </h1>
            <p className="text-xl text-gray-600">
              Select a plan to generate your personalized {quizData.userName}'s wellness
              blueprint
            </p>
          </div>

          {error && (
            <Alert className="max-w-2xl mx-auto mb-8 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  isLoading && selectedPlan === plan.id
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      ₹{plan.price}
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">
                      {plan.pages} Pages
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isLoading}
                    className="w-full"
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate {plan.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <LegalFooter />
      </div>
    );
  }

  // Show PDF download interface
  if (pdfData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Genewell
                </span>
              </Link>
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-100 text-green-700">
                  ✅ Blueprint Ready
                </Badge>
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🎉 Your Blueprint is Ready!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Your personalized {pdfData.planTier.toUpperCase()} wellness blueprint for{" "}
              <strong>{pdfData.userName}</strong> has been generated with your unique
              profile, quiz answers, and recommendations.
            </p>
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 text-lg">
              {pdfData.planTier.toUpperCase()} PLAN ✨
            </Badge>
          </div>

          <Card className="border-2 border-emerald-200 shadow-2xl bg-white/90 backdrop-blur-sm mb-12">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-3">
                <FileText className="h-8 w-8 text-emerald-600" />
                <span>Your Personalized Wellness Blueprint</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Download or view your complete personalized health transformation
                guide
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Insights Preview */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Personalized</h3>
                  <p className="text-xs text-gray-600">For {pdfData.userName}</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Nutrition</h3>
                  <p className="text-xs text-gray-600">Custom Meal Plan</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Fitness</h3>
                  <p className="text-xs text-gray-600">Your Workouts</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Analysis</h3>
                  <p className="text-xs text-gray-600">Science-Backed</p>
                </div>
              </div>

              {/* Download Options */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl"
                  >
                    <DownloadIcon className="mr-3 h-6 w-6" />
                    {isDownloading ? "Downloading..." : "📥 Download PDF"}
                  </Button>

                  <Button
                    onClick={handleViewInline}
                    variant="outline"
                    className="flex-1 px-8 py-6 text-lg"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    View Online
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-600">
                  Your personalized wellness blueprint will download to your device
                </p>
              </div>

              {/* Email Info */}
              <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">📧 Email Delivery</h3>
                <p className="text-gray-600 text-sm">
                  We've also sent a copy to <strong>{quizData.userEmail}</strong>
                  <br />
                  Check your inbox (and spam folder) for your wellness blueprint!
                </p>
              </div>

              {/* Blueprint Info */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Order ID:</strong> {pdfData.orderId}
                </p>
                <p>
                  <strong>Plan Tier:</strong> {pdfData.planTier.toUpperCase()}
                </p>
                <p>
                  <strong>Generated:</strong>{" "}
                  {new Date(pdfData.generatedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Expires:</strong> {new Date(pdfData.expiresAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What's Inside */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              What's Inside Your Blueprint 📋
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    Personalized Analysis
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✅ Your metabolic profile</li>
                    <li>✅ Ayurvedic constitution (Vata/Pitta/Kapha)</li>
                    <li>✅ Body type classification</li>
                    <li>✅ Energy & wellness scores</li>
                    <li>✅ Recommended blood tests</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 text-orange-500 mr-2" />
                    Nutrition & Fitness
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      ✅{" "}
                      {pdfData.planTier !== "free"
                        ? "Customized meal plan"
                        : "Meal timing guide"}
                    </li>
                    <li>
                      ✅{" "}
                      {pdfData.planTier !== "free"
                        ? "Workout routines"
                        : "Fitness tips"}
                    </li>
                    <li>
                      ✅{" "}
                      {pdfData.planTier !== "free"
                        ? "Supplement protocol"
                        : "Supplement suggestions"}
                    </li>
                    <li>✅ Sleep optimization</li>
                    <li>✅ Stress management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-5 w-5 text-purple-500 mr-2" />
                    Science-Backed
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✅ RCT citations & meta-analyses</li>
                    <li>✅ PubMed references</li>
                    <li>✅ DOI links to research</li>
                    <li>✅ Evidence-based recommendations</li>
                    <li>✅ Real scientific data</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    Progress Tools
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✅ Tracking templates</li>
                    <li>✅ Weekly metrics</li>
                    <li>✅ Monthly goals</li>
                    <li>✅ Progress timeline</li>
                    <li>✅ Action plan</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="text-center p-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Love your blueprint? Share with friends! 💚
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                <Share2 className="mr-2 h-4 w-4" />
                Share on Social Media
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                <MessageCircle className="mr-2 h-4 w-4" />
                Tell a Friend
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                <Gift className="mr-2 h-4 w-4" />
                Gift a Blueprint
              </Button>
            </div>
          </div>

          {/* Support */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">
              📞 Need Help Getting Started?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Our wellness experts are here to support your transformation journey
            </p>
          </div>
        </div>

        <LegalFooter />
      </div>
    );
  }

  return null;
}
