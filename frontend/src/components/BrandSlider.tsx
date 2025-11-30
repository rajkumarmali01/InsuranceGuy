import React from 'react';

const brands = [
    { name: 'LIC', logo: 'https://logo.clearbit.com/licindia.in' },
    { name: 'HDFC Life', logo: 'https://logo.clearbit.com/hdfclife.com' },
    { name: 'SBI Life', logo: 'https://logo.clearbit.com/sbilife.co.in' },
    { name: 'ICICI Prudential', logo: 'https://logo.clearbit.com/iciciprulife.com' },
    { name: 'Max Life', logo: 'https://logo.clearbit.com/maxlifeinsurance.com' },
    { name: 'Bajaj Allianz', logo: 'https://logo.clearbit.com/bajajallianzlife.com' },
    { name: 'Tata AIA', logo: 'https://logo.clearbit.com/tataaia.com' },
    { name: 'Kotak Life', logo: 'https://logo.clearbit.com/kotaklife.com' },
    { name: 'Aditya Birla', logo: 'https://logo.clearbit.com/adityabirlacapital.com' },
    { name: 'Star Health', logo: 'https://logo.clearbit.com/starhealth.in' },
    { name: 'Niva Bupa', logo: 'https://logo.clearbit.com/nivabupa.com' },
    { name: 'Care Insurance', logo: 'https://logo.clearbit.com/careinsurance.com' },
    { name: 'Acko', logo: 'https://logo.clearbit.com/acko.com' },
    { name: 'Digit', logo: 'https://logo.clearbit.com/godigit.com' },
];

const BrandSlider = () => {
    return (
        <section className="py-16 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Brand We Are Working with 🤝</h2>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex w-max animate-scroll">
                    {/* First Set */}
                    <div className="flex space-x-12 px-6">
                        {brands.map((brand, index) => (
                            <div key={`brand-1-${index}`} className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-center h-24 w-40 group">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-16 max-w-[80%] object-contain grayscale group-hover:grayscale-0 transition duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://placehold.co/150x80?text=${brand.name}`;
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    {/* Duplicate Set for Infinite Scroll */}
                    <div className="flex space-x-12 px-6">
                        {brands.map((brand, index) => (
                            <div key={`brand-2-${index}`} className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-center h-24 w-40 group">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-16 max-w-[80%] object-contain grayscale group-hover:grayscale-0 transition duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://placehold.co/150x80?text=${brand.name}`;
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default BrandSlider;
