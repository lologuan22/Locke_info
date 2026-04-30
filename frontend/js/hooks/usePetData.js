// js/hooks/usePetData.js
import { getPokemonDetail } from '../api/index.js';
import { getPetIdFromUrl } from '../utils/urlHelper.js';

export function usePetData() {
  const fetchPetDetail = async () => {
    const id = getPetIdFromUrl();
    if (!id) {
      throw new Error('未在 URL 中找到宠物 ID');
    }
    
    const res = await getPokemonDetail(id);
    if (res.code === 200 && res.data) {
      return res.data;
    } else {
      throw new Error(res.message || '获取数据失败');
    }
  };

  return { fetchPetDetail };
}