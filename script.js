const searchBox=document.querySelector('.searchBox');
const searchbtn=document.querySelector('.searchBtn');
const recipeContainer=document.querySelector('.recipe-container');
const recipeDetailsContent=document.querySelector('.recipe-details-content');
const recipeCloseBtn=document.querySelector('.recipe-close-Btn')


const fetchRecipes= async(query)=>{
    recipeContainer.innerHTML="<h2>Fetching Recipes...</h2>";
    try {
        
   
    const data=await fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response= await data.json();
    recipeContainer.innerHTML="";

    response.meals.forEach(meal=>{
        const recipeDiv=document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML=`
           <img src="${meal.strMealThumb}">
           <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belong to <span>${meal.strCategory}</span> Category</p>
        `
        const button =document.createElement('button');
        button.textContent='View Recipe';
        recipeDiv.appendChild(button)

        // adding eventlistner to recipe button
        button.addEventListener('click',()=>{
            openRecipePopup(meal);
        })



       
        recipeContainer.appendChild(recipeDiv);
    });
   } 
   catch (error) {
    recipeContainer.innerHTML="<h2> Erroe in Fetching Recipes...</h2>";

}

}

// Function to fetch ingradients and measurements

const fetchIngredients=(meal)=>{
    let ingredientsList='';
    for(let i=1;i<=20;i++){
        const ingredient=meal[`strIngredient${i}`];
        if(ingredient){
            const measure=meal[`strMeasure${i}`];
            ingredientsList +=`<li>${measure}${ingredient}</li>`
        }
        else{
            break;
        }
    }
    return ingredientsList;

}



const openRecipePopup=(meal)=>{
    recipeDetailsContent.innerHTML=`
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredents</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
       <div class="recipeInstructions">
        <h3>Instruction:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    `

 
    recipeDetailsContent.parentElement.style.display='block'

}

recipeCloseBtn.addEventListener('click',()=>{
    recipeDetailsContent.parentElement.style='none'

});

searchbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const searchInput=searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML=`<h2>Type the meal in the search box </h2>`;
        return;
    }

    fetchRecipes(searchInput);
});

// #voice search


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    
    const startButton = document.getElementById('voice-search');
    const searchBox = document.querySelector('.searchBox');

    if (startButton && searchBox) { 
        startButton.addEventListener('click', () => {
            recog.start();
        });

        recog.onresult = (event) => {
         let str = event.results[0][0].transcript.slice(0,event.results[0][0].transcript.length-1);
         searchBox.value=str
       
            
        };

        recog.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recog.onend = () => {
            console.log('Speech recognition ended');
        };
    } else {
        console.error('Start button or search input not found');
    }
} else {
    console.log('Speech recognition not supported');
}