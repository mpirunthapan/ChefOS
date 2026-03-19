from fastapi import APIRouter, HTTPException
from app.models.recipe import IngredientInput, DishSelection
from app.chains.suggest_chain import get_dish_suggestions
from app.chains.recipe_chain import get_full_recipe
from app.db.mongo import sessions_collection
from datetime import datetime
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/suggest")
async def suggest_dishes(data: IngredientInput):
    try:
        logger.info(f"Suggesting dishes for ingredients: {data.ingredients}")
        dishes = get_dish_suggestions(data.ingredients)
        logger.info(f"Got dishes: {dishes}")

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
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        raise HTTPException(status_code=500, detail=f"AI returned invalid format: {str(e)}")
    except Exception as e:
        logger.error(f"Error in suggest_dishes: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")


@router.post("/recipe")
async def get_recipe(data: DishSelection):
    try:
        logger.info(f"Getting recipe for: {data.dish_name}")
        recipe = get_full_recipe(data.dish_name, data.ingredients)
        logger.info(f"Got recipe successfully")

        session = {
            "ingredients": data.ingredients,
            "selected_dish": data.dish_name,
            "full_recipe": recipe,
            "created_at": datetime.utcnow()
        }
        sessions_collection.insert_one(session)

        return {"recipe": recipe}
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        raise HTTPException(status_code=500, detail=f"AI returned invalid format: {str(e)}")
    except Exception as e:
        logger.error(f"Error in get_recipe: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")


@router.get("/history")
async def get_history():
    try:
        sessions = list(sessions_collection.find(
            {"full_recipe": {"$ne": None}},
            {"_id": 0}
        ).sort("created_at", -1).limit(20))
        return {"history": sessions}
    except Exception as e:
        logger.error(f"Error in get_history: {e}")
        raise HTTPException(status_code=500, detail=str(e))