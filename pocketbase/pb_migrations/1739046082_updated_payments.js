/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_9876543210")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select2069996022",
    "maxSelect": 1,
    "name": "payment_method",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "cash",
      "bank_transfer",
      "check",
      "other"
    ]
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2347871824",
    "max": 0,
    "min": 0,
    "name": "reference_number",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "completed",
      "failed",
      "pending",
      "cancelled"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_9876543210")

  // remove field
  collection.fields.removeById("select2069996022")

  // remove field
  collection.fields.removeById("text2347871824")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "completed",
      "failed",
      "reversed"
    ]
  }))

  return app.save(collection)
})
