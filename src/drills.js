require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function searchProduct(searchTerm) {
    knexInstance
        .from('shopping_list')
        .select('*')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

searchProduct('bull');

function paginateItems(pageNumber) {
    const productsPerPage = 6
    const offset = productsPerPage * (pageNumber - 1)
    knexInstance
        .from('shopping_list')
        .select('*')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

paginateItems(3);

function getItemsAfterDate(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .from('shopping_list')
        .then(results => {
            console.log(results)
        })
}

getItemsAfterDate(10);

function getTotalCostByCategory() {
    knexInstance
        .from('shopping_list')
        .select('category')
        .groupBy('category')
        .sum('price AS total')
        .then(results => {
            console.log(results)
        })
}

getTotalCostByCategory();