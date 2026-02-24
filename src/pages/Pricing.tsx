import { useState, useEffect } from 'react';
import axios from 'axios';

interface PricingPlan {
    name: string;
    price: number;
    duration: string;
    currency: string;
    description: string;
    features: string[];
    popular: boolean;
    highlighted: boolean;
    buttonText: string;
    buttonLink: string;
    icon: string;
    badge: string;
    discount: number;
    trialDays: number;
}

const Pricing = () => {
    const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPricingPlans();
    }, []);

    const fetchPricingPlans = async () => {
        try {
            const response = await axios.get('/api/get-pricing');
            setPricingPlans(response.data.pricing || []);
        } catch (error) {
            console.error('Error fetching pricing plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCurrencySymbol = (currency: string) => {
        switch (currency) {
            case 'USD': return '$';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'INR': return '₹';
            default: return '$';
        }
    };

    const getDurationDisplay = (duration: string) => {
        switch (duration) {
            case 'monthly': return '/month';
            case 'yearly': return '/year';
            case 'quarterly': return '/quarter';
            case 'onetime': return '';
            default: return '/month';
        }
    };

    const calculateDiscountedPrice = (price: number, discount: number) => {
        return price * (1 - discount / 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading pricing plans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Yoga Journey
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Select the perfect plan that fits your lifestyle and wellness goals
                    </p>
                </div>

                {/* Pricing Plans */}
                {pricingPlans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => {
                            const discountedPrice = plan.discount > 0 ? calculateDiscountedPrice(plan.price, plan.discount) : plan.price;
                            const currencySymbol = getCurrencySymbol(plan.currency);
                            const durationDisplay = getDurationDisplay(plan.duration);

                            return (
                                <div
                                    key={index}
                                    className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${plan.highlighted ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                                        }`}
                                >
                                    {/* Badge */}
                                    {plan.badge && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                                            {plan.badge}
                                        </div>
                                    )}

                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-semibold">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                                        {/* Plan Name */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 mb-6">
                                            {plan.description}
                                        </p>

                                        {/* Price */}
                                        <div className="mb-6">
                                            <div className="flex items-baseline">
                                                <span className="text-4xl font-bold text-gray-900">
                                                    {currencySymbol}{discountedPrice}
                                                </span>
                                                <span className="text-gray-600 ml-1">
                                                    {durationDisplay}
                                                </span>
                                            </div>
                                            {plan.discount > 0 && (
                                                <div className="mt-2">
                                                    <span className="text-gray-500 line-through">
                                                        {currencySymbol}{plan.price}{durationDisplay}
                                                    </span>
                                                    <span className="ml-2 text-green-600 font-semibold">
                                                        Save {plan.discount}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Trial Info */}
                                        {plan.trialDays > 0 && (
                                            <div className="mb-6 p-3 bg-green-50 rounded-lg">
                                                <p className="text-green-800 text-sm font-medium">
                                                    🎯 {plan.trialDays}-day free trial
                                                </p>
                                            </div>
                                        )}

                                        {/* Features */}
                                        <div className="mb-8">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                                What's included:
                                            </h4>
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-start">
                                                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* CTA Button */}
                                        <a
                                            href={plan.buttonLink}
                                            className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${plan.highlighted
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            {plan.buttonText || 'Get Started'}
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Pricing Plans Available
                        </h3>
                        <p className="text-gray-600">
                            Check back later for our latest pricing plans and offers.
                        </p>
                    </div>
                )}

                {/* Contact Section */}
                <div className="mt-16 text-center bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Have questions about our plans?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Our team is here to help you find the perfect plan for your yoga journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Contact Us
                        </a>
                        <a
                            href="tel:+1234567890"
                            className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Call (123) 456-7890
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
