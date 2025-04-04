import { createClient } from '@supabase/supabase-js';

// 使用环境变量获取Supabase URL和匿名密钥
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 确保环境变量存在
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少Supabase环境变量配置');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);