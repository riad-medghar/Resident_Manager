/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // update field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "number2554671376",
    "max": null,
    "min": null,
    "name": "number_of_persons_living_in",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // update field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "number2554671376",
    "max": null,
    "min": 1,
    "name": "number_of_persons_living_in",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
