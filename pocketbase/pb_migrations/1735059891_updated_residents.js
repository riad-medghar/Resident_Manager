/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // remove field
  collection.fields.removeById("number163212356")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "date1927859785",
    "max": "",
    "min": "",
    "name": "move_in_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "autodate3769133984",
    "name": "move_in_datee",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2522582908")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number163212356",
    "max": null,
    "min": null,
    "name": "duration_of_stay",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("date1927859785")

  // remove field
  collection.fields.removeById("autodate3769133984")

  return app.save(collection)
})
