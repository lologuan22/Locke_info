// utils/request.js
export async function request(url, options) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      ...options
    });
    const res = await response.json();
    
    if (res.code === 401) {
      globalThis.location.href = "../login/";
    }
    return res;
  } catch (error) {
    console.error("请求异常", error);
    throw error;
  }
}
