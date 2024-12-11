export const host = 'http://localhost:3000'

export const endpoints = {
    getAllRecipes: '/recipes',
    getOneRecipe: (recipeId: string) => `/recipes/${recipeId}`,
    likeRecipe: (recipeId: string) => `/recipes/${recipeId}/likes`,
    getMostLiked: '/recipes/mostLiked',
    register: '/user/register',
    login: '/user/login',
    logout: '/user/logout',
    profile: '/user/profile',
    search: '/recipes/search',
    myRecipes: '/recipes/my-recipes'
}