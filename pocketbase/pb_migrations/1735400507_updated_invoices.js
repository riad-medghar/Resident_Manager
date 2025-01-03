/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_7654321098")

  // remove field
  collection.fields.removeById("relation123098765")

  // remove field
  collection.fields.removeById("text890123456")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_806904202",
    "hidden": false,
    "id": "relation2625893554",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "allocation_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "date4176324132",
    "max": "",
    "min": "",
    "name": "billing_periode",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number1251237913",
    "max": null,
    "min": null,
    "name": "amount_due",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number2484990468",
    "max": null,
    "min": null,
    "name": "amount_paid",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "unpaid",
      "partial",
      "paid",
      "overdue"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "date3866337329",
    "max": "",
    "min": "",
    "name": "due_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text18589324",
    "max": 0,
    "min": 0,
    "name": "notes",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_7654321098")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_9876543210",
    "hidden": false,
    "id": "relation123098765",
    "maxSelect": 1,
    "minSelect": 1,
    "name": "Payment_ID",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text890123456",
    "max": 0,
    "min": 0,
    "name": "File_Path",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("relation2625893554")

  // remove field
  collection.fields.removeById("date4176324132")

  // remove field
  collection.fields.removeById("number1251237913")

  // remove field
  collection.fields.removeById("number2484990468")

  // remove field
  collection.fields.removeById("select2063623452")

  // remove field
  collection.fields.removeById("date3866337329")

  // remove field
  collection.fields.removeById("text18589324")

  return app.save(collection)
})
