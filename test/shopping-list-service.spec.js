const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`Shopping list service object`, function() {
    let db;
    let testShoppingList = [
        {
            name: 'Test1',
            price: 1.00,
            category:'Main',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            name: 'Test2',
            price: 2.00,
            category: 'Lunch',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            name: 'Test3',
            price: 3.00,
            category:'Snack',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .insert(testShoppingList)
                .into('shopping_list')
        })
    })

    context(`Given 'shopping_list' has no data`, () => {

    })
})