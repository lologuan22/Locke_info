/**
 * 获取当前 URL 中的宠物 ID
 * @returns {string|null}
 */
export const getPetIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};