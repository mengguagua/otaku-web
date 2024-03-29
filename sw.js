// self 就是 window对象
self.addEventListener('install', (event) => {
  // 调用 ExtendableEvent.waitUntil() 方法，确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
  event.waitUntil(
    addResourcesToCache([
      './',
    ])
  );
});

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  console.log("Service worker activated");
  event.waitUntil(enableNavigationPreload());
});

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});

// todo 增加indexedDB的话，可加逻辑读前端数据库；当前是缓存优先，get请求的数据就不会改变了，需要增加缓存刷新
// 判断缓存中是否存在，不存在则请求后台获取，并判断是否是get请求，是则加入缓存。
const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    // console.log('从缓存返回', responseFromCache)
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  if (request.method === 'GET') {
    // Response.clone() // 响应可能会被使用, 需要将它的拷贝放入缓存 api说明：https://developer.mozilla.org/zh-CN/docs/Web/API/Response/clone
    // 不用await等待添加缓存完成，可以直接先返回。
    putInCache(request, responseFromNetwork.clone());
  }
  // console.log('从接口返回', responseFromNetwork)
  return responseFromNetwork;
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  // cache.put不支持post会报错。如果想缓存查询接口数据，要改成GET请求。cache缓存大小，默认不限制，取决于浏览器默认值
  await cache.put(request, response);
};
