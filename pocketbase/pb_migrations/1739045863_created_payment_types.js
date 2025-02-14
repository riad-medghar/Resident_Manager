/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select1579384326",
        "maxSelect": 1,
        "name": "name",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "monthly_rent",
          "partial_year",
          "full_year",
          "purchase",
          "maintenance_fee",
          "utility_charge",
          "staff_salary",
          "other_expense"
        ]
      },
      {
        "hidden": false,
        "id": "select105650625",
        "maxSelect": 1,
        "name": "category",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "income",
          "expense"
        ]
      },
      {
        "hidden": false,
        "id": "select645904403",
        "maxSelect": 1,
        "name": "frequency",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "one_time",
          "monthly",
          "quarterly",
          "biannual",
          "annual"
        ]
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3880616691",
    "indexes": [],
    "listRule": null,
    "name": "payment_types",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3880616691");

  return app.delete(collection);
})
