from pydantic import BaseModel
from typing import List, Optional

class IngredientInput(BaseModel):
    ingredients: List[str]
    amounts: Optional[List[str]] = []

class DishSelection(BaseModel):
    dish_name: str
    ingredients: List[str]

class DishSuggestion(BaseModel):
    name: str
    difficulty: str
    time: str
    description: str

class RecipeStep(BaseModel):
    step_number: int
    instruction: str

class RecipeAddon(BaseModel):
    name: str
    description: str

class FullRecipe(BaseModel):
    dish_name: str
    steps: List[RecipeStep]
    tips: List[str]
    addons: List[RecipeAddon]