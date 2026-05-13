import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    LLM_API_KEY = os.getenv("LLM_API_KEY", "")
    LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.deepseek.com/v1")
    LLM_MODEL = os.getenv("LLM_MODEL_ID", "deepseek-chat")
    AMAP_API_KEY = os.getenv("AMAP_API_KEY", "")
    UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "")

settings = Settings()