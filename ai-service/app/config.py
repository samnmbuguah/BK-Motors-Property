import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

STRAPI_API_URL = os.getenv("STRAPI_API_URL", "http://bk-strapi-api:1337")
STRAPI_PUBLIC_URL = os.getenv("STRAPI_PUBLIC_URL", "https://bkapi.169-58-102-217.sslip.io")

def get_llm(temperature: float = 0.2):
    """
    Get configured LLM via NVIDIA NIM with fallback capability.
    """
    return ChatOpenAI(
        model=os.getenv("NVIDIA_MODEL", "meta/llama-3.2-11b-vision-instruct"),
        openai_api_key=NVIDIA_API_KEY,
        openai_api_base=os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1"),
        temperature=temperature,
        max_tokens=1024,
    )
