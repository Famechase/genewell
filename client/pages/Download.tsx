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
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LegalFooter from "@/components/LegalFooter";
import { products, getProductById } from "@/lib/products";

export default function Download() {
  const navigate = useNavigate();
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const analysisId = localStorage.getItem("analysisId");
    if (!analysisId) {
      navigate("/quiz");
      return;
    }

    // Get purchase data from localStorage
    const savedQuizData = localStorage.getItem("quizData");
    if (savedQuizData) {
      const quizData = JSON.parse(savedQuizData);
      setPurchaseData({
        analysisId,
        email: quizData.userEmail,
        userName: quizData.userName,
      });
    }

    // Check if a specific product was selected
    const productId = sessionStorage.getItem("selectedProductId");
    if (productId) {
      const product = getProductById(productId);
      setSelectedProduct(product);
      sessionStorage.removeItem("selectedProductId");
    } else {
      // Default to first product or show product selection
      setSelectedProduct(products[0]);
    }
  }, [navigate]);

  const handleDownload = async () => {
    try {
      setError("");
      setDownloadStarted(true);

      if (!selectedProduct?.id) {
        throw new Error("No product selected");
      }

      // Fetch PDF from server using product-specific endpoint
      const response = await fetch(
        `/api/products/download/${selectedProduct.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const data = await response.json();

      if (!data.pdfUrl) {
        throw new Error("No PDF URL received");
      }

      // Convert base64 data URL to blob and download
      const arr = data.pdfUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "application/pdf";
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);

      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }

      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.filename || `${selectedProduct.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Track download
      localStorage.setItem(
        "downloadHistory",
        JSON.stringify([
          ...(JSON.parse(localStorage.getItem("downloadHistory") || "[]") ||
            []),
          {
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            timestamp: new Date().toISOString(),
            filename: data.filename,
          },
        ])
      );
    } catch (e) {
      console.error("Download error:", e);
      setError("Failed to download your blueprint. Please try again.");
    } finally {
      setDownloadStarted(false);
    }
  };

  const handleShareOnSocial = () => {
    const shareText = `I just got my personalized Wellness Blueprint from Genewell! 🧬 It includes my custom nutrition plan, fitness routine, and stress management strategy. Check it out! 💪`;
    const shareUrl = window.location.origin;

    // Open share dialog
    if (navigator.share) {
      navigator.share({
        title: "Genewell - Personalized Wellness Blueprint",
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback: open social media shares
      const links = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      };

      // Create a simple share menu
      const choice = confirm(
        "Choose platform:\nOK = Twitter, Cancel = Copy Link"
      );
      if (choice) {
        window.open(links.twitter, "_blank");
      } else {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("Link copied to clipboard!");
      }
    }
  };

  const handleTellAFriend = () => {
    const message = `Hey! I just discovered Genewell, an amazing AI-powered wellness platform that creates personalized health blueprints. Get your own in just 3 minutes!\n\nCheck it out: ${window.location.origin}`;

    if (navigator.share) {
      navigator.share({
        title: "Genewell - Personalized Health Blueprint",
        text: message,
      });
    } else {
      // Open email
      window.location.href = `mailto:?subject=You should check out Genewell!&body=${encodeURIComponent(message)}`;
    }
  };

  const handleGiftBlueprint = () => {
    const message = `I'd like to gift you a Genewell Wellness Blueprint! It's a personalized guide that includes nutrition, fitness, sleep, and stress management recommendations.\n\nVisit: ${window.location.origin}`;

    window.location.href = `mailto:?subject=I'm Gifting You a Wellness Blueprint from Genewell&body=${encodeURIComponent(message)}`;
  };

  const handleContactSupport = () => {
    const subject = "Genewell Support - Wellness Blueprint Assistance";
    const body = `Hi Genewell Team,\n\nI need assistance with my wellness blueprint.\n\nAnalysis ID: ${purchaseData?.analysisId || "N/A"}\n\nPlease help me with:\n`;

    window.location.href = `mailto:support@genewell.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (!purchaseData || !selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Genewell
                </span>
                <div className="text-xs text-gray-500 font-medium">
                  WELLNESS AI
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-700">
                ✅ Payment Successful
              </Badge>
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎉 Download Ready!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Your personalized <strong>{selectedProduct.name}</strong> guide is
            ready to download. Get instant access to science-backed insights
            tailored just for you.
          </p>
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 text-lg">
            ₹{selectedProduct.price} - Instant Download ✨
          </Badge>
        </div>

        {/* Download Section */}
        <Card className="border-2 border-emerald-200 shadow-2xl bg-white/90 backdrop-blur-sm mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-3">
              <FileText className="h-8 w-8 text-emerald-600" />
              <span>Your Wellness Blueprint</span>
            </CardTitle>
            <CardDescription className="text-lg">
              Download your complete personalized health transformation guide
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Key Insights Preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Metabolism
                </h3>
                <p className="text-xs text-gray-600">Balanced Type</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4 text-center">
                <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Nutrition
                </h3>
                <p className="text-xs text-gray-600">Custom Meal Plan</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Fitness</h3>
                <p className="text-xs text-gray-600">Home Workouts</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Timing</h3>
                <p className="text-xs text-gray-600">Optimal Schedule</p>
              </div>
            </div>

            {/* Download PDF */}
            <div className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-center">
                <Button
                  onClick={handleDownload}
                  disabled={downloadStarted}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl"
                  size="lg"
                >
                  <DownloadIcon className="mr-3 h-6 w-6" />
                  {downloadStarted
                    ? "Generating PDF..."
                    : "📥 Download PDF Blueprint"}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Your personalized wellness guide will open in a new window
              </p>
            </div>

            {/* Email Delivery Info */}
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                📧 Email Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                We've also sent a copy to <strong>{purchaseData.email}</strong>
                <br />
                Check your inbox (and spam folder) for your wellness blueprint!
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
                  Personalized Nutrition Plan
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Best foods for your metabolism type</li>
                  <li>✅ Foods to avoid based on your sensitivities</li>
                  <li>✅ Optimal meal timing schedule</li>
                  <li>✅ Portion size recommendations</li>
                  <li>✅ 7-day meal prep guide</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 text-orange-500 mr-2" />
                  Custom Fitness Routine
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Home-friendly workout plans</li>
                  <li>✅ Exercise frequency & intensity</li>
                  <li>✅ Recovery recommendations</li>
                  <li>✅ Progressive difficulty levels</li>
                  <li>✅ Weekly exercise calendar</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 text-purple-500 mr-2" />
                  Lifestyle Optimization
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Sleep optimization strategies</li>
                  <li>✅ Stress management techniques</li>
                  <li>✅ Daily routine planner</li>
                  <li>✅ Habit formation guide</li>
                  <li>✅ Progress tracking tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-emerald-500 mr-2" />
                  Supplement & Wellness
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Personalized supplement stack</li>
                  <li>✅ Dosage & timing instructions</li>
                  <li>✅ Natural alternatives</li>
                  <li>✅ Hydration guidelines</li>
                  <li>✅ Wellness tracking metrics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              🚀 Your Transformation Starts Now!
            </CardTitle>
            <CardDescription className="text-lg">
              Here's how to get the best results from your blueprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Review Your Plan
                </h3>
                <p className="text-sm text-gray-600">
                  Read through your complete blueprint and understand your
                  unique recommendations
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-pink-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Start Gradually
                </h3>
                <p className="text-sm text-gray-600">
                  Implement 2-3 changes per week for sustainable long-term
                  results
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Track Progress
                </h3>
                <p className="text-sm text-gray-600">
                  Use the tracking tools provided to monitor your transformation
                  journey
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Sharing */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Love your results? Share with friends! 💚
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={handleShareOnSocial}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share on Social Media
            </Button>
            <Button
              onClick={handleTellAFriend}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Tell a Friend
            </Button>
            <Button
              onClick={handleGiftBlueprint}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              <Gift className="mr-2 h-4 w-4" />
              Gift a Blueprint
            </Button>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2">
            📞 Need Help Getting Started?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Our wellness experts are here to support your transformation journey
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              onClick={handleContactSupport}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </Button>
            <Button
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => window.location.href = "tel:8009785785"}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call 8009785785
            </Button>
          </div>
        </div>
      </div>

      {/* Footer with Legal Links */}
      <LegalFooter />
    </div>
  );
}
