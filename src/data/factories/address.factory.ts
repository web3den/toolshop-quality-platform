/**
 * Billing-address factory backed by the product's own postcode-lookup service.
 *
 * The API cross-validates billing city/state against its postcode lookup
 * (see AddressMatchesCountry rule in the SUT), so a hardcoded or faker-random
 * address is rejected with 422. The only contract-correct way to produce a
 * valid billing address is to ask the SUT what city/state belong to a given
 * (country, postcode) — exactly what the UI's auto-fill does.
 */
import { createToolshopClient, unwrap } from '../../api/client';

export interface BillingAddress {
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_postal_code: string;
}

export async function resolveBillingAddress(
  country = 'US',
  postcode = '78701',
): Promise<BillingAddress> {
  const api = createToolshopClient();
  const lookup = unwrap(
    await api.GET('/postcode-lookup', { params: { query: { country, postcode } } }),
  ) as { street?: string; house_number?: string; city?: string; state?: string };
  return {
    billing_street: `${lookup.street ?? 'Main Street'} ${lookup.house_number ?? '1'}`.slice(0, 70),
    billing_city: lookup.city ?? '',
    billing_state: lookup.state ?? '',
    billing_country: country,
    billing_postal_code: postcode,
  };
}
