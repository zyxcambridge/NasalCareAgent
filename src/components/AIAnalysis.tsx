import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Analysis {
  color: string;
  condition: string;
  recommendation: string;
  westernMedicine?: string; // 西医解释
  tcm?: string; // 中医辨证
  physical?: string; // 物理疗法
  location?: string; // 鼻涕在图片中的位置
  presence?: string; // 是否存在鼻涕
}

const analysisData: Record<string, Analysis> = {
  clear: {
    color: '清澈透明',
    condition: '过敏性鼻炎',
    recommendation: '佩戴口罩、避免过敏源、定期冲洗',
    westernMedicine: '鼻腔黏膜的炎症反应，纤毛摆动频率从正常8-12Hz降至4-6Hz，黏液清除效率降低60%',
    tcm: '鼻渊，肺气虚弱，脾虚湿阻，肾阳不足',
    physical: '移走鼻涕，减轻堵塞，通气',
    location: '鼻腔内部',
    presence: 'found'
  },
  yellow: {
    color: '黄色',
    condition: '轻度感染',
    recommendation: '补充水分、定期护理、观察症状变化',
    westernMedicine: '鼻腔黏膜的炎症反应，纤毛摆动频率从正常8-12Hz降至4-6Hz，黏液清除效率降低60%',
    tcm: '风热犯肺，湿浊壅塞',
    physical: '移走鼻涕，减轻堵塞，通气',
    location: '鼻腔内部及鼻孔周围',
    presence: 'found'
  },
  green: {
    color: '绿色',
    condition: '细菌感染',
    recommendation: '建议就医，可能需要抗生素',
    westernMedicine: '鼻腔黏膜的炎症反应，纤毛摆动频率从正常8-12Hz降至4-6Hz，黏液清除效率降低60%',
    tcm: '风热犯肺，湿浊壅塞',
    physical: '移走鼻涕，减轻堵塞，通气',
    location: '鼻腔内部及鼻孔周围',
    presence: 'found'
  },
  red: {
    color: '带血',
    condition: '毛细血管破裂',
    recommendation: '减少冲洗频率、避免鼻腔干燥',
    westernMedicine: '鼻腔黏膜的炎症反应，纤毛摆动频率从正常8-12Hz降至4-6Hz，黏液清除效率降低60%',
    tcm: '风热犯肺，肺经热盛',
    physical: '移走鼻涕，减轻堵塞，通气',
    location: '鼻腔内部，可能伴有鼻腔壁出血点',
    presence: 'found'
  },
};

const AIAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError('请上传图片文件（JPG、PNG格式）');
      }
    }
  };

  // 初始化Google Generative AI
const API_KEY = 'AIzaSyC5zCgXXwCNbUmbQR_phRtmciRSBrCcDqg';
const genAI = new GoogleGenerativeAI(API_KEY);

const analyzeImage = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      if (!selectedFile || !previewUrl) {
        throw new Error('未找到图片文件');
      }

      // 验证并获取base64图片数据
      if (!previewUrl.startsWith('data:image')) {
        throw new Error('无效的图片格式');
      }
      const base64Image = previewUrl.split(',')[1];
      if (!base64Image) {
        throw new Error('无法解析图片数据');
      }
      
      // 创建Gemini模型实例
      // gemini-2.5-pro-exp-03-25
      // const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-exp-03-25' });
      const prompt = `
你是中西医结合的耳鼻喉专家，请对上传的鼻部图像进行分析，判断是否存在鼻涕，并给出中西医联合护理建议。

【步骤1：是否存在鼻涕】
- 判断图像中是否存在鼻腔分泌物（鼻涕）
- 若存在，请指出其图像中位置（用自然语言描述位置，如“鼻翼左侧”“鼻腔外溢”等）

【步骤2：鼻涕颜色与状态分析】
- 精确识别鼻涕颜色（十六进制色码+RGB）
- 判断透明度/粘稠度/是否带血/是否含杂质
- 估计其体积（如“少量涕迹”“大量浓涕”）

【步骤3：中西医联合诊断】
请基于以下医学标准进行诊断：

【西医依据】
- 《中国慢性鼻窦炎诊疗指南(2018)》
- 涕液细胞学与微生物学标准
- 常见感染分类（病毒/细菌/真菌/过敏）

【中医依据】
- 《中医耳鼻喉科学》辨证理论
- “肺开窍于鼻、涕为肺液” + 六淫病机
- 徐荣谦辨涕三纲法

【步骤4：生成护理建议】
- 给出中/西医护理方案
- 每条建议必须包含：剂量/方法/频率/风险提示

【输出要求】
请返回以下结构化 JSON：

{
  "presence": "found" | "not_found",
  "location": "若存在，描述具体图像中位置，如“鼻孔内缘，左侧鼻翼附近”",
  "color_analysis": {
    "hex": "#xxxxxx",
    "rgb": "rgb(x, x, x)",
    "description": "如“粘稠黄色，伴有絮状物”",
    "transparency": "清澈 / 微混 / 浑浊",
    "viscosity": "稀 / 中等 / 稠厚",
    "volume": "少量 / 中量 / 大量"
  },
  "western_medicine": {
    "condition": "如‘急性细菌性鼻窦炎’",
    "pathology_basis": "如‘中性粒细胞>75%+肺炎链球菌阳性’",
    "recommendations": [
      "0.9%盐水冲洗，每日3次，每次10ml",
      "口服阿莫西林7天"
    ]
  },
  "tcm": {
    "syndrome": "如‘风热犯肺证’",
    "differentiation": "如‘舌红苔黄，脉浮数’",
    "recommendations": [
      "桑菊饮加减：桑叶6g，菊花9g...",
      "按摩迎香穴、印堂穴，每次3分钟，每日2次"
    ]
  }
}

【特殊说明】
- 若未识别出鼻涕，请设置 "presence": "not_found"，并省略后续诊断项
- 禁止输出任何解释性文字或 Markdown 格式，仅输出纯 JSON
- 所有中药方案必须注明精确克数，建议“水煎 400ml，分2次服”
- 鼻涕位置为图像层级自然语言描述，支持配合前端高亮标注

`;
      // 发送请求到Gemini API
      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: selectedFile.type || 'image/jpeg'
          }
        },
        prompt
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      // 解析返回的JSON结果
      try {
        const analysisResult = JSON.parse(text);
        
        // 从color_analysis中获取颜色描述
        const colorDescription = analysisResult.color_analysis?.description || '';
        const colorKey = Object.keys(analysisData).find(key => 
          colorDescription.toLowerCase().includes(key)
        ) || 'clear';
        
        // 直接从API返回结果中提取西医、中医和物理部分的内容，以及鼻涕位置信息
        // 特别处理tcm字段，确保包含完整的中医诊断信息
        let tcmInfo = '';
        if (analysisResult.tcm) {
          // 组合中医辨证信息
          const tcmParts = [];
          if (analysisResult.tcm.syndrome) tcmParts.push(analysisResult.tcm.syndrome);
          if (analysisResult.tcm.differentiation) tcmParts.push(analysisResult.tcm.differentiation);
          
          // 添加中医推荐方案
          if (analysisResult.tcm.recommendations && analysisResult.tcm.recommendations.length > 0) {
            tcmParts.push('推荐：' + analysisResult.tcm.recommendations.join('；'));
          }
          
          tcmInfo = tcmParts.join('，');
        }
        
        setAnalysis({
          color: analysisResult.color_analysis?.description || analysisData[colorKey].color,
          condition: analysisResult.western_medicine?.condition || analysisData[colorKey].condition,
          recommendation: analysisResult.western_medicine?.recommendations?.join('、') || analysisData[colorKey].recommendation,
          westernMedicine: analysisResult.western_medicine?.pathology_basis || analysisData[colorKey].westernMedicine,
          tcm: tcmInfo || analysisData[colorKey].tcm,
          physical: analysisResult.western_medicine?.recommendations?.join('、') || analysisData[colorKey].physical,
          location: analysisResult.location || '',
          presence: analysisResult.presence || 'not_found'
        });
      } catch (parseError) {
        // 如果返回结果不是有效的JSON，尝试从文本中提取信息
        console.error('解析AI返回结果失败:', parseError);
        
        // 使用预设的分析数据作为备选
        let matchedAnalysis = null;
        
        // 尝试根据返回文本匹配最合适的预设分析
        if (text.toLowerCase().includes('黄') || text.toLowerCase().includes('yellow')) {
          matchedAnalysis = analysisData.yellow;
        } else if (text.toLowerCase().includes('绿') || text.toLowerCase().includes('green')) {
          matchedAnalysis = analysisData.green;
        } else if (text.toLowerCase().includes('血') || text.toLowerCase().includes('red')) {
          matchedAnalysis = analysisData.red;
        } else {
          matchedAnalysis = analysisData.clear;
        }
        
        // 尝试从文本中提取位置信息
        let location = '';
        const locationMatch = text.match(/位置[：:](.*?)(?=[。\n]|$)/i) || 
                            text.match(/location[：:](.*?)(?=[.\n]|$)/i) ||
                            text.match(/鼻涕.*?在(.*?)(?=[。\n]|$)/i);
        
        if (locationMatch && locationMatch[1]) {
          location = locationMatch[1].trim();
          matchedAnalysis.location = location;
          matchedAnalysis.presence = 'found';
        }
        
        setAnalysis(matchedAnalysis);
      }
    } catch (err) {
      console.error('分析过程中出现错误:', err);
      // 使用专门的错误处理函数
      handleApiError(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 添加错误处理函数，确保组件不会因为API错误而完全崩溃
  const handleApiError = (err: any) => {
    console.error('API错误:', err);
    
    // 根据错误类型提供更具体的错误信息
    if (err instanceof SyntaxError) {
      setError('AI返回数据格式异常，请重试');
    } else if (err.message?.includes('无效的图片格式')) {
      setError('仅支持JPG/PNG图片格式');
    } else if (err.message?.includes('PERMISSION_DENIED') || err.message?.includes('API key')) {
      setError('AI服务授权失败，请联系客服');
    } else if (err.message?.includes('RESOURCE_EXHAUSTED')) {
      setError('AI服务请求次数已达上限，请稍后再试');
    } else if (err.message?.includes('UNAVAILABLE') || err.message?.includes('DEADLINE_EXCEEDED')) {
      setError('AI服务暂时不可用，请稍后再试');
    } else {
      setError('分析失败，请重试或联系客服');
    }
    
    setIsAnalyzing(false);
  };

  return (
    <div id="ai-analysis" className="py-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-t-4 border-b-4 border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block text-blue-600">AI智能诊断</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            上传照片，获取专业分析和个性化护理建议
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
            {/* Upload Section */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-sm">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <span>上传图片</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG 格式</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-xs rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 flex items-center text-red-500">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}

              {/* Analysis Button */}
              {selectedFile && !isAnalyzing && !analysis && (
                <button
                  onClick={analyzeImage}
                  className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  开始分析
                </button>
              )}

              {/* Loading State */}
              {isAnalyzing && (
                <div className="mt-4 text-blue-600">
                  <div className="animate-pulse">分析中...</div>
                </div>
              )}

              {/* Analysis Results */}
              {analysis && (
                <div className="mt-6 w-full max-w-sm bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="space-y-3">
                    {/* 鼻涕检测结果 */}
                    {analysis.presence && (
                      <div className="bg-blue-50 p-3 rounded-md mb-3">
                        <h3 className="font-bold text-blue-600 mb-2">鼻涕检测</h3>
                        <div>
                          <span className="font-medium">检测结果：</span>
                          <span>{analysis.presence === 'found' ? '已检测到鼻涕' : '未检测到鼻涕'}</span>
                        </div>
                        {analysis.presence === 'found' && analysis.location && (
                          <div className="mt-2">
                            <span className="font-medium">位置：</span>
                            <span>{analysis.location}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">颜色特征：</span>
                      <span>{analysis.color}</span>
                    </div>
                    <div>
                      <span className="font-medium">可能症状：</span>
                      <span>{analysis.condition}</span>
                    </div>
                    <div className="border-t pt-3">
                      <h3 className="font-bold text-blue-600 mb-2">护理建议</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">基本建议：</span>
                          <span>{analysis.recommendation}</span>
                        </div>
                        <div>
                          <span className="font-medium">西医解释：</span>
                          <span>{analysis.westernMedicine}</span>
                        </div>
                        <div>
                          <span className="font-medium">中医辨证：</span>
                          <span>{analysis.tcm}</span>
                        </div>
                        <div>
                          <span className="font-medium">物理疗法：</span>
                          <span>{analysis.physical}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setAnalysis(null);
                    }}
                    className="mt-4 w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    重新上传
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;