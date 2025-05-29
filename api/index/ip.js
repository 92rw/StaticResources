const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 计算距离的函数
function getDistance(e, t, n, o) {
  const { sin: a, cos: s, asin: i, PI: c, hypot: l } = Math;
  let r = (e, t) => (
      (e *= c / 180),
      {
        x: s((t *= c / 180)) * s(e),
        y: s(t) * a(e),
        z: a(t),
      }
    ),
    d = r(e, t),
    u = r(n, o),
    b = 2 * i(l(d.x - u.x, d.y - u.y, d.z - u.z) / 2) * 6371;
  return Math.round(b);
}

function setResponse(country, regionName, city, lat, lon) {
  // 根据返回值进行运算
  let distance = getDistance(139.66918, 35.84765, lon, lat);

  let location =
    country == city ? city : country + " " + regionName + " " + city;

  let posdesc;
  switch (country) {
    case "日本":
      posdesc = "よろしく，一起去看樱花吗";
      break;
    case "美国":
      posdesc = "Let us live in peace!";
      break;
    case "英国":
      posdesc = "想同你一起夜乘伦敦眼";
      break;
    case "俄罗斯":
      posdesc = "干了这瓶伏特加！";
      break;
    case "法国":
      posdesc = "C'est La Vie";
      break;
    case "德国":
      posdesc = "Die Zeit verging im Fluge.";
      break;
    case "澳大利亚":
      posdesc = "一起去大堡礁吧！";
      break;
    case "加拿大":
      posdesc = "拾起一片枫叶赠予你";
      break;
    case "中国":
      posdesc = "世界那么大，我想去看看";
      break;
    default:
      posdesc = "带我去你的国家逛逛吧。";
      break;
  }
  return [distance, location, posdesc];
}

module.exports = async (req, res) => {
  const visitorIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // 设置CORS头
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const locationResponse = await fetch(
      `http://ip-api.com/json/${visitorIp}?fields=549081&lang=zh-CN`
    );
    const locationData = await locationResponse.json();

    // 提取一些字段
    const { country, regionName, city, lat, lon } = locationData;

    const [distance, location, posdesc] = setResponse(
      country,
      regionName,
      city,
      lat,
      lon
    );

    const result = {
      ...locationData, // 保留原始的全部字段，再追加你自定义的字段
      location,
      posdesc,
      distance,
    };

    // 返回相应的数据
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch location data with ip: " + visitorIp });
  }
};
