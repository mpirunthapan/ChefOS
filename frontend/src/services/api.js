import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const suggestDishes = (ingredients, userId = null) =>
    api.post('/suggest', { ingredients, user_id: userId })

export const getRecipe = (dish_name, ingredients, userId = null) =>
    api.post('/recipe', { dish_name, ingredients, user_id: userId })

export const getHistory = (userId = null) =>
    api.get('/history', { params: { user_id: userId } })

export default api