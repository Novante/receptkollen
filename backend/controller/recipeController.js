import puppeteer from 'puppeteer'

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
    await page.goto(`https://recept.se/recept/kramig-kycklinggryta-med-svamp-och-bacon`)

    if (await page.$('#onetrust-accept-btn-handler') !== null) {
        await page.click('#onetrust-accept-btn-handler')
    }

    let ingredientList = (await page.$$eval('.recipe-page-body__ingredients', options => {
        return options.map(option => option.textContent)
    }))

    let filteredList = ingredientList.map(a => a.replace('–', ''))
    filteredList = filteredList.map(a => a.trim())

    convertToMetric(filteredList)


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

    console.log(filteredIngredientArr)

}

export default recipeController;
