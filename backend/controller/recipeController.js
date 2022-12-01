import puppeteer from 'puppeteer'
import {wordList} from "../utils/wordlist.js";

let page;


(async () => {
    const browser = await puppeteer.launch({headless: false})
    page = await browser.newPage();
})()

const recipeController = {}

recipeController.comparePrice = (req, res) => {

    let url = req.body

    console.log(url.site)

    checkRecipeSite(url.site)
    res.send('hej')
}

const checkRecipeSite = (url) => {

    let domain = url.split('.')[1]
    console.log(domain)

    switch (domain) {
        case 'recept':
            getIngredientsFromRecept()
    }
}

const getIngredientsFromRecept = async () => {
    let matSparArray = []
    let ingredientArray = []
    let unitArray = ["msk", "g", "dl", "tsk", "cl", "ml"]

    await page.goto(`https://recept.se/recept/kramig-kycklinggryta-med-svamp-och-bacon`)

    if (await page.$('#onetrust-accept-btn-handler') !== null) {
        await page.click('#onetrust-accept-btn-handler')
    }

    let ingredientList = (await page.$$eval('.recipe-page-body__ingredients', options => {
        return options.map(option => option.textContent)
    }))

    let filteredList = ingredientList.map(a => a.replace('–', ''))
    filteredList = filteredList.map(a => a.trim())

    let metricList = convertToMetric(filteredList)

    await page.goto("https://www.matspar.se/")

    if (await page.$('._32lLP') !== null) {
        await page.click('._32lLP')
    }

    await page.waitForTimeout(500)

    await page.type('._2FTiX', '13763')

    await page.waitForTimeout(500)

    await page.click('.H5Z4u  ')

    await page.waitForTimeout(3000)

    await page.click('.pGn__')

    for (let i = 0; i < metricList.length; i++) {
        let currentItem = "";
        let amount;

        if (!isNaN(metricList[i][0])) {
            amount = metricList[i][0]
        }

        // sätta ihop ord, kolla mot ordlista.
        ingredientArray = []
        for (let j = metricList[i].length - 1; j >= 0; j--) {
            if (!unitArray.includes(metricList[i][j])) {
                ingredientArray.unshift(metricList[i][j])
            } else {
                break;
            }
        }

        let tempArr = ingredientArray.join(' ')

        for (let j = 0; j < wordList.length; j++) {
            if (tempArr.includes(wordList[j])) {
                // console.log('included' + wordList[j])
                currentItem = wordList[j]
                break;
            }
        }

        await page.type('input[name=q]', currentItem)

        await page.click('._21yDv')

        await page.waitForTimeout(2000)

        let weight = (await page.$$eval('._11GaL', options => {
            return options.map(option => option.innerText)
        }))

        let price = (await page.$$eval('._2vs4r', options => {
            return options.map(option => option.innerText)
        }))

        for (let j = 0; j < price.length; j++) {
            let tempPrice;
            if (price[j].includes('för')){
                tempPrice = price[j].split(/\r?\n/)[1]
                tempPrice = tempPrice.replace(/[^\d,-]/g, '')
                // console.log(tempPrice)

            } else {
                tempPrice = price[j].split(/\r?\n/)[0]
                tempPrice = tempPrice.replace(/[^\d,-]/g, '')
                // console.log(tempPrice)
            }


        }

        // om vikten är lika eller över receptet, lägg in i annan lista.

        for (let j = 0; j < weight.length; j++) {
            let numericWeight = weight[j].replace(/\D/g,'');
            if (numericWeight >= amount){
                matSparArray.push(j, price[j], numericWeight)
            }
        }

// jag slutade här, starta programmet, kör via insomnia, kolla vad som händer och vad vi ska göra:


        console.log(matSparArray)



        console.log(price, weight)

    }


}

const convertToMetric = (filteredList) => {
    let filteredIngredientArr = [];
    for (let i = 0; i < filteredList.length; i++) {
        let ingredientArr = filteredList[i].split(' ')

        let index = ingredientArr.indexOf('')
        if (index !== -1) {
            ingredientArr.splice(index, 1)
        }

        switch (ingredientArr[1]) {
            case "msk":
                ingredientArr[0] = ingredientArr[0] * 15
                ingredientArr[1] = 'g'
                filteredIngredientArr.push(ingredientArr)
                break;
            case "tsk":
                ingredientArr[0] = ingredientArr[0] * 5
                ingredientArr[1] = 'g'
                filteredIngredientArr.push(ingredientArr)
                break;
            case "krm":
                ingredientArr[0] = ingredientArr[0] * 1
                ingredientArr[1] = 'g'
                break;
            default:
                filteredIngredientArr.push(ingredientArr)
        }
    }

    // console.log(filteredIngredientArr)
    return filteredIngredientArr

}

export default recipeController;
