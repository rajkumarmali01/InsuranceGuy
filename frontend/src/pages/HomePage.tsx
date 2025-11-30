import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Car, Bike, Briefcase, CheckCircle } from 'lucide-react';
import BrandSlider from '../components/BrandSlider';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Compare & Buy the Best Insurance Plans
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8">
                        Get the right coverage at the best price. Simple, fast, and transparent.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a href="#products" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition">
                            View Plans
                        </a>
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-600 transition flex items-center">
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Insurance Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <ProductCard
                            to="/health-insurance"
                            icon={<Heart className="h-10 w-10 text-red-500" />}
                            title="Health Insurance"
                            desc="Protect your family"
                        />
                        <ProductCard
                            to="/life-insurance"
                            icon={<Shield className="h-10 w-10 text-blue-500" />}
                            title="Term Life"
                            desc="Secure their future"
                        />
                        <ProductCard
                            to="/motor-insurance"
                            icon={<Car className="h-10 w-10 text-indigo-500" />}
                            title="Car Insurance"
                            desc="Comprehensive cover"
                        />
                        <ProductCard
                            to="/motor-insurance"
                            icon={<Bike className="h-10 w-10 text-orange-500" />}
                            title="Bike Insurance"
                            desc="Two-wheeler plans"
                        />
                        <ProductCard
                            to="/motor-insurance"
                            icon={<Briefcase className="h-10 w-10 text-gray-700" />}
                            title="Commercial"
                            desc="Business vehicle"
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Insurance Guy?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<CheckCircle className="h-8 w-8 text-green-500" />}
                            title="Best Prices"
                            desc="We compare across top insurers to get you the lowest premiums."
                        />
                        <FeatureCard
                            icon={<CheckCircle className="h-8 w-8 text-green-500" />}
                            title="Unbiased Advice"
                            desc="We work for you, not the insurance companies."
                        />
                        <FeatureCard
                            icon={<CheckCircle className="h-8 w-8 text-green-500" />}
                            title="Claim Support"
                            desc="Dedicated assistance during your claim process."
                        />
                    </div>
                </div>
            </section>

            {/* Brand Slider */}
            <BrandSlider />
        </div>
    );
};

const ProductCard = ({ to, icon, title, desc }: { to: string, icon: React.ReactNode, title: string, desc: string }) => (
    <Link to={to} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center text-center group">
        <div className="mb-4 p-3 bg-gray-50 rounded-full group-hover:bg-blue-50 transition">
            {icon}
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
    </Link>
);

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex flex-col items-center text-center p-6">
        <div className="mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{desc}</p>
    </div>
);

export default HomePage;
