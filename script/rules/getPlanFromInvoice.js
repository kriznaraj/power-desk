let cbApi = require("../../service/cb_connector/api_connector/api.js");
exports.execute = async function (params) {
  console.log("checkPlanAccountCode.js");
  let planId = getPlanId(params.invoice);
  let plan = await cbApi.retrieveByRoute("plans/" + planId);
  return {
    status: "PASS",
    response: {
      plan: plan.plan,
    },
  };
};
let getPlanId = function (invoice) {
  for (let item in invoice.line_items) {
    if (invoice.line_items[item].entity_type == "plan") {
      return invoice.line_items[item].entity_id;
    }
  }
};
// {
//   "adjustment_credit_notes": [],
//   "amount_adjusted": 0,
//   "amount_due": 0,
//   "amount_paid": 4000,
//   "amount_to_collect": 0,
//   "applied_credits": [],
//   "base_currency_code": "USD",
//   "billing_address": {
//       "first_name": "John",
//       "last_name": "Mathew",
//       "object": "billing_address",
//       "validation_status": "not_validated"
//   },
//   "credits_applied": 0,
//   "currency_code": "USD",
//   "customer_id": "__test__XpbBxQiS4HD18hX5",
//   "date": 1517429428,
//   "deleted": false,
//   "due_date": 1517429428,
//   "dunning_attempts": [],
//   "exchange_rate": 1,
//   "first_invoice": true,
//   "has_advance_charges": false,
//   "id": "__demo_inv__13",
//   "is_gifted": false,
//   "issued_credit_notes": [],
//   "line_items": [{
//       "amount": 4000,
//       "customer_id": "__test__XpbBxQiS4HD18hX5",
//       "date_from": 1517429428,
//       "date_to": 1517429428,
//       "description": "non_recurring_addon",
//       "discount_amount": 0,
//       "entity_id": "non_recurring_addon",
//       "entity_type": "addon",
//       "id": "li___test__XpbBxQiS4HD1AUXC",
//       "is_taxed": false,
//       "item_level_discount_amount": 0,
//       "object": "line_item",
//       "pricing_model": "per_unit",
//       "quantity": 2,
//       "tax_amount": 0,
//       "tax_exempt_reason": "tax_not_configured",
//       "unit_amount": 2000
//   }],
//   "linked_orders": [],
//   "linked_payments": [{
//       "applied_amount": 4000,
//       "applied_at": 1517429428,
//       "txn_amount": 4000,
//       "txn_date": 1517429428,
//       "txn_id": "txn___test__XpbBxQiS4HD1ArXD",
//       "txn_status": "success"
//   }],
//   "net_term_days": 0,
//   "new_sales_amount": 4000,
//   "object": "invoice",
//   "paid_at": 1517429428,
//   "price_type": "tax_exclusive",
//   "recurring": false,
//   "resource_version": 1517429428000,
//   "round_off_amount": 0,
//   "shipping_address": {
//       "city": "Walnut",
//       "country": "US",
//       "first_name": "John",
//       "last_name": "Mathew",
//       "object": "shipping_address",
//       "state": "California",
//       "state_code": "CA",
//       "validation_status": "not_validated",
//       "zip": "91789"
//   },
//   "status": "paid",
//   "sub_total": 4000,
//   "tax": 0,
//   "term_finalized": true,
//   "total": 4000,
//   "updated_at": 1517429428,
//   "write_off_amount": 0
// }