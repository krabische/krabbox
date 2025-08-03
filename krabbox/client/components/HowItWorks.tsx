import { Search, Calendar, Shield, Repeat } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Luggage",
    description: "Search for luggage near your location, hotel, or airport. Filter by size, type, and pickup location."
  },
  {
    icon: Calendar,
    title: "Book Instantly",
    description: "Select your dates and book instantly. Most hosts respond within minutes to confirm your reservation."
  },
  {
    icon: Shield,
    title: "Travel Protected",
    description: "All luggage is insured and verified. Enjoy your trip knowing your belongings are protected."
  },
  {
    icon: Repeat,
    title: "Return & Repeat",
    description: "Easy pickup and return process. Rate your experience and book again for future travels."
  }
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How LugSpace Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rent luggage in just a few simple steps. Perfect for travelers who want to pack light and pick up quality luggage at their destination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%+1rem)] w-24 h-0.5 bg-gray-200" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
