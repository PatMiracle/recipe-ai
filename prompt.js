const prompt = `
I have uploaded an image. Please confirm if there is food present in the image.

If food is present, please provide a JSON object containing the following information:
1. name (string): The common name of the dish.
2. ingredients (list of strings): A list containing the names of the ingredients in the dish.
3. steps (list of strings): A list containing high-level cooking instructions for the dish.
4. healthBenefits (list of strings): A list of potential health benefits associated with the ingredients in the dish(optional).

If food is not present, please provide a JSON object, notifying the error.

Example:
Input: (Image of a pizza)

Output:
 {  
    "name": "Pizza",
    "ingredients": [
      "Dough",
      "Tomato sauce",
      "Cheese",
    ],
    "steps": [
      "Prepare pizza dough",
      "Spread tomato sauce",
      "Add cheese and desired toppings",
      "Bake until golden brown"
    ],
    "healthBenefits": [
      "Source of calcium (cheese)",
      "May provide fiber (depending on crust)"
    ]}

Input: (image of a house)

Output: 
{
"error": "No food detected in the image"
}

Input: 
`;

export default prompt;
