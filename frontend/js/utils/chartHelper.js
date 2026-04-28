// js/utils/chartHelper.js
export const getRadarOption = (rawData) => {
  return {
    title: { text: '种族值雷达图', left: 'center' },
    tooltip: { trigger: 'item' },
    radar: {
      indicator: [
        { name: '精力', max: 200 },
        { name: '攻击', max: 200 },
        { name: '防御', max: 200 },
        { name: '魔攻', max: 200 },
        { name: '魔抗', max: 200 },
        { name: '速度', max: 200 }
      ],
      radius: '60%'
    },
    series: [{
      type: 'radar',
      data: [{
        value: rawData,
        name: '当前宠物',
        areaStyle: { color: 'rgba(24, 144, 255, 0.4)' },
        lineStyle: { color: '#1890ff' }
      }]
    }]
  };
};