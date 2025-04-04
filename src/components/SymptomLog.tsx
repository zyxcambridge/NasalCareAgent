import React, { useState } from 'react';
import { Calendar, LineChart, AlertCircle } from 'lucide-react';

interface SymptomData {
  date: string;
  nasalCongestion: string;
  sneezeCount: number;
  allergicReactions: string[];
  headache: boolean;
  sleepQuality: string;
  earProblems: boolean;
}

const SymptomLog = () => {
  const [symptoms, setSymptoms] = useState<SymptomData>({
    date: new Date().toISOString().split('T')[0],
    nasalCongestion: '轻度',
    sneezeCount: 0,
    allergicReactions: [],
    headache: false,
    sleepQuality: '良好',
    earProblems: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setSymptoms((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else if (name === 'allergicReactions') {
      const checkbox = e.target as HTMLInputElement;
      setSymptoms((prev) => ({
        ...prev,
        allergicReactions: checkbox.checked
          ? [...prev.allergicReactions, value]
          : prev.allergicReactions.filter((reaction) => reaction !== value),
      }));
    } else {
      setSymptoms((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the data to your backend
    console.log('Submitted symptoms:', symptoms);
    alert('症状记录已保存！');
  };

  return (
    <div id="symptom-log" className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            每日症状记录
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            记录您的日常症状，帮助我们更好地了解您的健康状况
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  日期
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={symptoms.date}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Nasal Congestion */}
              <div>
                <label htmlFor="nasalCongestion" className="block text-sm font-medium text-gray-700">
                  鼻塞程度
                </label>
                <select
                  id="nasalCongestion"
                  name="nasalCongestion"
                  value={symptoms.nasalCongestion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option>轻度</option>
                  <option>中度</option>
                  <option>重度</option>
                </select>
              </div>

              {/* Sneeze Count */}
              <div>
                <label htmlFor="sneezeCount" className="block text-sm font-medium text-gray-700">
                  打喷嚏次数
                </label>
                <input
                  type="number"
                  name="sneezeCount"
                  id="sneezeCount"
                  min="0"
                  value={symptoms.sneezeCount}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              {/* Allergic Reactions */}
              <div>
                <span className="block text-sm font-medium text-gray-700">过敏反应</span>
                <div className="mt-2 space-y-2">
                  {['鼻痒', '眼痒', '喉咙痒'].map((reaction) => (
                    <div key={reaction} className="flex items-center">
                      <input
                        type="checkbox"
                        id={reaction}
                        name="allergicReactions"
                        value={reaction}
                        checked={symptoms.allergicReactions.includes(reaction)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={reaction} className="ml-2 text-sm text-gray-700">
                        {reaction}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Headache */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="headache"
                  name="headache"
                  checked={symptoms.headache}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="headache" className="ml-2 text-sm text-gray-700">
                  头痛或面部压力
                </label>
              </div>

              {/* Sleep Quality */}
              <div>
                <label htmlFor="sleepQuality" className="block text-sm font-medium text-gray-700">
                  睡眠质量
                </label>
                <select
                  id="sleepQuality"
                  name="sleepQuality"
                  value={symptoms.sleepQuality}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option>良好</option>
                  <option>一般</option>
                  <option>较差</option>
                  <option>很差</option>
                </select>
              </div>

              {/* Ear Problems */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="earProblems"
                  name="earProblems"
                  checked={symptoms.earProblems}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="earProblems" className="ml-2 text-sm text-gray-700">
                  耳闷或听力下降
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                保存记录
              </button>
            </div>
          </form>

          {/* Trend Visualization Placeholder */}
          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">症状趋势</h3>
              <LineChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <span className="text-gray-500">历史数据统计图表将在这里显示</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomLog;