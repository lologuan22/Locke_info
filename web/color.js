// 移除重复的 BASE_URL
// 移除重复的 import

function getBgColor(type) {
  const colorMap = {
    '水': '#81A0B3', '火': '#934548', '草': '#6CB799', '翼': '#f8f8d1',
    '电': '#250930', '冰': '#e6f7ff', '武': '#ffead1', '光': '#F4E6BD',
    '土': '#7a4a27', '虫': '#5a5923', '龙': '#da2828', '幽灵': '#703b7e',
    '恶魔': '#48195c', '毒': '#8f218f', '石': '#502525'
  };
  return colorMap[type] || '#fff';
}

function renderList(list, ownedIds = []) {
  const container = document.getElementById('display-list');
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<p>暂无数据</p>';
    return;
  }
  container.innerHTML = list.map(item => `
  <div class="card" style="background:${getBgColor(item.type1)}">
    <div class="img-placeholder" onclick="showDetail(${item.id})">
      <img src="http://172.17.79.7:8080${item.imageUrl || ''}" alt="${item.name}">
    </div>
    <strong>${item.name}</strong>
    ${!ownedIds.includes(item.id) ? `<div class="add-btn" onclick="addToMyBag(${item.id},event)">+</div>` : ''}
  </div>
  `).join('');
}

function renderBackpack(list) {
  const container = document.getElementById('backpack-list');
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<p>收藏夹里还没有这类精灵</p>';
    return;
  }
  container.innerHTML = list.map(item => `
  <div class="card" style="background:${getBgColor(item.type1)}">
    <div class="img-placeholder" onclick="showDetail(${item.id})">
      <img src="http://172.17.79.7:8080${item.imageUrl || ''}" alt="${item.name}">
    </div>
    <strong>${item.name}</strong>
    <div class="del-btn" onclick="removeFromMyBag(${item.id},event)">−</div>
  </div>
  `).join('');
}

window.loadList = async function () {
  const container = document.getElementById('display-list');
  if (!container) return;
  const name = document.getElementById('nameSearch')?.value.trim() || '';
  const type = document.getElementById('typeSearch')?.value || '';

  try {
    const res = await api.getPokemonList({
      current: 1, size: 1000, name: name || undefined, type: type || undefined
    });
    const list = res.data?.records || [];
    let ownedIds = [];
    if (localStorage.getItem('token')) {
      try {
        const bRes = await api.getUserBackpack({ current: 1, size: 100 });
        ownedIds = (bRes.data?.records || []).map(x => x.id);
      } catch (e) { }
    }
    renderList(list, ownedIds);
  } catch (err) {
    console.error(err);
  }
};

window.loadBackpack = async function () {
  const container = document.getElementById('backpack-list');
  if (!container) return;
  const token = localStorage.getItem('token');
  if (!token) {
    container.innerHTML = '<p>请先登录查看收藏</p>';
    return;
  }
  const name = document.getElementById('backpackNameSearch')?.value.trim() || '';
  const type = document.getElementById('backpackTypeSearch')?.value || '';

  try {
    const res = await api.getUserBackpack({ current: 1, size: 100 });
    let list = res.data?.records || [];
    if (name) list = list.filter(i => i.name.includes(name));
    if (type) list = list.filter(i => i.type1 === type);
    renderBackpack(list);
  } catch (err) {
    console.error(err);
  }
};

<<<<<<< HEAD
window.addToMyBag = async function (id, e) {
  e.stopPropagation();
  try {
    await api.addToBackpack(id);
=======
// 添加收藏（无任何提示，仅未登录弹窗）
window.addToMyBag = async function (id, e) {
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录再添加收藏！");
        if (window.openModal) {
            window.openModal();
        }
        return;
    }

    try {
        await api.addToBackpack(id);
    } catch (err) {
        console.error(err);
    }

>>>>>>> 0448bd7 (修复)
    await Promise.all([loadList(), loadBackpack()]);
  } catch (err) {
    alert("加入背包失败，请登录");
  }
};

<<<<<<< HEAD
window.removeFromMyBag = async function (id, e) {
  e.stopPropagation();
  try {
    await api.removeFromBackpack(id);
=======
// 删除收藏（无提示）
window.removeFromMyBag = async function (id, e) {
    e.stopPropagation();
    try {
        await api.removeFromBackpack(id);
    } catch (err) {
        console.error(err);
    }
>>>>>>> 0448bd7 (修复)
    await Promise.all([loadList(), loadBackpack()]);
  } catch (err) {
    alert("移除失败");
  }
};

<<<<<<< HEAD
window.clearBackpack = async function () {
  if (!confirm('确定清空所有收藏？')) return;
  try {
    const res = await api.getUserBackpack({ current: 1, size: 100 });
    const list = res.data?.records || [];
    for (let item of list) await api.removeFromBackpack(item.id);
    await Promise.all([loadList(), loadBackpack()]);
    alert('✅ 已清空');
  } catch (err) {
    alert("清空失败");
  }
=======
// 清空收藏（仅保留确认框，无成功提示）
window.clearBackpack = async function () {
    if (!confirm('确定清空所有收藏？')) return;
    try {
        const res = await api.getUserBackpack({ current: 1, size: 100 });
        const list = res.data?.records || [];
        for (let item of list) {
            await api.removeFromBackpack(item.id);
        }
    } catch (e) {
        console.error(e);
    }
    await Promise.all([loadList(), loadBackpack()]);
>>>>>>> 0448bd7 (修复)
};

window.showDetail = (id) => location.href = `details.html?id=${id}`;

setTimeout(() => {
  loadList();
  loadBackpack();
}, 200);