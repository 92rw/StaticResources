let fetch;

// 在函数的开始部分或其他适当的地方
import('node-fetch').then(module => {
  fetch = module.default;
});


module.exports = async (req, res) => {
  const visitorIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const locationResponse = await fetch(`http://ip-api.com/json/${visitorIp}?fields=24785&lang=zh-CN`);
    const locationData = await locationResponse.json();
    
    // 根据 locationData 处理你的业务逻辑，然后返回相应的数据
    res.json(locationData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location data.' });
  }
};
