import React from 'react';
import { Brain } from 'lucide-react';

const Hero = () => {
  return (
    <div className="pt-20 pb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">AI赋能</span>
            <span className="block text-blue-600">精准鼻腔护理</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            结合人工智能与现代医学，为您提供个性化的鼻腔护理方案。
            实时监测、智能分析、专业建议，守护您的呼吸健康。
          </p>

        </div>
      </div>
    </div>
  );
};

export default Hero;