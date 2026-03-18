from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os
import json

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))

def get_llm():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found. Check your .env file.")
    return ChatGroq(
        api_key=api_key,
        model_name="openai/gpt-oss-120b",
        temperature=0.7
    )

suggest_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are ChefOS, a world-class AI chef assistant.
Your job is to suggest dishes based on available ingredients.
Always respond with ONLY a valid JSON array. No extra text, no markdown, no explanation.
Each item must have exactly these fields: name, difficulty, time, description.
difficulty must be one of: Easy, Medium, Hard.
time must be a string like '20 mins' or '1 hour'.
description must be under 20 words."""),
    ("human", """I have these ingredients: {ingredients}
Suggest 4 to 5 dishes I can make. Return ONLY a JSON array.""")
])

def get_dish_suggestions(ingredients: list) -> list:
    llm = get_llm()
    chain = suggest_prompt | llm
    ingredients_str = ", ".join(ingredients)
    response = chain.invoke({"ingredients": ingredients_str})
    raw = response.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    return json.loads(raw)