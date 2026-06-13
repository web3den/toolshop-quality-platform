/**
 * API-first data seeding for carts.
 *
 * E2E tests should arrange state via the API (fast, deterministic) and use
 * the browser only for the behavior under test. Product lookups are cached
 * per worker; independent cart additions fan out concurrently.
 */
import { createToolshopClient, unwrap, type ToolshopClient } from '../../api/client';
import { mapWithConcurrency } from '../../utils/parallel';

interface ProductLite {
  id: string;
  name: string;
  price: number;
  in_stock?: boolean;
}

let productCache: ProductLite[] | null = null;

/** First page of products, cached per worker (catalog is stable seed data). */
export async function fetchProducts(client?: ToolshopClient): Promise<ProductLite[]> {
  if (productCache) return productCache;
  const api = client ?? createToolshopClient();
  const page = unwrap(await api.GET('/products', { params: { query: {} } })) as {
    data?: ProductLite[];
  };
  productCache = (page.data ?? []).filter((p) => p.in_stock !== false);
  if (productCache.length === 0) throw new Error('Product catalog is empty — cannot seed carts');
  return productCache;
}

export interface SeededCart {
  cartId: string;
  items: Array<{ product: ProductLite; quantity: number }>;
}

/** Creates an anonymous cart and adds the first N in-stock products. */
export async function seedCart(productCount = 1, quantity = 1): Promise<SeededCart> {
  const api = createToolshopClient();
  const products = (await fetchProducts(api)).slice(0, productCount);
  if (products.length < productCount) {
    throw new Error(`Catalog has only ${products.length} in-stock products, needed ${productCount}`);
  }

  const created = unwrap(await api.POST('/carts')) as { id?: string };
  if (!created.id) throw new Error(`Cart creation returned no id: ${JSON.stringify(created)}`);
  const cartId = created.id;

  await mapWithConcurrency(
    products,
    async (product) => {
      const res = await api.POST('/carts/{id}', {
        params: { path: { id: cartId } },
        body: { product_id: product.id, quantity },
      });
      if (res.response.status >= 400) {
        throw new Error(`Failed to add ${product.id} to cart ${cartId}: ${res.response.status}`);
      }
    },
    3,
  );

  return { cartId, items: products.map((product) => ({ product, quantity })) };
}
