import React from 'react';
import { Stethoscope, Upload, Calendar, LineChart } from 'lucide-react';

const features = [
  {
    name: '实时压力监测',
    description: '智能控制冲洗压力，避免伤害，确保安全护理',
    icon: Stethoscope,
  },
  {
    name: '智能鼻涕颜色分析',
    description: '上传照片，AI识别病情并推荐个性化护理方案',
    icon: Upload,
  },
  {
    name: '依从性管理',
    description: '追踪用户护理习惯，提供个性化提醒',
    icon: Calendar,
  },
  {
    name: '数据可视化',
    description: '直观展示护理进展，科学分析健康趋势',
    icon: LineChart,
  },
];

const Features = () => {
  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            核心功能
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            融合AI技术与医学专业，为您提供全方位的鼻腔护理解决方案
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;