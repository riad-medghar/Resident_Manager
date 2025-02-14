/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_7654321098")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_806904202",
    "hidden": false,
    "id": "relation2625893554",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "allocation_id",
    "presentable": true,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_7654321098")

  // update field
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

  return app.save(collection)
})
