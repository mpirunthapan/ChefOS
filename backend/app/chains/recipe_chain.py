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

recipe_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are ChefOS, a world-class AI chef assistant.
Generate a complete step-by-step recipe in JSON format.
Always respond with ONLY valid JSON. No extra text, no markdown.
The JSON must have exactly these fields:
- dish_name: string
- steps: array of objects with step_number (int) and instruction (string)
- tips: array of strings (3 to 4 cooking tips)
- addons: array of objects with name and description (3 to 4 optional add-ons or substitutes)
Keep instructions clear and beginner-friendly."""),
    ("human", """Create a full recipe for: {dish_name}
I have these ingredients available: {ingredients}
Return ONLY the JSON object.""")
])

def get_full_recipe(dish_name: str, ingredients: list) -> dict:
    llm = get_llm()
    chain = recipe_prompt | llm
    ingredients_str = ", ".join(ingredients)
    response = chain.invoke({
        "dish_name": dish_name,
        "ingredients": ingredients_str
    })
    raw = response.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    return json.loads(raw)