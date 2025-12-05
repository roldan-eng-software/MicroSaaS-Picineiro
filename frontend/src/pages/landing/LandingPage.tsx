import React from 'react';
import FeaturesSection from '../../components/landing/FeaturesSection';
import PricingSection from '../../components/landing/PricingSection';
import CallToActionSection from '../../components/landing/CallToActionSection';
import Footer from '../../components/landing/Footer';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            {/* Hero Section */}
            <header className="bg-gradient-to-r from-primary-500 to-blue-600 text-white py-20 px-4 text-center">
                <div className="container mx-auto">
                    <h1 className="text-5xl font-bold mb-4">Bem-vindo ao Propiscineiro!</h1>
                    <p className="text-xl mb-8">
                        A solução definitiva para gerenciar seus projetos de piscinas com facilidade e eficiência.
                    </p>
                    <a
                        href="/register"
                        className="bg-white text-primary-600 hover:bg-gray-100 text-lg font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300 ease-in-out"
                    >
                        Comece Grátis
                    </a>
                </div>
            </header>

            {/* Features Section */}
            <FeaturesSection />

            {/* Pricing Section */}
            <PricingSection />

            {/* Call to Action Section */}
            <CallToActionSection />

            {/* Footer */}
            <Footer />
        </div>
    );
}
