"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Check, 
  Menu, 
  X, 
  Clock, 
  Users, 
  CreditCard, 
  BarChart, 
  Activity,
  Calendar,
  DollarSign,
  Settings,
  Shield,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<'3' | '6' | '12'>('3');

  const getPriceWithDiscount = (basePrice: number) => {
    const discount = 0.7; // 70% off
    return Math.round(basePrice * (1 - discount));
  };

  const basePrices = {
    basic: { '3': 5000, '6': 9000, '12': 15000 },
    pro: { '3': 8000, '6': 15000, '12': 25000 },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">GymOne</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600">Features</Link>
              <Link href="#dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
              <Link href="/login">
                <Button variant="outline" className="mr-2">Log in</Button>
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <Link href="#features" className="block text-gray-600 hover:text-blue-600">Features</Link>
              <Link href="#dashboard" className="block text-gray-600 hover:text-blue-600">Dashboard</Link>
              <Link href="#pricing" className="block text-gray-600 hover:text-blue-600">Pricing</Link>
              <div className="space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Gradient Animation */}
      <section className="relative py-32 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container px-4 mx-auto relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block animate-float">
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-6 inline-block">
                #1 Gym Management Software
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Manage Your Gym with
              <span className="text-blue-600"> GymOne</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl">
              Save hours of administrative work every day. Our all-in-one gym management solution 
              automates your tasks, so you can focus on what matters most - your members.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="text-lg w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  Start Saving Time Now
                </Button>
              </Link>
              <Link href="#pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="text-lg w-full sm:w-auto border-blue-200 hover:bg-blue-50">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Features Grid */}
      <section id="dashboard" className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features at Your Fingertips</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get real-time insights into your gym's performance. Track members, revenue, and attendance all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">Monitor your gym's performance with instant insights and metrics.</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Member Management</h3>
              <p className="text-gray-600">Effortlessly manage members, subscriptions, and profiles.</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Attendance Tracking</h3>
              <p className="text-gray-600">Track check-ins and analyze attendance patterns easily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything You Need to Run Your Gym Efficiently
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Billing</h3>
              <p className="text-gray-600">Automated payment processing and financial reporting.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customizable</h3>
              <p className="text-gray-600">Tailor the system to your gym's specific needs.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Access</h3>
              <p className="text-gray-600">Role-based access control and data protection.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Performance</h3>
              <p className="text-gray-600">Lightning-fast operations and real-time updates.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Reports</h3>
              <p className="text-gray-600">Detailed insights and customizable reports.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Saving</h3>
              <p className="text-gray-600">Automate repetitive tasks and save hours weekly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50">
              <p className="text-4xl font-bold text-blue-600 mb-2">15+</p>
              <p className="text-gray-600">Hours Saved Weekly</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-50">
              <p className="text-4xl font-bold text-green-600 mb-2">99%</p>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50">
              <p className="text-4xl font-bold text-purple-600 mb-2">1000+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-yellow-50">
              <p className="text-4xl font-bold text-yellow-600 mb-2">24/7</p>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Simple, transparent pricing</h2>
          <p className="text-center text-gray-600 mb-8">70% off on all plans - Limited time offer!</p>
          
          {/* Duration Selector */}
          <div className="flex justify-center gap-4 mb-12">
            {['3', '6', '12'].map((duration) => (
              <Button
                key={duration}
                variant={selectedDuration === duration ? "default" : "outline"}
                onClick={() => setSelectedDuration(duration as '3' | '6' | '12')}
                className="min-w-[100px]"
              >
                {duration} Months
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="p-8 flex flex-col">
              <div>
                <h3 className="text-xl font-semibold">Basic</h3>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold">₹{getPriceWithDiscount(basePrices.basic[selectedDuration])}</span>
                    <div className="flex flex-col">
                      <span className="text-gray-600">/{selectedDuration} months</span>
                      <span className="text-sm text-gray-500 line-through">₹{basePrices.basic[selectedDuration]}</span>
                    </div>
                  </div>
                </div>
                <ul className="mt-6 space-y-4">
                  {[
                    "Up to 100 members",
                    "Basic attendance tracking",
                    "Member portal",
                    "Email support",
                    "Save 10+ hours weekly",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-8">
                <Button className="w-full" size="lg">Get Started</Button>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 flex flex-col border-blue-500 border-2 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Pro</h3>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold">₹{getPriceWithDiscount(basePrices.pro[selectedDuration])}</span>
                    <div className="flex flex-col">
                      <span className="text-gray-600">/{selectedDuration} months</span>
                      <span className="text-sm text-gray-500 line-through">₹{basePrices.pro[selectedDuration]}</span>
                    </div>
                  </div>
                </div>
                <ul className="mt-6 space-y-4">
                  {[
                    "Up to 200 members",
                    "Advanced attendance tracking",
                    "Member portal",
                    "Priority support",
                    "Custom branding",
                    "API access",
                    "Save 15+ hours weekly",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-8">
                <Button className="w-full" size="lg">Get Started</Button>
              </div>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8 flex flex-col">
              <div>
                <h3 className="text-xl font-semibold">Enterprise</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                  <p className="text-gray-600 mt-2">Tailored to your needs</p>
                </div>
                <ul className="mt-6 space-y-4">
                  {[
                    "Unlimited members",
                    "Advanced analytics",
                    "White-label solution",
                    "24/7 phone support",
                    "Custom integrations",
                    "Dedicated account manager",
                    "Save 20+ hours weekly",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-8">
                <Button variant="outline" className="w-full" size="lg">
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Time Savings Calculator */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
        <div className="container px-4 mx-auto text-center">
          <div className="inline-block animate-float mb-8">
            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
              ROI Calculator
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">See How Much Time You Can Save</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Our customers report significant time savings across all aspects of gym management.
            Here's what you could save:
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Member Management</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-blue-600">5+</span>
                  <div className="text-left">
                    <span className="text-lg font-semibold text-blue-600">hrs</span>
                    <span className="block text-sm text-gray-500">/week</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Automated member operations & paperwork</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Attendance Tracking</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-green-600">4+</span>
                  <div className="text-left">
                    <span className="text-lg font-semibold text-green-600">hrs</span>
                    <span className="block text-sm text-gray-500">/week</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Streamlined check-ins & monitoring</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Billing & Reports</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-purple-600">6+</span>
                  <div className="text-left">
                    <span className="text-lg font-semibold text-purple-600">hrs</span>
                    <span className="block text-sm text-gray-500">/week</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Automated financial management</p>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900">Total Time Saved</h3>
                  <p className="text-gray-600">Per month across all operations</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-bold text-blue-600">60+</span>
                  <div className="text-left">
                    <span className="text-xl font-semibold text-blue-600">hours</span>
                    <span className="block text-sm text-gray-500">monthly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to transform your gym management?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of gym owners who save 15+ hours every week with GymOne.
            Start your journey to efficient gym management today.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center text-gray-400">
            <p>© 2024 GymOne. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 