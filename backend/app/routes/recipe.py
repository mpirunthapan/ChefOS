from fastapi import APIRouter, HTTPException
from app.models.recipe import IngredientInput, DishSelection
from app.chains.suggest_chain import get_dish_suggestions
from app.chains.recipe_chain import get_full_recipe
from app.db.mongo import sessions_collection
from datetime import datetime
import json

router = APIRouter()

@router.post("/suggest")
async def suggest_dishes(data: IngredientInput):
    try:
        dishes = get_dish_suggestions(data.ingredients)
        
        # Save session to MongoDB
        session = {
            "ingredients": data.ingredients,
            "suggested_dishes": dishes,
            "selected_dish": None,
            "full_recipe": None,
            "created_at": datetime.utcnow()
        }
        result = sessions_collection.insert_one(session)
        
        return {
            "session_id": str(result.inserted_id),
            "dishes": dishes
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid format. Try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recipe")
async def get_recipe(data: DishSelection):
    try:
        recipe = get_full_recipe(data.dish_name, data.ingredients)
        
        # Save recipe to MongoDB
        session = {
            "ingredients": data.ingredients,
            "selected_dish": data.dish_name,
            "full_recipe": recipe,
            "created_at": datetime.utcnow()
        }
        sessions_collection.insert_one(session)
        
        return {"recipe": recipe}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid format. Try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_history():
    try:
        sessions = list(sessions_collection.find(
            {"full_recipe": {"$ne": None}},
            {"_id": 0}
        ).sort("created_at", -1).limit(20))
        return {"history": sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))