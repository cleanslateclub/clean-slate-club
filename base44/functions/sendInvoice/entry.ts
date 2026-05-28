import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { bookingId, clientName, clientEmail, serviceLabel, amountCents, description, lineItems } = await req.json();

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    // Find or create customer
    let customers = await stripe.customers.list({ email: clientEmail, limit: 1 });
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({ name: clientName, email: clientEmail });
    }

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 7,
      description: description || `Clean Slate Club™ — ${serviceLabel}`,
      metadata: { booking_id: bookingId || '' },
      custom_fields: [
        { name: 'Service', value: serviceLabel },
        { name: 'Provider', value: 'Clean Slate Club™' },
      ],
    });

    // Add line items
    const items = lineItems && lineItems.length > 0 ? lineItems : [{ description: serviceLabel, amount: amountCents }];
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        amount: item.amount,
        currency: 'usd',
        description: item.description,
      });
    }

    // Finalize and send
    await stripe.invoices.finalizeInvoice(invoice.id);
    const sent = await stripe.invoices.sendInvoice(invoice.id);

    return Response.json({ success: true, invoiceId: sent.id, invoiceUrl: sent.hosted_invoice_url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});