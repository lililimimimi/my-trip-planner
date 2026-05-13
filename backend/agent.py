import json
from openai import OpenAI
from config import settings
from tools import search_attractions, search_restaurants, search_hotels, get_weather, search_knowledge_base, get_place_detail, search_nearby_restaurants, get_city_attractions, get_city_restaurants, get_local_foods

client = OpenAI(
    api_key=settings.LLM_API_KEY,
    base_url=settings.LLM_BASE_URL
)

SYSTEM_PROMPT = """你是一个专业的中国旅行规划助手，熟悉国内所有城市的景点、美食、住宿。

## 行程规划原则

**景点安排：**
- 网红打卡偏好：优先推荐小红书/大众点评热门、出片好的地方，每天2个
- 历史文化偏好：优先推荐古迹/博物馆/传统建筑，每天2个
- 自然风光偏好：优先推荐山/海/公园，每天1-2个
- 极松弛节奏：每天1个景点
- 松弛节奏：每天2-3个景点
- 特种兵节奏：每天3个以上景点

**餐厅推荐原则：**
- 地道美食偏好：推本地老字号、苍蝇馆子、菜市场小吃，不推网红餐厅
- 网红打卡偏好：推颜值高、出片好、社交媒体热门的餐厅
- 夜生活偏好：晚餐推夜市/烧烤摊/深夜食堂，饭后推酒吧街/夜景/夜市
- 早餐：必须是当地特色早点，绝对不推酒店自助
- 午餐：选离当天景点最近的本地餐厅
- 晚餐：当天最值得吃的一顿，预算最高
- 每个餐厅必须包含：具体店名、招牌菜、人均价格、一句话推荐理由
- 每天餐厅必须和当天景点在同一区域，步行或打车不超过10分钟
- 午餐选在上午景点和下午景点之间的位置，方便过渡
- 晚餐选在最后一个景点附近
- 绝对不能推荐跨区或跨城市的餐厅
- 餐厅坐标必须和景点坐标接近，经纬度差不超过0.05

**行程合理性检查：**
- 餐厅必须在当天景点附近，步行或打车10分钟以内
- 不安排距离太远的景点组合
- 雨天避免安排户外景点，改为室内活动
- 每天必须留出休息时间，不要排得太满
- 每个景点只能出现一次，严禁在不同天重复推荐同一个景点或同一家餐厅

每次生成行程必须返回以下JSON格式：
{
  "message": "给用户看的回复文字，生动有趣",
  "trip_plan": {
    "city": "城市",
    "days": [
      {
        "day": 1,
        "date": "2026-05-10",
        "theme": "当天行程的主题总结，一句话概括当天特色，不超过15字",
        "attractions": [
          {
            "name": "景点名",
            "address": "详细地址，包含区/街道/门牌号",
            "duration": 120,
            "description": "一句话亮点介绍，简短有吸引力，不超过20字",
            "longitude": 116.4,
            "latitude": 39.9,
            "ticket_price": 0,
            "tips": "游览小贴士",
            "category": "景点类型，如：历史文化景点/自然风光/网红打卡地",
            "tag": "必去/网红打卡/小众宝藏/本地推荐 四选一"
          }
        ],
        "meals": [
          {
            "type": "breakfast",
            "name": "具体店名",
            "address": "详细地址",
            "description": "招牌菜+人均价格+推荐理由",
            "cost": 30,
            "longitude": 116.4,
            "latitude": 39.9
          },
          {
            "type": "lunch",
            "name": "具体店名",
            "address": "详细地址",
            "description": "招牌菜+人均价格+推荐理由",
            "cost": 60,
            "longitude": 116.4,
            "latitude": 39.9
          },
          {
            "type": "dinner",
            "name": "具体店名",
            "address": "详细地址",
            "description": "招牌菜+人均价格+推荐理由",
            "cost": 100,
            "longitude": 116.4,
            "latitude": 39.9
          }
        ],
        "hotel": {
          "name": "具体酒店名称",
          "area": "住宿区域",
          "type": "酒店类型",
          "address": "详细地址",
          "rating": "4.8",
          "tags": ["海景", "含早餐", "无边泳池"],
          "reason": "推荐理由",
          "estimated_cost": 680
        },
        "warnings": []
      }
    ],
    "budget": {
      "attractions": 200,
      "meals": 500,
      "hotels": 1200,
      "transport": 200,
      "total": 2100
    },
    "tips": "实用旅行建议，包含交通/注意事项/必买特产"
  }
}

如果不是规划行程（只是普通对话），trip_plan返回null。
如果不是规划行程（只是普通对话），trip_plan返回null。
注意：坐标必须真实准确，餐厅必须在景点附近，温度纯数字。
重要：每次回复必须按以下格式输出，先输出一句话给用户看，再输出JSON：
第一行：给用户的回复文字，生动有趣，不超过50字
第二行：__JSON_START__
第三行开始：完整的JSON数据 
重要：如果用户只是在询问、建议或聊天，没有明确说"好""可以""同意""换成""帮我改""重新规划"等确认词，不要生成新行程，trip_plan返回null，先询问用户是否确认。"""


class TripAgent:
    def __init__(self):
        self.history = []
        self.current_city = ""

    def chat(self, user_message: str, replan_mode: str = None) -> dict:
        if replan_mode:
            mode_map = {
                "too_rush": "行程太赶了，请帮我调整得轻松一些，每天少安排一个景点",
                "too_expensive": "预算太高了，请帮我换成更便宜的选择",
                "raining": "明天下雨，请把户外景点改成室内活动",
                "relax": "我想要更轻松的行程，节奏放慢一点",
                "more_food": "请多安排一些特色美食体验，减少一个景点"
            }
            user_message = mode_map.get(replan_mode, user_message)

        city = self._extract_city(user_message)
        if city:
            self.current_city = city
        else:
            city = self.current_city

        context = ""
        if city:
            real_attractions = get_city_attractions(city)
            real_restaurants = get_city_restaurants(city)
            weather = get_weather(city)
            rag = search_knowledge_base(user_message)

            if real_attractions:
                simplified = [{"name": p["name"], "address": p.get("address", ""), "longitude": p.get("longitude"), "latitude": p.get("latitude")} for p in real_attractions]
                context += f"\n【真实景点数据】：{json.dumps(simplified, ensure_ascii=False)}"
            if real_restaurants:
                simplified = [{"name": p["name"], "address": p.get("address", ""), "longitude": p.get("longitude"), "latitude": p.get("latitude")} for p in real_restaurants]
                context += f"\n【真实餐厅数据】：{json.dumps(simplified, ensure_ascii=False)}"
            if weather:
                context += f"\n天气数据：{json.dumps(weather, ensure_ascii=False)}"
            if rag:
                context += f"\n知识库参考：{rag}"

        message = user_message
        if context:
            message += f"\n\n[参考数据]{context}"

        self.history.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + self.history,
            temperature=0.7
        )

        reply = response.choices[0].message.content
        self.history.append({"role": "assistant", "content": reply})

        result = self._parse_reply(reply)

        if result.get("trip_plan") and city:
            for day in result["trip_plan"].get("days", []):
                for attr in day.get("attractions", []):
                    detail = get_place_detail(attr["name"], city)
                    if detail.get("longitude"):
                        attr["longitude"] = detail["longitude"]
                        attr["latitude"] = detail["latitude"]
                        attr["address"] = detail.get("address", attr.get("address", ""))

                first_attr = day.get("attractions", [{}])
                if first_attr and first_attr[0].get("longitude"):
                    lng = first_attr[0]["longitude"]
                    lat = first_attr[0]["latitude"]
                    for meal in day.get("meals", []):
                        nearby = search_nearby_restaurants(lng, lat, meal["name"])
                        if nearby.get("longitude"):
                            meal["longitude"] = nearby["longitude"]
                            meal["latitude"] = nearby["latitude"]
                            meal["address"] = nearby.get("address", meal.get("address", ""))

            local_foods = get_local_foods(city)
            if local_foods:
                result["trip_plan"]["local_foods"] = local_foods

        return result

    def chat_stream(self, user_message: str, replan_mode: str = None):
        """流式输出"""
        if replan_mode:
            mode_map = {
                "too_rush": "行程太赶了，请帮我调整得轻松一些，每天少安排一个景点",
                "too_expensive": "预算太高了，请帮我换成更便宜的选择",
                "raining": "明天下雨，请把户外景点改成室内活动",
                "relax": "我想要更轻松的行程，节奏放慢一点",
                "more_food": "请多安排一些特色美食体验，减少一个景点"
            }
            user_message = mode_map.get(replan_mode, user_message)

        city = self._extract_city(user_message)
        if city:
            self.current_city = city
        else:
            city = self.current_city

        context = ""
        if city:
            real_attractions = get_city_attractions(city)
            real_restaurants = get_city_restaurants(city)
            weather = get_weather(city)

            if real_attractions:
                simplified = [{"name": p["name"], "address": p.get("address", ""), "longitude": p.get("longitude"), "latitude": p.get("latitude")} for p in real_attractions]
                context += f"\n【真实景点数据】：{json.dumps(simplified, ensure_ascii=False)}"
            if real_restaurants:
                simplified = [{"name": p["name"], "address": p.get("address", ""), "longitude": p.get("longitude"), "latitude": p.get("latitude")} for p in real_restaurants]
                context += f"\n【真实餐厅数据】：{json.dumps(simplified, ensure_ascii=False)}"
            if weather:
                context += f"\n天气数据：{json.dumps(weather, ensure_ascii=False)}"

        message = user_message
        if context:
            message += f"\n\n[参考数据]{context}"

        self.history.append({"role": "user", "content": message})

        stream = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + self.history,
            temperature=0.7,
            stream=True
        )

        full_reply = ""
        json_started = False
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                full_reply += delta
                if "__JSON_START__" in full_reply:
                  json_started = True
                if not json_started:
                  display = delta.replace("__JSON_START__", "")
                  if display:
                      yield display
                

        self.history.append({"role": "assistant", "content": full_reply})

        
        # 提取JSON部分
        if "__JSON_START__" in full_reply:
            json_part = full_reply.split("__JSON_START__")[1].strip()
            message_part = full_reply.split("__JSON_START__")[0].strip()
        else:
            json_part = full_reply
            message_part = ""

        result = self._parse_reply(json_part)
        if message_part and result.get("trip_plan"):
            result["message"] = message_part
        
        
        
        if result.get("trip_plan") and city:
            for day in result["trip_plan"].get("days", []):
                for attr in day.get("attractions", []):
                    detail = get_place_detail(attr["name"], city)
                    if detail.get("longitude"):
                        attr["longitude"] = detail["longitude"]
                        attr["latitude"] = detail["latitude"]
                        attr["address"] = detail.get("address", attr.get("address", ""))

                first_attr = day.get("attractions", [{}])
                if first_attr and first_attr[0].get("longitude"):
                    lng = first_attr[0]["longitude"]
                    lat = first_attr[0]["latitude"]
                    for meal in day.get("meals", []):
                        nearby = search_nearby_restaurants(lng, lat, meal["name"])
                        if nearby.get("longitude"):
                            meal["longitude"] = nearby["longitude"]
                            meal["latitude"] = nearby["latitude"]
                            meal["address"] = nearby.get("address", meal.get("address", ""))

            local_foods = get_local_foods(city)
            if local_foods:
                result["trip_plan"]["local_foods"] = local_foods

        yield f"\n__RESULT__{json.dumps(result, ensure_ascii=False)}"

    def _extract_city(self, message: str) -> str:
        cities = [
            "北京", "上海", "广州", "深圳", "成都", "杭州", "西安",
            "重庆", "南京", "武汉", "厦门", "青岛", "三亚", "海南",
            "丽江", "大理", "桂林", "张家界", "黄山", "苏州", "海口",
            "长沙", "昆明", "贵阳", "福州", "济南", "沈阳", "哈尔滨",
            "长春", "太原", "郑州", "合肥", "南昌", "南宁", "兰州",
            "乌鲁木齐", "西宁", "银川", "呼和浩特", "拉萨"
        ]
        for city in cities:
            if city in message:
                return city
        return ""

    def _parse_reply(self, reply: str) -> dict:
        try:
            if "```json" in reply:
                s = reply.find("```json") + 7
                e = reply.find("```", s)
                json_str = reply[s:e].strip()
            elif "{" in reply:
                s = reply.find("{")
                e = reply.rfind("}") + 1
                json_str = reply[s:e]
            else:
                return {"message": reply, "trip_plan": None}
            return json.loads(json_str)
        except Exception:
            return {"message": reply, "trip_plan": None}

    def clear_history(self):
        self.history = []


agent = TripAgent()