
import { Leaf, Clock, Truck, Users, Shield, Sparkles } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Leaf,
      title: "Seasonal & Local",
      description: "We source the freshest seasonal produce from local farms and trusted suppliers."
    },
    {
      icon: Clock,
      title: "Time-Saving",
      description: "Skip the grocery shopping. Get everything you need for healthy meals delivered weekly."
    },
    {
      icon: Truck,
      title: "Convenient Delivery",
      description: "Flexible delivery windows that work with your schedule. Free delivery on all orders."
    },
    {
      icon: Users,
      title: "Expert Curation",
      description: "Our nutritionists carefully select each item to ensure perfect balance and variety."
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "100% satisfaction guaranteed. Not happy? We'll make it right or refund your order."
    },
    {
      icon: Sparkles,
      title: "Recipe Inspiration",
      description: "Get creative recipe cards and preparation tips with every delivery."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Why Choose Madras Salad?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're more than just a delivery service. We're your partner in maintaining 
            a healthy, delicious lifestyle with minimal effort.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
