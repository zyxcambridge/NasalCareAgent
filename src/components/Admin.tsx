import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Appointment {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  doctor: string;
  symptoms: string;
  status: string;
}

const Admin = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('全部状态');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);

  // 获取预约数据
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('appointments').select('*');
      
      // 应用状态过滤
      if (statusFilter !== '全部状态') {
        query = query.eq('status', statusFilter);
      }
      
      // 按日期排序，最新的在前面
      query = query.order('appointment_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      setAppointments(data || []);
    } catch (err: any) {
      console.error('获取预约数据失败:', err);
      setError('获取预约数据失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理状态过滤变化
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // 处理预约状态更新
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // 更新本地状态
      setAppointments(appointments.map(appointment => 
        appointment.id === id ? { ...appointment, status: newStatus } : appointment
      ));
    } catch (err: any) {
      console.error('更新预约状态失败:', err);
      setError('更新预约状态失败，请重试');
    }
  };

  // 处理预约删除
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这条预约记录吗？此操作不可撤销。')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 从本地状态中移除
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (err: any) {
      console.error('删除预约失败:', err);
      setError('删除预约失败，请重试');
    }
  };

  // 处理登录表单变化
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  // 处理管理员登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;
      
      setIsAuthenticated(true);
      fetchAppointments(); // 登录成功后获取数据
    } catch (err: any) {
      console.error('登录失败:', err);
      setLoginError('登录失败，请检查邮箱和密码');
    }
  };

  // 处理退出登录
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsAuthenticated(false);
    } catch (err) {
      console.error('退出登录失败:', err);
    }
  };

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        fetchAppointments();
      }
    };

    checkAuth();
  }, []);

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            管理员登录
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginForm.email}
                    onChange={handleLoginInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={loginForm.password}
                    onChange={handleLoginInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {loginError && (
                <div className="text-sm text-red-600">
                  {loginError}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  登录
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">预约管理</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            退出登录
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  预约列表
                </h3>
                <div>
                  <select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="全部状态">全部状态</option>
                    <option value="待确认">待确认</option>
                    <option value="已确认">已确认</option>
                    <option value="已完成">已完成</option>
                    <option value="已取消">已取消</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">加载中...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">
                  {error}
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  暂无预约记录
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          客户
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          服务
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          日期时间
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                            <div className="text-sm text-gray-500">{appointment.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointment.doctor}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{appointment.symptoms || '无症状描述'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(appointment.appointment_date)}</div>
                            <div className="text-sm text-gray-500">{appointment.appointment_time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === '待确认' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === '已确认' ? 'bg-green-100 text-green-800' :
                              appointment.status === '已完成' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {appointment.status === '待确认' && (
                                <button
                                  onClick={() => handleStatusUpdate(appointment.id, '已确认')}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  确认
                                </button>
                              )}
                              {appointment.status === '已确认' && (
                                <button
                                  onClick={() => handleStatusUpdate(appointment.id, '已完成')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  完成
                                </button>
                              )}
                              {(appointment.status === '待确认' || appointment.status === '已确认') && (
                                <button
                                  onClick={() => handleStatusUpdate(appointment.id, '已取消')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  取消
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(appointment.id)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;