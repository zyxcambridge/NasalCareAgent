import React from 'react';
import { MessageSquare, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">联系我们</h3>
            <div className="flex items-center text-gray-300">
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="hover:text-white">
                微信: zhangyixin395104
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-300 hover:text-white">
                  功能介绍
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-300 hover:text-white">
                  价格方案
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-white">
                  常见问题
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">关注我们</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Github</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} 鼻腔护理Agent. 版权所有：张益新
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;