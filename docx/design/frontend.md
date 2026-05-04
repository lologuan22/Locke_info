# 🎮 前端文档 - 洛克王国图鉴与背包系统

## 📌 目录
1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [页面详解](#页面详解)
5. [API接口](#api接口)
6. [组件架构](#组件架构)
7. [样式系统](#样式系统)
8. [工具函数与Hook](#工具函数与hook)
9. [配置说明](#配置说明)
10. [开发与部署](#开发与部署)

---

## 📖 项目概述

### 功能定位
本前端项目是**洛克王国游戏图鉴与背包管理系统**的用户界面，基于Vue 3 + JavaScript实现，为玩家提供精灵图鉴浏览、个人背包管理、培养进度跟踪和数据可视化等核心功能。

### 核心特性
- ✅ **用户认证系统**：注册、登录、个人资料编辑
- ✅ **图鉴浏览**：分页查看全球精灵、按属性/名称筛选
- ✅ **收藏管理**：添加/移除收集的精灵、清空收藏
- ✅ **详情展示**：多维度数据展示（基础属性、技能、培养建议）
- ✅ **数据可视化**：雷达图、进度条、统计表格
- ✅ **响应式设计**：支持桌面端与移动设备
- ✅ **对比功能**：支持多个精灵属性对比分析

---

## 🛠️ 技术栈

### 核心框架
| 技术 | 版本 | 用途 |
|------|------|------|
| **Vue.js** | 3.x (CDN引入) | 前端框架，组件化开发 |
| **Vite** | 8.0.10+ | 构建工具，开发服务器与打包 |
| **Axios** | 1.15.2 | HTTP客户端，API请求 |
| **ECharts** | 5.4.3 | 数据可视化，雷达图绘制 |

### 编程语言
- **JavaScript (ES6+)** - 核心编程语言
- **HTML5** - 页面结构
- **CSS3** - 样式与布局（含响应式设计）

### 构建与包管理
- **Node.js + npm** - 依赖管理与脚本运行
- **Vite插件** - 静态资源复制 (`vite-plugin-static-copy`)

---

## 📁 项目结构

```
frontend/
├── index.html                 # 主页（精灵图鉴列表）
├── compare.html               # 精灵对比页面
├── debug.html                 # 调试页面
├── details.html               # 宠物详情页
├── my-collection.html         # 我的冒险手册（个人收藏）
├── world-map.html             # 全球图鉴（地图视图）
│
├── package.json               # 项目配置和依赖
├── vite.config.js             # Vite构建配置
│
├── js/                        # JavaScript源代码
│   ├── config.js              # 全局配置（BASE_URL、TIMEOUT）
│   ├── api/
│   │   └── index.js           # API接口定义和请求方法
│   ├── components/
│   │   └── header/
│   │       ├── HeaderContainer.js   # 顶部导航容器
│   │       ├── AuthModal.js         # 登录/注册模态框
│   │       └── UserPanel.js         # 用户面板（头像、菜单）
│   ├── hooks/
│   │   ├── usePetData.js      # 宠物数据获取Hook
│   │   └── usePetLogic.js     # 宠物逻辑处理Hook
│   └── utils/
│       ├── request.js         # Axios实例配置与拦截器
│       ├── chartHelper.js     # 图表辅助函数
│       ├── petChartController.js  # 宠物图表控制器
│       └── urlHelper.js       # URL参数提取工具
│
├── css/                       # 样式文件
│   ├── header-styles.css      # 顶部导航样式
│   ├── auth-modal.css         # 登录/注册模态框样式
│   ├── user-panel.css         # 用户面板样式
│   ├── home.css               # 主页样式（图鉴列表）
│   ├── detail.css             # 详情页样式
│   ├── my-collection.css      # 我的收藏页样式
│   └── (其他页面特定样式)
│
└── public/                    # 公共资源目录（Vite构建时复制）
```

---

## 📄 页面详解

### 1. **index.html - 精灵图鉴主页**
**路径**: `/index.html`  
**功能**: 浏览全部精灵、搜索、筛选、添加到背包

#### 页面组成
- **顶部导航 (HeaderContainer)**
  - Logo与链接
  - 登录/注册入口
  - 用户面板（已登录状态）
  
- **图鉴列表区域**
  ```
  ├─ 搜索栏
  │  ├─ 精灵名称输入框
  │  ├─ 属性类型下拉框 (水、火、草、光、翼、电、冰、武、土、虫、幽灵、恶魔、龙、毒)
  │  └─ 查询按钮
  │
  └─ 精灵卡片网格
     └─ 卡片内容
        ├─ 精灵图片
        ├─ 精灵名称 + 主属性
        └─ "加入背包" / "已收藏" 按钮
  ```

- **个人背包区域**
  ```
  ├─ 搜索与筛选
  ├─ 清空收藏按钮 (带确认机制)
  └─ 已收藏精灵卡片
     └─ 移除按钮
  ```

#### 关键逻辑
- **分页获取**: 默认获取100条，支持继续加载
- **动态筛选**: 即时更新列表，支持名称+属性组合查询
- **背包同步**: 实时显示已拥有精灵的状态
- **确认机制**: 清空操作需要二次确认（2秒倒计时）

#### 数据流
```javascript
// 初始化
onMounted() {
  checkLoginStatus()  // 检查用户登录状态
  fetchList()         // 获取精灵列表
  fetchBackpack()     // 获取个人背包
}

// 用户操作
handleAddToBackpack(pet) -> addToBackpack(pet.id) -> updatePetState()
handleRemoveFromBackpack(id) -> removeFromBackpack(id) -> updatePetState()
```

---

### 2. **details.html - 宠物详情页**
**路径**: `/details.html?id={pokemonId}`  
**功能**: 展示单个精灵的详细信息、技能、培养建议

#### 页面组成
- **基础信息卡片**
  ```
  ├─ 精灵名称 & ID
  ├─ 精灵立绘图片
  ├─ 属性栏（精力、攻击、防御、魔攻、魔抗、速度）
  │  └─ 进度条 + 数值显示
  └─ 响应式布局（桌面端并排，移动端堆叠）
  ```

- **雷达图卡片**
  - 使用ECharts绘制6维属性雷达图
  - 支持基础/养成数值切换
  - 显示实际值与最大值

- **宠物简介**
  - 背景故事与描述文本

- **技能列表** (如果有)
  ```
  技能卡片:
  ├─ 技能名称 & 属性标签
  ├─ 分类 (物理/魔法/变化)
  ├─ 威力 & PP值
  ├─ 学习等级
  └─ 效果描述
  ```

- **培养建议**
  ```
  智能建议包括:
  ├─ 推荐性格 (基于攻防平衡)
  ├─ 定位分析 (输出型/防御型/平衡型)
  └─ 培养策略 (重点属性建议)
  ```

#### 核心渲染逻辑
```javascript
// 从URL提取ID
const id = new URLSearchParams(window.location.search).get('id')

// 加载详情数据
const pet = await getPokemonDetail(id)
// 返回结构: {
//   id, number, name, type1, type2, 
//   height, weight, description,
//   radarData: [hp, atk, def, matk, mdef, speed],
//   skills: [{id, name, type, category, power, pp, effect, requireLevel}],
//   imageUrl, suggestion
// }

// 初始化雷达图
initRadarChart(pet.radarData)
```

---

### 3. **my-collection.html - 我的冒险手册**
**路径**: `/my-collection.html`  
**功能**: 个人收藏的精灵展示与管理

#### 页面特性
- **英雄区 (Hero Section)**
  - 标题: "我的冒险手册"
  - 统计数据
    - 已点亮图鉴: {backpackPets.length}
    - 当前等级: 高阶训练师

- **筛选区**
  - 属性标签按钮 (支持多选)
  - 搜索框 (寻找老伙伴...)

- **收藏卡片网格**
  - 响应式网格布局 (minmax(220px, 1fr))
  - 卡片内容
    ```
    ├─ 属性徽章 (右上角)
    ├─ 精灵图片 (圆形渐变背景)
    ├─ 精灵名称
    ├─ 属性标签
    └─ 详情链接
    ```

#### 交互设计
- **悬停效果**: 卡片上升 + 阴影加深 (-10px translateY)
- **属性筛选**: 标签激活时显示选中状态
- **响应式**: 移动端单列到桌面端多列自适应

---

### 4. **compare.html - 精灵对比页面**
**路径**: `/compare.html`  
**功能**: 并排展示多个精灵属性对比

#### 布局结构
```
对比容器:
├─ 第一只精灵卡片
│  ├─ 精灵立绘 (max-width: 200px)
│  ├─ 基础信息
│  └─ 属性栏
│
├─ VS 分隔符
│
└─ 第二只精灵卡片
   └─ (相同结构)
```

#### 特色设计
- 3D透视效果 (perspective: 1000px)
- 悬停上升动画 (translateY(-5px))
- 高对比度配色 (便于对比)

---

### 5. **world-map.html - 全球图鉴**
**路径**: `/world-map.html`  
**功能**: 地图化组织与展示所有精灵

#### 特点
- 大气感的筛选栏
- 响应式网格布局
- 地图主题的视觉设计

---

### 6. **debug.html - 调试页面**
**用途**: 开发阶段的API测试和数据调试

---

## 🔌 API接口

### 基础配置
**文件**: `js/api/index.js` 和 `js/config.js`

```javascript
// 全局配置
export const CONFIG = {
  BASE_URL: '',  // 相对路径或http://localhost:8080
  TIMEOUT: 10000 // 10秒超时
}
```

### HTTP请求拦截器
**文件**: `js/utils/request.js`

#### 请求拦截器
- ✅ 自动注入 `Authorization: Bearer {token}` 头
- ✅ 从localStorage读取存储的token

#### 响应拦截器
- ✅ 统一返回res.data (JSON)
- ✅ 详细的错误诊断输出
- ✅ 自动处理网络错误

### API方法清单

#### 1. **用户认证模块** (`/api/user/*`)

```javascript
// 用户登录
login(data)
// @param data = { username, password }
// @return { token, userInfo: User }

// 用户注册
register(data)
// @param data = { username, password, [email], [nickname] }

// 获取当前用户信息
getCurrentUserInfo()
// @return User

// 更新个人资料
updateProfile(data)
// @param data = Partial<User>

// 上传头像
uploadAvatar(formData)
// @param formData = FormData with avatar file
// @return avatarUrl: string

// 用户登出
logout()
```

**User对象结构**:
```javascript
{
  id: number,           // 用户ID
  username: string,     // 用户名
  email: string,        // 邮箱
  nickname: string,     // 昵称
  avatarUrl: string,    // 头像URL
  createdAt: ISO8601,   // 创建时间
  status: 0|1          // 0-禁用, 1-正常
}
```

#### 2. **宠物精灵模块** (`/api/pokemons/*`)

```javascript
// 分页获取精灵列表
getPokemonList(params)
// @param params = { current?, size?, type?, name? }
// @return PageData<Pokemon>

// 获取精灵详情 (聚合数据)
getPokemonDetail(id)
// @return PokemonDetailVO
```

**Pokemon对象结构**:
```javascript
{
  id: number,          // 数据库ID
  number: number,      // 图鉴编号
  name: string,        // 精灵名称
  type1: string,       // 主属性
  type2?: string,      // 副属性 (可选)
  height: number,      // 身高 (m)
  weight: number,      // 体重 (kg)
  description: string, // 背景描述
  imageUrl: string     // 图片路径
}
```

**PokemonDetailVO结构**:
```javascript
{
  ...Pokemon,
  radarData: [hp, atk, def, matk, mdef, speed],  // 6维属性
  skills: [SkillVO],                              // 可学技能
  suggestion: string                              // 养成建议
}
```

**SkillVO结构**:
```javascript
{
  id: number,
  name: string,
  type: string,        // 技能属性
  category: string,    // 物理/魔法/变化
  power: number,       // 威力
  pp: number,          // 使用次数
  effect: string,      // 效果描述
  requireLevel: number // 学习等级
}
```

#### 3. **背包管理模块** (`/api/backpack/*`)

```javascript
// 获取用户背包列表
getUserBackpack(params)
// @param params = { current?, size?, type?, name? }
// @return PageData<Pokemon>

// 添加精灵到背包
addToBackpack(pokemonId)
// @return success message

// 从背包移除精灵
removeFromBackpack(pokemonId)
// @return success message

// 检查精灵是否已拥有
checkIfOwned(pokemonId)
// @return boolean
```

**PageData<T>结构**:
```javascript
{
  records: T[],     // 数据记录数组
  total: number,    // 总记录数
  size: number,     // 每页数量
  current: number   // 当前页码
}
```

---

## 🧩 组件架构

### Vue 3 组件设计

#### 1. **HeaderContainer.js** - 顶部导航容器
**路径**: `js/components/header/HeaderContainer.js`

**功能**: 
- Logo跳转主页
- 登录/注册入口 & 模态框控制
- 已登录状态下显示用户面板

**Props**:
- 无props (仅与header组件通信)

**Events**:
- `@login-success`: 登录成功时触发

**主要方法**:
```javascript
initAuth()           // 初始化登录状态 (从localStorage)
handleAuthSuccess()  // 登录成功回调
onUserUpdate()       // 用户信息更新回调
```

**Template**:
```html
<div class="hud">
  <AuthModal :show="showModal" @close="" @success="" />
  <UserPanel v-if="isLoggedIn" :userInfo="userInfo" :avatarUrl="" />
  <a v-else class="log" @click="showModal = true">登录/注册</a>
</div>
```

#### 2. **AuthModal.js** - 认证模态框
**功能**: 登录/注册表单与模态框

**Props**:
- `show: boolean` - 显示/隐藏

**Events**:
- `@close` - 关闭模态框
- `@success` - 认证成功

**State**:
```javascript
data() {
  return {
    isLogin: true,     // 登录/注册切换标志
    form: {
      username: '',
      password: '',
      email: ''        // 仅注册时显示
    },
    isLoading: false,  // 提交状态
    errorMsg: ''       // 错误信息
  }
}
```

#### 3. **UserPanel.js** - 用户面板
**功能**: 显示头像、用户信息、菜单选项

**Props**:
- `userInfo: User`
- `avatarUrl: string`

**Events**:
- `@update` - 用户信息更新

**交互**:
- 点击头像展开/折叠菜单
- 显示用户名、邮箱
- 个人资料编辑、头像上传、退出登录

---

### Vue应用配置示例

#### index.html中的Vue应用
```javascript
const app = Vue.createApp({
  data() {
    return {
      types: ['水', '火', '草', ...],
      allPets: [],
      backpackPets: [],
      filter: { name: '', type: '', current: 1, size: 100 },
      isLoggedIn: false
    }
  },
  
  async created() {
    const token = localStorage.getItem("token");
    if (token) {
      const userInfo = await getCurrentUserInfo();
      this.isLoggedIn = true;
    }
    await this.fetchList();
  },
  
  methods: {
    async fetchList() {
      const data = await getPokemonList(this.filter);
      this.allPets = data.records;
    },
    
    async handleAddToBackpack(pet) {
      pet.isAdding = true;
      const res = await addToBackpack(pet.id);
      if (res) {
        pet.isOwned = true;
        this.$emit('pet-added');
      }
      pet.isAdding = false;
    }
  }
})

// 注册全局组件
app.component('common-header', CommonHeader);

// 挂载到DOM
app.mount('#app');
```

---

## 🎨 样式系统

### CSS架构与设计理念

#### 1. **全局设计系统**

| 属性 | 值 | 用途 |
|------|-----|------|
| **主色** | #3498db (蓝色) | 主操作按钮、链接 |
| **背景** | #f0f2f5 (浅灰) | 页面背景 |
| **边框** | #e0e0e0 | 卡片边界 |
| **强调** | #d9f29a (黄绿) | 背包区域、导航背景 |
| **危险** | #e74c3c (红色) | 删除、清空操作 |
| **成功** | #27ae60 (绿色) | 确认、完成状态 |

#### 2. **响应式断点**
```css
/* 移动端优先 */
@media (max-width: 768px) { /* 平板 */ }
@media (max-width: 480px) { /* 手机 */ }
```

#### 3. **动画与过渡**

**列表过渡** (`home.css`):
```css
.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
```

**按钮悬停效果**:
```css
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
```

**模态框毛玻璃效果** (`auth-modal.css`):
```css
.modal {
  backdrop-filter: blur(8px);
  background: rgba(15, 23, 42, 0.4);
}
```

#### 4. **样式文件功能划分**

| 文件 | 覆盖范围 |
|------|---------|
| `header-styles.css` | 顶部导航、Logo、用户菜单 |
| `auth-modal.css` | 登录/注册模态框、输入框 |
| `user-panel.css` | 用户头像、下拉菜单、个人资料编辑 |
| `home.css` | 主页布局、卡片网格、搜索栏 |
| `detail.css` | 详情页、信息卡片、属性栏 |
| `my-collection.css` | 收藏页、英雄区、卡片网格 |

#### 5. **关键CSS类名约定**

```css
/* 布局 */
.container    /* 内容容器 */
.main         /* 主内容区 */
.hud          /* 顶部固定导航 */

/* 卡片与容器 */
.modal        /* 模态框背景 */
.modal-content /* 模态框内容 */
.info-card    /* 信息卡片 */
.pet-card     /* 精灵卡片 */

/* 按钮 */
.btn-search   /* 查询按钮 */
.btn-clear    /* 清空按钮 */
.btn-add      /* 添加按钮 */
.btn-primary  /* 主按钮 */

/* 状态 */
.is-owned     /* 已拥有精灵 */
.is-confirming /* 确认中 */
.active       /* 激活/选中 */

/* 表格 */
.stat-bars    /* 属性栏容器 */
.bar-fill     /* 进度条填充 */
```

---

## 🔧 工具函数与Hook

### 1. **usePetData.js** - 数据获取Hook

```javascript
export function usePetData() {
  const fetchPetDetail = async () => {
    // 1. 从URL提取宠物ID
    const id = getPetIdFromUrl();
    if (!id) throw new Error('未在 URL 中找到宠物 ID');
    
    // 2. 调用API获取详情
    const res = await getPokemonDetail(id);
    if (res.code === 200) {
      return res.data;  // 返回PokemonDetailVO
    } else {
      throw new Error(res.message || '获取数据失败');
    }
  };
  
  return { fetchPetDetail };
}
```

**使用示例**:
```javascript
import { usePetData } from './hooks/usePetData.js';

export default {
  async created() {
    try {
      const { fetchPetDetail } = usePetData();
      this.pet = await fetchPetDetail();
    } catch (err) {
      this.error = err.message;
    }
  }
}
```

### 2. **usePetLogic.js** - 业务逻辑Hook

```javascript
export function usePetLogic() {
  // 性格推荐算法
  const getRecommendedNature = (radarData) => {
    const [hp, atk, def, matk, mdef, speed] = radarData;
    if (atk > matk + 20) {
      return speed > 100 ? "固执、开朗" : "固执、勇敢";
    } else if (matk > atk + 20) {
      return speed > 100 ? "保守、胆小" : "保守、冷静";
    }
    return "平衡性格 (如：认真)";
  };
  
  // 角色定位
  const getPetRole = (radarData) => {
    const [hp, atk, def, matk, mdef, speed] = radarData;
    if (speed >= 120) return "高速输出/控制型";
    if (hp >= 120 && (def >= 110 || mdef >= 110)) return "肉盾防御型";
    if (atk > 130 || matk > 130) return "强力爆发型";
    return "均衡成长型";
  };
  
  // 文字建议
  const getDynamicAdvice = (radarData) => {
    let advice = `该宠物最高种族值为 ${Math.max(...radarData)}。`;
    advice += atk > matk ? "建议重点加强物攻。" : "建议重点加强魔攻。";
    return advice;
  };
  
  return { getRecommendedNature, getPetRole, getDynamicAdvice };
}
```

### 3. **urlHelper.js** - URL工具

```javascript
// 从?id=123中提取ID参数
export const getPetIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};
```

### 4. **request.js** - HTTP客户端

**功能**:
- 自动token注入
- 统一错误处理
- 超时控制 (10秒)

**拦截器**:
```javascript
// 请求拦截器
service.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
service.interceptors.response.use(
  (response) => response.data,  // 直接返回data
  (error) => {
    console.error("请求错误:", error.message);
    return Promise.reject(error);
  }
);
```

### 5. **chartHelper.js** - 图表工具

```javascript
// 初始化雷达图配置
export const initRadarChart = (pet, chartRef) => {
  const radarOption = {
    tooltip: { trigger: 'item' },
    legend: { data: [pet.name] },
    radar: {
      indicator: [
        { name: '精力', max: 150 },
        { name: '攻击', max: 150 },
        { name: '防御', max: 150 },
        { name: '魔攻', max: 150 },
        { name: '魔抗', max: 150 },
        { name: '速度', max: 150 }
      ]
    },
    series: [{
      data: [{ value: pet.radarData, name: pet.name }],
      type: 'radar',
      itemStyle: { color: '#3498db' },
      areaStyle: { color: 'rgba(52, 152, 219, 0.3)' }
    }]
  };
  
  chartRef.setOption(radarOption);
};
```

### 6. **petChartController.js** - 宠物图表控制器

```javascript
// 控制基础/养成图表切换、数据更新等
export class PetChartController {
  constructor(chartInstance) {
    this.chart = chartInstance;
  }
  
  updateRadarData(newRadarData) {
    this.chart.setOption({
      series: [{ data: [{ value: newRadarData }] }]
    });
  }
}
```

---

## ⚙️ 配置说明

### 1. **js/config.js**

```javascript
export const CONFIG = {
  // 后端API地址
  // 开发: 'http://localhost:8080'
  // 生产: 'https://api.example.com' 或 ''(相对路径)
  BASE_URL: '',
  
  // 请求超时时间 (毫秒)
  TIMEOUT: 10000
};

// 图片URL格式化工具
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${CONFIG.BASE_URL}${url}`;
};
```

### 2. **vite.config.js**

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      // 多入口配置 - 支持多页面应用
      input: {
        main: resolve(__dirname, "index.html"),
        compare: resolve(__dirname, "compare.html"),
        details: resolve(__dirname, "details.html"),
        // ... 其他页面
      }
    }
  },
  base: "./",  // 相对路径基础URL
  plugins: [
    // 静态资源复制 - 构建时复制img文件夹到dist
    viteStaticCopy({
      targets: [{
        src: "img",
        dest: "./"
      }]
    })
  ]
});
```

### 3. **localStorage 键名约定**

| 键名 | 值类型 | 说明 |
|------|--------|------|
| `token` | string | JWT认证令牌 |
| `userInfo` | JSON | 用户信息对象 |
| `filter_history` | JSON | 搜索筛选历史 (可选) |

**示例**:
```javascript
// 存储
localStorage.setItem('token', jwtToken);
localStorage.setItem('userInfo', JSON.stringify(user));

// 读取
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('userInfo'));

// 清除 (登出)
localStorage.removeItem('token');
localStorage.removeItem('userInfo');
```

---

## 🚀 开发与部署

### 1. **本地开发环境**

#### 环境要求
- Node.js 14.0+ (推荐 16.0+)
- npm 6.0+ 或 yarn

#### 初始化项目
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器 (自动热更新)
npm run dev

# 默认访问: http://localhost:5173
```

#### 开发工作流
```bash
# 1. 修改源文件 (自动刷新浏览器)
# 2. 调试代码 (F12打开开发者工具)
# 3. 提交变更到版本控制
```

### 2. **构建与打包**

```bash
# 生成优化的生产构建
npm run build

# 输出目录: frontend/dist/
# 包含所有HTML、CSS、JS和img文件夹

# 预览生产构建
npm run preview
```

### 3. **部署指南**

#### 部署方案 A: 静态托管 (推荐)
```bash
# 1. 执行生产构建
npm run build

# 2. 上传dist文件夹到Web服务器
#    (Nginx、Apache、云存储等)

# 3. 配置服务器
#    - 设置root目录为dist
#    - 配置SPA重定向 (404 -> index.html)
```

#### Nginx配置示例
```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/locke-frontend/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # 配置API反向代理
  location /api/ {
    proxy_pass http://backend-server:8080;
    proxy_set_header Authorization $http_authorization;
  }
  
  # 缓存静态资源
  location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
```

#### 部署方案 B: Docker容器化
```dockerfile
# Dockerfile
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. **环境配置管理**

**多环境支持**:
```javascript
// js/config.js - 根据环境变量调整
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

export const CONFIG = {
  BASE_URL: isDev 
    ? 'http://localhost:8080'
    : 'https://api.example.com',
  TIMEOUT: 10000
};
```

**Vite环境文件** (.env):
```
# .env.development
VITE_API_URL=http://localhost:8080

# .env.production
VITE_API_URL=https://api.example.com
```

### 5. **常见问题与调试**

#### 问题1: CORS跨域错误
**症状**: `Access to XMLHttpRequest blocked by CORS policy`

**解决方案**:
- 后端配置CORS响应头
- 或使用代理模式 (vite.config.js)

```javascript
// vite.config.js - 开发环境代理
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

#### 问题2: 图片加载失败
**检查**:
```javascript
// 确认图片URL格式正确
const imageUrl = getImageUrl(pet.imageUrl);
console.log('Image URL:', imageUrl);

// 在Network标签查看请求状态
// 确保img文件夹正确复制到dist目录
```

#### 问题3: 组件未正确注册
**调试**:
```javascript
// 检查组件是否正确导入和注册
console.log('Components:', app._component.components);
app.component('debug', ComponentName);
```

### 6. **性能优化建议**

#### 代码分割
```javascript
// 动态导入大型组件
const DetailView = () => import('./views/DetailView.js');
```

#### 资源优化
- 图片压缩与格式优化 (WebP)
- CSS/JS压缩与minify
- 移除未使用的CSS (PurgeCSS)

#### 缓存策略
```javascript
// 长期缓存不变的资源
const cacheVersion = '1.0.0';
const resourceUrl = `img/logo.png?v=${cacheVersion}`;
```

---

## 📚 开发规范

### 1. **命名约定**

**JavaScript**:
- 变量/函数: `camelCase` (fetchPetList)
- 类/组件: `PascalCase` (HeaderContainer)
- 常量: `UPPER_SNAKE_CASE` (MAX_RETRY_TIMES)

**CSS**:
- 类名: `kebab-case` (user-avatar)
- BEM命名法: `.block__element--modifier`

**HTML**:
- id属性: `kebab-case` (pet-card, modal-content)

### 2. **代码注释**

```javascript
/**
 * 函数描述
 * @param {类型} paramName - 参数描述
 * @returns {类型} 返回值描述
 * @example
 * const result = myFunction(value);
 */
export function myFunction(paramName) {
  // 实现代码
}
```

### 3. **错误处理**

```javascript
// ✅ 推荐
try {
  const data = await fetchData();
  return processData(data);
} catch (error) {
  console.error('操作失败:', error);
  alert('请求出错，请重试');
  return null;
}

// ❌ 避免
fetch(url).then(res => res.json())  // 未处理错误
```

### 4. **异步操作**

```javascript
// ✅ 推荐使用async/await
async function loadData() {
  const data = await getPokemonList();
  this.pets = data;
}

// 或Promise链 (如果需要)
getPokemonList()
  .then(data => this.pets = data)
  .catch(err => console.error(err));
```

---

## 📞 支持与联系

如有问题或建议，请：
1. 提交Issue到GitHub仓库
2. 联系团队开发成员
3. 查看项目文档和贡献指南

---

**文档最后更新**: 2026年5月4日
**前端版本**: 1.0.0
**维护者**: Locke Project Team
