import requests
from config import settings
import os


def search_attractions(keywords: str, city: str) -> list:
    """搜索景点"""
    try:
        resp = requests.get("https://restapi.amap.com/v3/place/text", params={
            "keywords": keywords,
            "city": city,
            "key": settings.AMAP_API_KEY,
            "output": "json",
            "offset": 10,
            "citylimit": "true"
        }, timeout=10)
        data = resp.json()
        if data.get("status") == "1" and data.get("pois"):
            result = []
            for p in data["pois"][:6]:
                loc = p.get("location", "").split(",")
                result.append({
                    "name": p.get("name"),
                    "address": p.get("address"),
                    "longitude": float(loc[0]) if len(loc) == 2 else None,
                    "latitude": float(loc[1]) if len(loc) == 2 else None,
                })
            return result
        return []
    except Exception as e:
        print(f"搜索景点失败: {e}")
        return []


def get_weather(city: str) -> list:
    """查询天气"""
    try:
        resp = requests.get("https://restapi.amap.com/v3/weather/weatherInfo", params={
            "city": city,
            "key": settings.AMAP_API_KEY,
            "extensions": "all",
            "output": "json"
        }, timeout=10)
        data = resp.json()
        if data.get("status") == "1" and data.get("forecasts"):
            return data["forecasts"][0].get("casts", [])
        return []
    except Exception as e:
        print(f"查询天气失败: {e}")
        return []


def get_place_image(query: str) -> str:
    """获取景点图片"""
    try:
        resp = requests.get("https://api.unsplash.com/search/photos", params={
            "query": query,
            "per_page": 1,
            "client_id": settings.UNSPLASH_ACCESS_KEY
        }, timeout=10)
        data = resp.json()
        if data.get("results"):
            return data["results"][0]["urls"]["regular"]
        return ""
    except Exception as e:
        print(f"获取图片失败: {e}")
        return ""
def search_restaurants(city: str, cuisine: str = "特色美食") -> list:
    """搜索餐厅"""
    try:
        resp = requests.get("https://restapi.amap.com/v3/place/text", params={
            "keywords": cuisine,
            "city": city,
            "key": settings.AMAP_API_KEY,
            "output": "json",
            "offset": 10,
            "citylimit": "true",
            "types": "050000"
        }, timeout=10)
        data = resp.json()
        if data.get("status") == "1" and data.get("pois"):
            result = []
            for p in data["pois"][:6]:
                loc = p.get("location", "").split(",")
                result.append({
                    "name": p.get("name"),
                    "address": p.get("address"),
                    "longitude": float(loc[0]) if len(loc) == 2 else None,
                    "latitude": float(loc[1]) if len(loc) == 2 else None,
                })
            return result
        return []
    except Exception as e:
        print(f"搜索餐厅失败: {e}")
        return []


def search_hotels(city: str, hotel_type: str = "酒店") -> list:
    """搜索酒店"""
    try:
        resp = requests.get("https://restapi.amap.com/v3/place/text", params={
            "keywords": hotel_type,
            "city": city,
            "key": settings.AMAP_API_KEY,
            "output": "json",
            "offset": 10,
            "citylimit": "true",
            "types": "100000"
        }, timeout=10)
        data = resp.json()
        if data.get("status") == "1" and data.get("pois"):
            result = []
            for p in data["pois"][:6]:
                loc = p.get("location", "").split(",")
                biz_ext = p.get("biz_ext", {})
                result.append({
                    "name": p.get("name", ""),
                    "address": p.get("address", ""),
                    "longitude": float(loc[0]) if len(loc) == 2 else None,
                    "latitude": float(loc[1]) if len(loc) == 2 else None,
                    "cost": biz_ext.get("cost", "") if isinstance(biz_ext, dict) else "",
                    "rating": biz_ext.get("rating", "") if isinstance(biz_ext, dict) else "",
                })
            return result
        return []
    except Exception as e:
        print(f"搜索酒店失败: {e}")
        return []


def search_shopping(city: str) -> list:
    """搜索购物地点"""
    try:
        resp = requests.get("https://restapi.amap.com/v3/place/text", params={
            "keywords": "购物中心",
            "city": city,
            "key": settings.AMAP_API_KEY,
            "output": "json",
            "offset": 10,
            "citylimit": "true",
            "types": "060000"
        }, timeout=10)
        data = resp.json()
        if data.get("status") == "1" and data.get("pois"):
            result = []
            for p in data["pois"][:6]:
                loc = p.get("location", "").split(",")
                result.append({
                    "name": p.get("name"),
                    "address": p.get("address"),
                    "longitude": float(loc[0]) if len(loc) == 2 else None,
                    "latitude": float(loc[1]) if len(loc) == 2 else None,
                })
            return result
        return []
    except Exception as e:
        print(f"搜索购物失败: {e}")
        return []


def plan_route(origin: str, destination: str, city: str) -> dict:
    """规划路线"""
    try:
        resp = requests.get("https://restapi.amap.com/v3/direction/transit/integrated", params={
            "origin": origin,
            "destination": destination,
            "city": city,
            "key": settings.AMAP_API_KEY,
            "output": "json"
        }, timeout=10)
        data = resp.json()
        if data.get("status") == "1":
            return data.get("route", {})
        return {}
    except Exception as e:
        print(f"路线规划失败: {e}")
        return {}
def get_place_detail(name: str, city: str) -> dict:
    """用高德搜索景点真实地址"""
    try:
        resp = requests.get("https://restapi.amap.com/v3/place/text", params={
            "keywords": name,
            "city": city,
            "key": settings.AMAP_API_KEY,
            "output": "json",
            "offset": 1,
            "citylimit": "true"
        }, timeout=10)
        data = resp.json()
        if data.get("status") == "1" and data.get("pois"):
            p = data["pois"][0]
            loc = p.get("location", "").split(",")
            return {
                "address": p.get("address", ""),
                "longitude": float(loc[0]) if len(loc) == 2 else None,
                "latitude": float(loc[1]) if len(loc) == 2 else None,
            }
        return {}
    except Exception as e:
        print(f"搜索地址失败: {e}")
        return {}
def search_nearby_restaurants(longitude: float, latitude: float, keywords: str = "餐厅") -> dict:
    """用高德周边搜索找附近餐厅"""
    try:
        resp = requests.get("https://restapi.amap.com/v3/place/around", params={
            "location": f"{longitude},{latitude}",
            "keywords": keywords,
            "radius": 3000,
            "key": settings.AMAP_API_KEY,
            "output": "json",
            "offset": 5,
            "types": "050000"
        }, timeout=10)
        data = resp.json()
        if data.get("status") == "1" and data.get("pois"):
            p = data["pois"][0]
            loc = p.get("location", "").split(",")
            return {
                "name": p.get("name", ""),
                "address": p.get("address", ""),
                "longitude": float(loc[0]) if len(loc) == 2 else longitude,
                "latitude": float(loc[1]) if len(loc) == 2 else latitude,
            }
        return {}
    except Exception as e:
        print(f"周边搜索失败: {e}")
        return {} 
    
def get_city_attractions(city: str, keywords: str = "热门景点旅游") -> list:
    """获取城市热门景点（真实坐标）"""
    try:
        resp = requests.get("https://restapi.amap.com/v3/place/text", params={
            "keywords": keywords,
            "city": city,
            "key": settings.AMAP_API_KEY,
            "sortrule": "weight",
            "offset": 8,
            "citylimit": "true",
            "output": "json"
        }, timeout=10)
        data = resp.json()
        if data.get("status") == "1" and data.get("pois"):
            result = []
            for p in data["pois"]:
                loc = p.get("location", "").split(",")
                biz_ext = p.get("biz_ext", {})
                result.append({
                    "name": p.get("name", ""),
                    "address": p.get("address", ""),
                    "longitude": float(loc[0]) if len(loc) == 2 else None,
                    "latitude": float(loc[1]) if len(loc) == 2 else None,
                    "type": p.get("type", ""),
                    "cost": biz_ext.get("cost", "") if isinstance(biz_ext, dict) else "",
                    "rating": biz_ext.get("rating", "") if isinstance(biz_ext, dict) else "",
                })
            return result
        return []
    except Exception as e:
        print(f"获取城市景点失败: {e}")
        return []


def get_city_restaurants(city: str, longitude: float = None, latitude: float = None) -> list:
    """获取城市热门餐厅（真实坐标）"""
    try:
        params = {
            "keywords": "特色餐厅美食",
            "city": city,
            "key": settings.AMAP_API_KEY,
            "sortrule": "weight",
            "offset": 8,
            "citylimit": "true",
            "output": "json",
            "types": "050000"
        }
        # 如果有坐标就用周边搜索
        if longitude and latitude:
            resp = requests.get("https://restapi.amap.com/v3/place/around", params={
                **params,
                "location": f"{longitude},{latitude}",
                "radius": 5000,
            }, timeout=10)
        else:
            resp = requests.get("https://restapi.amap.com/v3/place/text", params=params, timeout=10)
        
        data = resp.json()
        if data.get("status") == "1" and data.get("pois"):
            result = []
            for p in data["pois"]:
                loc = p.get("location", "").split(",")
                biz_ext = p.get("biz_ext", {})
                result.append({
                    "name": p.get("name", ""),
                    "address": p.get("address", ""),
                    "longitude": float(loc[0]) if len(loc) == 2 else None,
                    "latitude": float(loc[1]) if len(loc) == 2 else None,
                    "cost": biz_ext.get("cost", "") if isinstance(biz_ext, dict) else "",
                    "rating": biz_ext.get("rating", "") if isinstance(biz_ext, dict) else "",
                })
            return result
        return []
    except Exception as e:
        print(f"获取城市餐厅失败: {e}")
        return []
    


# 城市到省份的映射
CITY_TO_PROVINCE = {
    "北京": "北京",
    "上海": "上海",
    "重庆": "重庆",
    "成都": "四川", "四川": "四川",
    "杭州": "浙江", "宁波": "浙江", "浙江": "浙江",
    "西安": "陕西", "陕西": "陕西",
    "南京": "江苏", "苏州": "江苏", "无锡": "江苏", "江苏": "江苏",
    "武汉": "湖北", "湖北": "湖北",
    "广州": "广东", "深圳": "广东", "珠海": "广东", "广东": "广东",
    "厦门": "福建", "福州": "福建", "福建": "福建",
    "青岛": "山东", "济南": "山东", "山东": "山东",
    "丽江": "云南", "大理": "云南", "昆明": "云南", "云南": "云南",
    "桂林": "广西", "南宁": "广西", "广西": "广西",
    "黄山": "安徽", "合肥": "安徽", "安徽": "安徽",
    "海南": "海南", "三亚": "海南", "海口": "海南",
    "张家界": "湖南", "长沙": "湖南", "湖南": "湖南",
}

def get_local_foods(city: str) -> list:
    """从知识库读取当地特色小吃"""
    try:
        # 找到对应省份
        province = CITY_TO_PROVINCE.get(city, city)
        
        # 读取文件
        file_path = os.path.join(
            os.path.dirname(__file__),
            "knowledge",
            f"{province}.txt"
        )
        
        if not os.path.exists(file_path):
            print(f"知识库中没有{province}的数据")
            return []
        
        foods = []
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                parts = line.split("|")
                if len(parts) >= 3:
                    foods.append({
                        "name": parts[0],
                        "description": parts[1],
                        "price": parts[2],
                        "emoji": "🍽"
                    })
        return foods
    except Exception as e:
        print(f"读取知识库失败: {e}")
        return []
           
def search_knowledge_base(query: str) -> str:
    """RAG知识库查询（第三阶段实现，暂时返回空）"""
    return ""