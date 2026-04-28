// js/utils/petChartController.js
import { getRadarOption } from './chartHelper.js';

export class PetChartController {
  constructor() {
    this.instance = null;
  }

  // 初始化或更新图表
  render(dom, radarData) {
    if (!dom) return;
    
    // 1. 销毁旧实例防止内存泄漏
    if (this.instance) {
      this.instance.dispose();
    }

    // 2. 初始化
    this.instance = echarts.init(dom);
    
    // 3. 准备数据
    const rawData = Array.isArray(radarData) ? radarData : Object.values(radarData);
    const option = getRadarOption(rawData);
    
    // 4. 渲染
    this.instance.setOption(option);
  }

  // 响应窗口大小变化
  resize() {
    this.instance?.resize();
  }
}