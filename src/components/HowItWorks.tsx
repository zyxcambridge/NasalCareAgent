import React from 'react';
import { Droplets, Upload, Brain, Activity } from 'lucide-react';

const steps = [
  {
    title: '智能压力控制',
    description: '设备实时监测冲洗压力，自动调节水流强度，确保安全舒适的护理体验',
    icon: Droplets,
  },
  {
    title: '上传症状图片',
    description: '拍摄并上传鼻涕照片，AI系统将快速分析颜色特征',
    icon: Upload,
  },
  {
    title: 'AI智能分析',
    description: 'AI模型结合专业医学数据库，精准识别症状，生成个性化护理建议',
    icon: Brain,
  },
  {
    title: '追踪健康状况',
    description: '记录每日症状变化，通过数据可视化直观展示康复进展',
    icon: Activity,
  },
];

const HowItWorks = () => {
  return (
    <div id="how-it-works" className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            智能护理流程
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            四步轻松实现专业级鼻腔护理，让您的呼吸更加顺畅
          </p>
        </div>

        <div className="mt-20">
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute w-full h-1 bg-blue-200 top-1/2 transform -translate-y-1/2 z-0" />

            <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white shadow-lg mb-6">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;