/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_9876543210")

  // remove field
  collection.fields.removeById("text2069996022")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3880616691",
    "hidden": false,
    "id": "relation2908602461",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "payment_type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_9876543210")

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2069996022",
    "max": 0,
    "min": 0,
    "name": "payment_method",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("relation2908602461")

  return app.save(collection)
})
