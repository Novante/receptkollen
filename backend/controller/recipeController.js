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

        if (await page.$('#onetrust-accept-btn-handler') !== null){
            await page.click('#onetrust-accept-btn-handler')
        }



    console.log(await page.$$eval('.recipe-page-body__ingredients', options => {
        return options.map(option => option.textContent)
    }))
}






export default recipeController;
