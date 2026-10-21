# Internship registration and Razorpay

## Activation

1. Run on Node.js 24 (minimum 22.13) with persistent private disk. This implementation uses built-in SQLite. Do not deploy its storage to ephemeral serverless instances or share a SQLite file between multiple hosts. Use a managed database before deploying in those environments.
2. Copy `.env.example` to `.env.local`. Add the matching Razorpay test Key ID and Key Secret locally. Never put the secret in a NEXT_PUBLIC variable or send it through chat. Restart the application.
3. In Razorpay enable automatic capture. Configure a webhook at `https://YOUR-DOMAIN/api/razorpay/webhook`, select `payment.captured` and `order.paid`, and set the matching webhook secret locally. A public HTTPS endpoint is required for webhook delivery.
4. Complete Razorpay test-mode checkout and verification before accepting money. Then use the activated merchant account's live keys and matching live webhook. No real transaction was performed during implementation.

## Records and support

The server fixes the fee at 699900 paise INR. Registration collects the applicant’s name, email, and phone number. Any kit delivery details should be collected separately after payment.

Enrolments are stored in `.data/enrolments/enrolments.sqlite`, or the private `ENROLMENT_STORAGE_DIR`. Protect the directory with OS permissions and encrypted backups. It contains personal information: never serve it publicly or commit it. There is no public listing endpoint. Staff currently need secure server/database access to view registrations; no admin dashboard, email, SMS or automatic course access is included.

Each browser session retains only an opaque registration ID and access token, not contact/address data. Retrying resumes the existing order. Paid status requires a verified matching captured payment, including amount, currency and order ownership. Signed webhooks recover confirmation if the browser closes. Repeated events are safe and cannot downgrade paid state. Refunds and disputes must be managed in Razorpay; this implementation does not automate them.

An interrupted order creation is deliberately blocked from automatic retry, since the remote order might already exist. For a registration stuck in `creating`, staff must reconcile its receipt with Razorpay and attach the correct order or reset it only after confirming no order/payment exists. Never ask a learner to pay again before reconciliation.

Before public launch, define class timings, kit fulfilment and delivery charges/coverage, privacy terms, cancellation/refund terms, support and enrolment notifications. No unapproved promises are displayed. Add edge rate limiting/bot protection on registration before public traffic. Local preview is not a deployed or activated payment gateway.

References: [Razorpay Standard Checkout](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/), [webhook validation](https://razorpay.com/docs/webhooks/validate-test/).
