const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Shopping list service object', function () {
  let db;
  let testShoppingList = [
    {
      id: 1,
      name: 'Test1',
      price: '1.00',
      category: 'Main',
      checked: true,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 2,
      name: 'Test2',
      price: '2.00',
      category: 'Lunch',
      checked: true,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 3,
      name: 'Test3',
      price: '3.00',
      category: 'Snack',
      checked: true,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    }
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db('shopping_list').truncate());

  afterEach(() => db('shopping_list').truncate());

  after(() => db.destroy());

  context('Given \'shopping_list\' has data', () => {
    beforeEach(() => {
      return db
        .insert(testShoppingList)
        .into('shopping_list');
    });
    it('getShoppingList() resolves all items from \'shopping_list\' table', () => {
      return ShoppingListService.getShoppingList(db)
        .then(actual => {
          expect(actual).to.eql(testShoppingList);
        });
    });
    it('deleteItem() removes a specified item', () => {
      const id = 2;
      return ShoppingListService.deleteItem(db, id)
        .then(() => ShoppingListService.getShoppingList(db))
        .then(allItems => {
          const expected = testShoppingList.filter(x => x.id !== id);
          expect(allItems).to.eql(expected);
        });
    });
    it('updateItem alters existing item to the desired result', () => {
      const id = 2;
      const newFields = {
        name: 'updated item',
        price: '5000.00',
        category: 'Breakfast'
      };
      return ShoppingListService.updateItem(db, id, newFields)
        .then(() => ShoppingListService.getById(db, id))
        .then(changed => {
          Object.keys(newFields).forEach(key => testShoppingList.find(item => item.id === id)[key] = newFields[key]);
          expect(
            testShoppingList.find(item=>item.id===id)
          ).is.eql(changed);
        }
        );
    });
  });

  context('Given \'shopping_list\' has no data', () => {
    it('getShoppingList() resolves an empty array', () => {
      return ShoppingListService.getShoppingList(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });
    it('insertItem() inserts a new item and resolves the new item with an \'id\'', () => {
      const newItem =
            {
              name: 'test item null',
              price: '1.00',
              category: 'Main'
            };
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql(
            {
              id: 1,
              name: newItem.name,
              price: newItem.price,
              date_added: newItem.date_added ? newItem.date_added : actual.date_added,
              checked: newItem.checked ? newItem.checked : false,
              category: newItem.category
            }
          );
        });
    });
  });
});