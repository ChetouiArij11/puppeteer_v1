const express = require('express');
const engine = require('express-handlebars').engine;
const puppeteer = require('puppeteer');

const app = express();

app.use(express.static('public'));


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.get('/', (req, res) => {
  res.render('home');
});
app.get("/search", async function (req, res) {
  let searchQuery = req.query.q;
  let searchAmazonURL = "https://www.amazon.com/s?k=" + searchQuery;
  console.log(searchAmazonURL);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(searchAmazonURL);

  const html = await page.evaluate(function () {

    let allProducts = document.querySelectorAll('.s-result-item.s-asin')
    let products = [];
    for (let product of allProducts) {
      let productTitle = product.querySelector(".a-text-normal").textContent;
      //let productPrice = product.querySelector(".a-price-whole").textContent;
      let productImage = product.querySelector(".s-image").src;
      products.push({ productTitle, /*productPrice,*/ productImage })
    }
    
    return products;
  });

  console.log(html);

  await browser.close();

  res.render("search", {
    resultat: html,
  });
});

app.listen(3000);
// Route pour la recherche
/*app.get('/search', async (req, res) => {
  const searchQuery = req.query.q; 
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.amazon.com");
  await page.type("#twotabsearchtextbox", searchQuery);
  await page.click("#nav-search-submit-button");
  await page.waitForSelector(".s-pagination-next");


  await page.click(".s-pagination-next");
  await page.waitForSelector(".s-pagination-next");


  const title = await page.$$eval("h2 span.a-color-base", (nodes) =>
    nodes.map((n) => n.innerText)
  );

 
  const price = await page.$$eval(
    "[data-component-type='s-search-result'] span.a-price[data-a-color='base'] span.a-offscreen",
    (nodes) => nodes.map((n) => n.innerText)
  );
  

 
  const amazonSearchArray = title.slice(0, 5).map((value, index) => {
    return {
      title: title[index],
      price: price[index],
      
    };
  });
  res.render('search', { amazonSearchArray });
  });
*/

/**/
