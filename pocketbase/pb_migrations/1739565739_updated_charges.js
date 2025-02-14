/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2881236976")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_7654321098",
    "hidden": false,
    "id": "relation696906237",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "invoice_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2881236976")

  // remove field
  collection.fields.removeById("relation696906237")

  return app.save(collection)
})
