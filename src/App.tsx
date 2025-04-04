import React from 'react';
import { Stethoscope, Upload, Calendar, LineChart, Menu } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import AIAnalysis from './components/AIAnalysis';
import SymptomLog from './components/SymptomLog';
import Appointment from './components/Appointment';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main>
        <Hero />
        <AIAnalysis />
        <Features />
        <HowItWorks />
        <SymptomLog />
        <Appointment />
      </main>
      <Footer />
    </div>
  );
}

export default App;