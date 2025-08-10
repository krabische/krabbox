import { Button } from "@/components/ui/button";
import { SearchSection } from "@/components/SearchSection";
import { FeaturedListings } from "@/components/FeaturedListings";
import { HowItWorks } from "@/components/HowItWorks";
import { useLanguage } from "@/contexts/LanguageContext";
import { SupabaseTest } from "@/components/SupabaseTest";
import { SupabaseDebugTest } from "@/components/SupabaseDebugTest";
import { Plane, Shield, Clock, Users } from "lucide-react";

export default function Index() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-32 overflow-hidden">
        <div
          className={
            "absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"
          }
        ></div>

        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-700 to-indigo-700 bg-clip-text text-transparent whitespace-pre-line">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3 h-auto">
                <Plane className="mr-2 h-5 w-5" />
                {t('home.hero.findStorage')}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 h-auto">
                {t('home.hero.listStorage')}
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <SearchSection />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                50K+
              </div>
              <div className="text-muted-foreground">{t('stats.happyTravelers')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                200+
              </div>
              <div className="text-muted-foreground">{t('stats.citiesWorldwide')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                10K+
              </div>
              <div className="text-muted-foreground">{t('stats.storageOptions')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                4.9
              </div>
              <div className="text-muted-foreground">{t('stats.averageRating')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <FeaturedListings />

      {/* How It Works */}
      <HowItWorks />

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose LugSpace?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of smart travelers who save money and hassle by renting storage instead of buying or dragging it everywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fully Insured</h3>
              <p className="text-muted-foreground">
                Every rental is fully insured up to $1,000. Travel with confidence knowing your belongings are protected.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Booking</h3>
              <p className="text-muted-foreground">
                Book instantly with most hosts responding within minutes. Perfect for last-minute travel plans.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trusted Community</h3>
              <p className="text-muted-foreground">
                Join a community of verified hosts and travelers. Read reviews and ratings before you book.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Travel Smarter?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of travelers who save money and hassle with LugSpace. Find your perfect storage rental today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3 h-auto">
              Find Storage
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 h-auto border-white text-white hover:bg-white hover:text-primary">
              List Your Storage
            </Button>
          </div>
        </div>
      </section>

      {/* Supabase Test Component (for debugging) */}
      <div className="bg-gray-100 py-8">
        <div className="container">
          <SupabaseDebugTest />
        </div>
      </div>
    </div>
  );
}
