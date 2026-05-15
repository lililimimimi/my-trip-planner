# 🌍 AI Travel Planner | AI 旅行规划助手

基于 LLM 的智能旅行规划助手，支持 AI 行程生成、多轮对话、流式输出、高德地图集成、餐厅/酒店推荐，以及本地旅行知识库 RAG 检索。

An AI-powered travel planning assistant built with LLM, supporting itinerary generation, streaming chat, Amap integration, restaurant/hotel recommendations, and RAG-based local travel knowledge.

---

## ✨ Features | 功能特色

- 🤖 AI 智能行程规划
- 💬 多轮对话与流式输出
- 🗺 高德地图 / Amap 集成
- 🍜 本地小吃与餐厅推荐
- 🏨 酒店推荐
- 📚 城市旅行攻略 RAG
- 🖼 Unsplash 景点图片展示
- 📍 行程列表、详情页与地图预览

---

## 🏗 Tech Stack | 技术栈

**Backend**

- FastAPI
- Python
- ChromaDB
- Sentence Transformers
- LLM API：DeepSeek / Qwen / Groq 等

**Frontend**

- React
- TypeScript
- Vite
- Amap JS API
- Unsplash API

---

## 📁 Project Structure | 项目结构

```bash
my-trip-planner/
├── backend/
│   ├── main.py              # FastAPI 入口
│   ├── agent.py             # AI Agent 核心逻辑
│   ├── tools.py             # 高德 API / RAG 工具函数
│   ├── config.py            # 配置管理
│   ├── build_rag.py         # RAG 知识库构建脚本
│   ├── requirements.txt     # Python 依赖
│   ├── .env.example         # 后端环境变量模板
│   │
│   ├── knowledge/           # 当地小吃知识库
│   │   ├── 北京.txt
│   │   ├── 上海.txt
│   │   └── ...
│   │
│   ├── rag/                 # 城市旅行攻略文档
│   │   ├── 成都.txt
│   │   └── ...
│   │
│   └── chroma_db/           # 向量数据库，运行 build_rag.py 后自动生成
│
└── frontend/
    ├── src/
    │   ├── App.tsx          # 主页面
    │   │
    │   ├── components/      # 页面组件
    │   │   ├── TripForm.tsx        # 行程表单
    │   │   ├── ChatBox.tsx         # AI 对话框
    │   │   ├── ListView.tsx        # 行程列表
    │   │   ├── DetailView.tsx      # 行程详情
    │   │   ├── AttractionItem.tsx  # 景点卡片
    │   │   ├── MealList.tsx        # 餐饮推荐
    │   │   ├── HotelCard.tsx       # 酒店卡片
    │   │   ├── LocalFoodList.tsx   # 本地小吃列表
    │   │   ├── DayOverview.tsx     # 每日行程概览
    │   │   └── MapPreview.tsx      # 地图预览
    │   │
    │   ├── services/        # API 服务
    │   │   ├── api.ts              # 后端接口请求
    │   │   └── unsplash.ts         # Unsplash 图片服务
    │   │
    │   └── types/
    │       └── index.ts            # TypeScript 类型定义
    │
    ├── .env.example         # 前端环境变量模板
    └── package.json
```

---

## 🚀 Quick Start | 快速开始

### Backend | 启动后端

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python build_rag.py
uvicorn main:app --reload --port 8001
```

后端默认运行在：

```bash
http://127.0.0.1:8001
```

### Frontend | 启动前端

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

前端默认运行在：

```bash
http://localhost:5173
```

---

## 🔧 Environment Variables | 环境变量

### backend/.env

```env
LLM_API_KEY=your_key
LLM_BASE_URL=https://api.siliconflow.cn/v1
LLM_MODEL_ID=Qwen/Qwen2.5-72B-Instruct
AMAP_API_KEY=your_key
```

### frontend/.env

```env
VITE_API_BASE_URL=http://127.0.0.1:8001
VITE_AMAP_WEB_JS_KEY=your_key
VITE_UNSPLASH_ACCESS_KEY=your_key
```

---

## 🧠 RAG Knowledge Base | RAG 知识库

项目包含两类本地知识：

- `backend/knowledge/`：当地小吃、美食知识
- `backend/rag/`：城市旅行攻略、景点介绍、旅行建议

构建向量数据库：

```bash
cd backend
python build_rag.py
```

生成结果会保存到：

```bash
backend/chroma_db/
```



## 📌 Notes | 注意事项

- 请先配置前后端 `.env` 文件。
- 运行项目前需要先执行 `python build_rag.py` 构建知识库。
- 高德地图、LLM 和 Unsplash API Key 需要自行申请。
- `chroma_db/` 为自动生成目录，通常不需要手动修改。

---

## 📄 License

MIT License
