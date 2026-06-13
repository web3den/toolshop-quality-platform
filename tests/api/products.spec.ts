import { test, expect } from '../../src/fixtures/test.fixtures';
import { unwrap } from '../../src/api/client';

interface ProductLite {
  id: string;
  name: string;
  price: number;
  in_stock?: boolean;
}
interface Paginated {
  data?: ProductLite[];
  total?: number;
  per_page?: number;
  current_page?: number;
}

test.describe('Products API', () => {
  test('lists products with pagination metadata @smoke @contract', async ({ api }) => {
    const page = unwrap(await api.GET('/products', { params: { query: {} } })) as Paginated;
    expect(page.data, 'products page should contain items').toBeDefined();
    expect(page.data!.length).toBeGreaterThan(0);
    expect(page.current_page).toBe(1);
    expect(page.total).toBeGreaterThanOrEqual(page.data!.length);
    for (const product of page.data!) {
      expect(product.id, 'every product has an id').toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(typeof product.price).toBe('number');
    }
  });

  test('sorts by price ascending @smoke', async ({ api }) => {
    const page = unwrap(
      await api.GET('/products', { params: { query: { sort: 'price,asc' } } }),
    ) as Paginated;
    const prices = (page.data ?? []).map((p) => p.price);
    expect(prices.length).toBeGreaterThan(1);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices, 'API must honor sort=price,asc').toEqual(sorted);
  });

  test('sorts by name descending @regression', async ({ api }) => {
    const page = unwrap(
      await api.GET('/products', { params: { query: { sort: 'name,desc' } } }),
    ) as Paginated;
    const names = (page.data ?? []).map((p) => p.name.toLowerCase());
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names, 'API must honor sort=name,desc').toEqual(sorted);
  });

  test('search returns only matching products @regression', async ({ api }) => {
    const result = unwrap(
      await api.GET('/products/search', { params: { query: { q: 'pliers' } } }),
    ) as Paginated;
    expect(result.data!.length).toBeGreaterThan(0);
    for (const product of result.data!) {
      expect(product.name.toLowerCase()).toContain('plier');
    }
  });

  test('product detail matches list entry @regression', async ({ api }) => {
    const page = unwrap(await api.GET('/products', { params: { query: {} } })) as Paginated;
    const first = page.data![0]!;
    const detail = unwrap(
      await api.GET('/products/{productId}', { params: { path: { productId: first.id } } }),
    ) as ProductLite;
    expect(detail.id).toBe(first.id);
    expect(detail.name).toBe(first.name);
    expect(detail.price).toBe(first.price);
  });

  // Verified falsifiable: the with-bugs build returns 200 for unknown ids.
  test('unknown product id returns 404, not 500 @regression @bug-sensitive', async ({ api }) => {
    const res = await api.GET('/products/{productId}', {
      params: { path: { productId: '01INVALIDULIDXXXXXXXXXXXXX' } },
    });
    expect([404, 422]).toContain(res.response.status);
  });
});
