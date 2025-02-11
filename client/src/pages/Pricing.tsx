import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import WavePattern from "@/components/ui/patterns/WavePattern";
import Header from "@/components/layout/Header";

const plans = [
  {
    name: "Basic Package",
    hours: 4,
    pricePerHour: 45,
    description: "Perfect for light academic support",
    features: [
      "4 hours of tutoring per week",
      "Flexible scheduling",
      "Progress tracking",
      "Homework assistance",
      "1-on-1 sessions"
    ]
  },
  {
    name: "Standard Package",
    hours: 8,
    pricePerHour: 40,
    description: "Most popular for consistent improvement",
    features: [
      "8 hours of tutoring per week",
      "Priority scheduling",
      "Detailed progress reports",
      "Homework & test prep",
      "Study materials included",
      "1-on-1 sessions"
    ],
    highlighted: true
  },
  {
    name: "Intensive Package",
    hours: 10,
    pricePerHour: 35,
    description: "Ideal for rapid academic advancement",
    features: [
      "10 hours of tutoring per week",
      "Premium scheduling priority",
      "Comprehensive progress tracking",
      "Full test prep coverage",
      "Custom study materials",
      "1-on-1 sessions",
      "Parent-teacher conferences"
    ]
  }
];

export default function Pricing() {
  return (
    <div className="bg-black min-h-screen">
      <Header />
      <div className="relative pt-20">
        <WavePattern />

        <div className="container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-white mb-6">Choose Your Tutoring Package</h1>
            <p className="text-gray-400 text-lg">
              Select the perfect amount of tutoring hours to achieve your academic goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className={`p-6 backdrop-blur-lg border-gray-800 h-full flex flex-col
                    ${plan.highlighted 
                      ? 'bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-gray-700' 
                      : 'bg-gray-900/50'}`}
                >
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      ${plan.pricePerHour}
                      <span className="text-lg text-gray-400">/hour</span>
                    </div>
                    <div className="text-blue-400 font-medium mb-2">
                      {plan.hours} hours per week
                    </div>
                    <p className="text-gray-400">{plan.description}</p>
                  </div>

                  <div className="flex-grow">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300">
                          <Check className="w-5 h-5 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    variant={plan.highlighted ? "default" : "secondary"}
                    className={`w-full ${plan.highlighted 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/20' 
                      : ''}`}
                  >
                    Select Package
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}