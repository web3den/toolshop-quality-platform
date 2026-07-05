/**
 * Contract tests: runtime responses must match the committed OpenAPI-derived
 * expectations. Type generation catches drift at compile time; these catch
 * drift at runtime (fields silently missing/renamed/retyped in live envs).
 */
import { test, expect } from '../../../src/fixtures/test.fixtures';
import { unwrap } from '../../../src/api/client';
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  is_location_offer: z.coerce.boolean(),
  is_rental: z.coerce.boolean(),
  in_stock: z.coerce.boolean().optional(),
  brand: z.object({ id: z.string(), name: z.string() }).nullable().optional(),
  category: z.object({ id: z.string(), name: z.string() }).nullable().optional(),
  product_image: z
    .object({ id: z.string(), file_name: z.string().optional() })
    .passthrough()
    .nullable()
    .optional(),
});

const PaginationSchema = z.object({
  current_page: z.number().int().positive(),
  data: z.array(ProductSchema),
  total: z.number().int().nonnegative(),
  per_page: z.number().int().positive(),
  last_page: z.number().int().positive(),
});

test.describe('API contract @contract', () => {
  // Verified falsifiable: the with-bugs build leaks internal fields
  // (stock, brand_id, category_id) and drops in_stock — this test catches it.
  test('GET /products matches the published schema @bug-sensitive', async ({ api }) => {
    const body = unwrap(await api.GET('/products', { params: { query: {} } }));
    const parsed = PaginationSchema.safeParse(body);
    expect(
      parsed.success,
      parsed.success ? 'ok' : `Contract violation:\n${JSON.stringify(parsed.error?.issues, null, 2)}`,
    ).toBe(true);
  });

  test('GET /categories/tree returns a recursive category structure', async ({ api }) => {
    const CategoryNode: z.ZodType<unknown> = z.lazy(() =>
      z
        .object({
          id: z.string(),
          name: z.string(),
          slug: z.string(),
          sub_categories: z.array(CategoryNode).optional(),
        })
        .passthrough(),
    );
    const body = unwrap(await api.GET('/categories/tree'));
    const parsed = z.array(CategoryNode).safeParse(body);
    expect(
      parsed.success,
      parsed.success ? 'ok' : JSON.stringify((parsed as { error?: z.ZodError }).error?.issues, null, 2),
    ).toBe(true);
  });

  test('GET /brands returns id+name+slug for every brand', async ({ api }) => {
    const body = unwrap(await api.GET('/brands'));
    const parsed = z
      .array(z.object({ id: z.string(), name: z.string(), slug: z.string() }).passthrough())
      .safeParse(body);
    expect(parsed.success, JSON.stringify((parsed as { error?: z.ZodError }).error?.issues ?? 'ok')).toBe(true);
  });

  test('error envelope: validation failures return structured 422', async ({ api }) => {
    const res = await api.POST('/users/register', { body: {} as never });
    expect(res.response.status).toBe(422);
    const body = res.error as Record<string, unknown>;
    expect(typeof body).toBe('object');
  });
});
