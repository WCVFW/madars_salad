
import { Button } from "@/components/ui/button";
import { Salad, Truck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartSubscription = () => {
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center py-12 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]"></div>
      <div className="absolute top-20 -right-32 w-64 h-64 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 -left-32 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                🌱 Farm Fresh • Delivered Daily
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Nourish Your Body
                </span>
                <br />
                <span className="text-gray-900">with Premium</span>
                <br />
                <span className="text-emerald-600">Salads & Bowls</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience the perfect blend of taste and nutrition with our expertly crafted salads, 
                smoothie bowls, and healthy meals delivered fresh to your doorstep.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleStartSubscription}
              >
                Start Your Journey
                <span className="ml-2">→</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                onClick={() => navigate('/products')}
              >
                Explore Menu
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-emerald-100">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-emerald-600">50K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-emerald-600">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-gray-600">Fresh Guarantee</div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-md">
                  <Salad className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-gray-900">Premium Quality</p>
                  <p className="text-sm text-gray-600">Farm-fresh ingredients</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-md">
                  <Truck className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-gray-900">Fast Delivery</p>
                  <p className="text-sm text-gray-600">Same day delivery</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-md">
                  <Clock className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-gray-900">Flexible Plans</p>
                  <p className="text-sm text-gray-600">Cancel anytime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center" 
                alt="Fresh healthy salads and bowls" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              
              {/* Floating price card */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">₹299</div>
                  <div className="text-xs text-gray-600">Starting from</div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg animate-bounce">
              <span className="text-3xl">🥗</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
              <span className="text-3xl">🥑</span>
            </div>
            <div className="absolute top-1/3 -left-6 bg-white rounded-full p-3 shadow-lg animate-bounce" style={{ animationDelay: '2s' }}>
              <span className="text-2xl">🍓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
