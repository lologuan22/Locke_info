// js/hooks/usePetLogic.js
export function usePetLogic() {
  // 性格建议逻辑
  const getRecommendedNature = (radarData) => {
    if (!radarData || radarData.length < 6) return "均衡发展";
    const [hp, atk, def, matk, mdef, speed] = radarData;
    if (atk > matk + 20) return speed > 100 ? "固执、开朗" : "固执、勇敢";
    if (matk > atk + 20) return speed > 100 ? "保守、胆小" : "保守、冷静";
    return "平衡性格 (如：认真)";
  };

  // 定位分析逻辑
  const getPetRole = (radarData) => {
    if (!radarData || radarData.length < 6) return "未知";
    const [hp, atk, def, matk, mdef, speed] = radarData;
    if (speed >= 120) return "高速输出/控制型";
    if (hp >= 120 && (def >= 110 || mdef >= 110)) return "肉盾防御型";
    if (atk > 130 || matk > 130) return "强力爆发型";
    return "均衡成长型";
  };

  // 文字描述逻辑
  const getDynamicAdvice = (radarData) => {
    if (!radarData || radarData.length < 6) return "数据分析中...";
    const [hp, atk, def, matk, mdef, speed] = radarData;
    let advice = `该宠物最高种族值为 ${Math.max(...radarData)}。`;
    advice += atk > matk ? "建议重点加强物攻。" : "建议重点加强魔攻。";
    advice += speed < 80 ? " 建议提升生存。" : " 速度优势明显。";
    return advice;
  };

  return { getRecommendedNature, getPetRole, getDynamicAdvice };
}