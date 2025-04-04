import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
}

interface AppointmentData {
  name: string;
  phone: string;
  date: string;
  time: string;
  doctor: string;
  symptoms: string;
}

const Appointment = () => {
  // 状态管理
  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [formData, setFormData] = useState<AppointmentData>({
    name: '',
    phone: '',
    date: '',
    time: '',
    doctor: '',
    symptoms: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 模拟医生数据
  const doctors: Doctor[] = [
    { id: '1', name: '李医生', specialty: '鼻炎专家', available: true },
    { id: '2', name: '王医生', specialty: '过敏症专家', available: true },
    { id: '3', name: '张医生', specialty: '耳鼻喉科医师', available: true },
  ];
  
  // 模拟时间段数据
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '10:00', available: true },
    { id: '2', time: '10:30', available: true },
    { id: '3', time: '11:00', available: true },
    { id: '4', time: '11:30', available: true },
    { id: '5', time: '14:00', available: true },
    { id: '6', time: '14:30', available: true },
    { id: '7', time: '15:00', available: true },
    { id: '8', time: '15:30', available: true },
    { id: '9', time: '16:00', available: true },
    { id: '10', time: '16:30', available: true },
    { id: '11', time: '17:00', available: true },
    { id: '12', time: '17:30', available: true },
  ];

  // 处理日期选择
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setFormData({ ...formData, date: e.target.value });
  };

  // 处理时间选择
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setFormData({ ...formData, time });
  };

  // 处理医生选择
  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    const doctor = doctors.find(d => d.id === doctorId);
    setFormData({ ...formData, doctor: doctor ? doctor.name : '' });
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 处理下一步
  const handleNextStep = () => {
    if (step === 1 && !selectedDate) {
      setError('请选择预约日期');
      return;
    }
    if (step === 2 && !selectedTime) {
      setError('请选择预约时间');
      return;
    }
    if (step === 3 && !selectedDoctor) {
      setError('请选择医生');
      return;
    }
    
    setError(null);
    setStep(step + 1);
  };

  // 处理上一步
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // 提交预约
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.name || !formData.phone) {
      setError('请填写姓名和电话');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 提交到Supabase
      const { error } = await supabase
        .from('appointments')
        .insert([{
          name: formData.name,
          phone: formData.phone,
          appointment_date: formData.date,
          appointment_time: formData.time,
          doctor: formData.doctor,
          symptoms: formData.symptoms,
          status: '待确认' // 初始状态
        }]);
      
      if (error) throw error;
      
      setIsSuccess(true);
    } catch (err: any) {
      console.error('预约提交错误:', err);
      setError(err.message || '预约提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '',
      doctor: '',
      symptoms: ''
    });
    setIsSuccess(false);
    setError(null);
  };

  return (
    <div id="appointment" className="py-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-t-4 border-b-4 border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block text-blue-600">在线预约</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            预约我们的专业鼻炎诊疗服务，选择您喜欢的医生和合适的时间。
          </p>
        </div>

        {!isSuccess ? (
          <div className="mt-12 max-w-lg mx-auto">
            {/* 步骤指示器 */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-red-500' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="mt-2 text-sm">选择服务</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-red-500' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="mt-2 text-sm">选择医生</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                <div className={`flex flex-col items-center ${step >= 3 ? 'text-red-500' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 3 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className="mt-2 text-sm">选择时间</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 4 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                <div className={`flex flex-col items-center ${step >= 4 ? 'text-red-500' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 4 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                    4
                  </div>
                  <span className="mt-2 text-sm">确认预约</span>
                </div>
              </div>
            </div>

            {/* 表单内容 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              {/* 步骤1：选择日期 */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">选择日期</h3>
                  <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      日期
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 步骤2：选择时间 */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">可用时间</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`py-2 px-4 rounded-md ${selectedTime === slot.time
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 步骤3：选择医生 */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">选择医生</h3>
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => handleDoctorSelect(doctor.id)}
                        className={`p-4 border rounded-lg cursor-pointer ${selectedDoctor === doctor.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                          </div>
                          {selectedDoctor === doctor.id && (
                            <CheckCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 步骤4：填写个人信息 */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">确认预约信息</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          姓名
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="请输入您的姓名"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          电话
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="请输入您的电话号码"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                          症状描述
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                          </div>
                          <textarea
                            id="symptoms"
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleInputChange}
                            placeholder="请简要描述您的症状"
                            rows={3}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900 mb-2">预约详情</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <span>日期：{formData.date}</span>
                          </div>
                          <div className="flex">
                            <Clock className="h-5 w-5 text-gray-400 mr-2" />
                            <span>时间：{formData.time}</span>
                          </div>
                          <div className="flex">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span>医生：{formData.doctor}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="mt-4 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        上一步
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? '提交中...' : '确认预约'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 导航按钮 */}
              {step < 4 && (
                <div className="mt-6 flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      上一步
                    </button>
                  )}
                  {step === 1 && (
                    <div></div> // 占位，保持布局一致
                  )}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    下一步
                  </button>
                </div>
              )}

              {/* 错误提示 */}
              {error && step < 4 && (
                <div className="mt-4 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-12 max-w-lg mx-auto bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">预约成功！</h3>
            <p className="text-gray-600 mb-6">
              您已成功预约 {formData.date} {formData.time} 的鼻炎诊疗服务，{formData.doctor}医生将为您服务。
            </p>
            <p className="text-gray-600 mb-6">
              我们会通过 {formData.phone} 与您联系确认预约详情。
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              返回首页
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;