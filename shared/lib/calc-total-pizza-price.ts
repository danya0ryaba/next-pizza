import { Ingredient, ProductItem } from "@prisma/client"
import { PizzaSize, PizzaType } from "../constants/pizza"

/**
 * функция для подсчета общей стоимости пиццы
 * @param type - тип теста
 * @param size - размер пиццы
 * @param items 
 * @param ingredients 
 * @param selectedIngredients 
 * @returns 
 */

export const calcTotalPizzaPrice = (
    type: PizzaType,
    size: PizzaSize,
    items: ProductItem[],
    ingredients: Ingredient[],
    selectedIngredients: Set<number>,
) => {

    const pizzaPrice = items.find((item) => item.pizzaType === type && item.size === size)?.price || 0

    const totalIngredientsPrice = ingredients
        .filter((ingredient) => selectedIngredients.has(ingredient.id))
        .reduce((acc, ingredient) => acc + ingredient.price, 0)

    return pizzaPrice + totalIngredientsPrice
}