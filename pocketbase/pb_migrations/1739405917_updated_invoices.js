/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_7654321098")

  // remove field
  collection.fields.removeById("date4176324132")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_7654321098")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "date4176324132",
    "max": "",
    "min": "",
    "name": "billing_period",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
