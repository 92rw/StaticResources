const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const visitorIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const locationResponse = await fetch(`http://ip-api.com/json/${visitorIp}?fields=24785&lang=zh-CN`);
    const locationData = await locationResponse.json();
    
    // 根据 locationData 处理你的业务逻辑，然后返回相应的数据
    res.json(locationData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location data.' });
  }
};