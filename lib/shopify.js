/**
 * Shopify Storefront API client for LOVE ME AFTER.
 *
 * Falls back to local mock data (shaped identically to the real Storefront
 * API response) whenever store credentials aren't configured, so the UI can
 * be built and previewed before the real store is wired up. Swapping to
 * live data later requires no changes to callers -- only setting the two
 * env vars below.
 */

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN; // e.g. "your-store.myshopify.com"
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = '2024-10';

const isLiveConfigured = Boolean(DOMAIN && STOREFRONT_TOKEN);

/**
 * Low-level GraphQL request against the Shopify Storefront API.
 */
async function shopifyFetch({ query, variables = {} }) {
  if (!isLiveConfigured) {
    throw new Error(
      'Shopify Storefront API is not configured (SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN missing). Using mock data instead.'
    );
  }

  const response = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    // Revalidate frequently in production; adjust per route with fetch options if needed.
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`Shopify Storefront API GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 6) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 25) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

const ALL_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query AllProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

// ---------------------------------------------------------------------------
// Category classification
// ---------------------------------------------------------------------------

/**
 * Known collection buckets. Add "mens" here once the Fall 2026 men's line
 * actually ships product data -- everything downstream (nav, homepage
 * teaser, category filtering) already has hooks for it.
 */
export const COLLECTIONS = {
  DRESSES: 'dresses',
  HEELS: 'heels',
  MENS: 'mens', // Expansion hook: no live inventory yet (see homepage teaser).
};

const CATEGORY_KEYWORDS = {
  [COLLECTIONS.DRESSES]: ['dress', 'dresses', 'gown'],
  [COLLECTIONS.HEELS]: ['heel', 'heels', 'pump', 'stiletto'],
  [COLLECTIONS.MENS]: ['mens', "men's", 'men'],
};

/**
 * Classifies a Storefront API product into one of COLLECTIONS based on its
 * productType first, then tags. Returns null if it matches neither --
 * callers should treat unclassified products as "uncategorized" rather
 * than guessing.
 */
export function categorizeProduct(product) {
  const haystack = [product.productType, ...(product.tags || [])]
    .filter(Boolean)
    .map((s) => s.toLowerCase());

  for (const [collection, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (haystack.some((value) => keywords.some((keyword) => value.includes(keyword)))) {
      return collection;
    }
  }

  return null;
}

/**
 * Normalizes a raw Storefront API (or mock) product node into the flat
 * shape components should consume, so UI code never has to unwrap
 * `edges`/`node` GraphQL connections.
 */
export function normalizeProduct(raw) {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    descriptionHtml: raw.descriptionHtml,
    productType: raw.productType,
    tags: raw.tags || [],
    availableForSale: raw.availableForSale,
    collection: categorizeProduct(raw),
    price: raw.priceRange?.minVariantPrice?.amount ?? raw.variants?.edges?.[0]?.node?.price?.amount,
    currencyCode:
      raw.priceRange?.minVariantPrice?.currencyCode ?? raw.variants?.edges?.[0]?.node?.price?.currencyCode ?? 'USD',
    images: (raw.images?.edges || []).map((edge) => edge.node),
    variants: (raw.variants?.edges || []).map((edge) => edge.node),
  };
}

// ---------------------------------------------------------------------------
// Public data-access functions -- these are what pages/components import.
// ---------------------------------------------------------------------------

export async function getAllProducts({ first = 100 } = {}) {
  if (!isLiveConfigured) {
    return MOCK_PRODUCTS.map(normalizeProduct);
  }

  const data = await shopifyFetch({ query: ALL_PRODUCTS_QUERY, variables: { first } });
  return data.products.edges.map((edge) => normalizeProduct(edge.node));
}

export async function getProductsByCollection(collection) {
  const products = await getAllProducts();
  return products.filter((product) => product.collection === collection);
}

export async function getProductByHandle(handle) {
  if (!isLiveConfigured) {
    const match = MOCK_PRODUCTS.find((product) => product.handle === handle);
    return match ? normalizeProduct(match) : null;
  }

  const data = await shopifyFetch({ query: PRODUCT_BY_HANDLE_QUERY, variables: { handle } });
  return data.product ? normalizeProduct(data.product) : null;
}

export function isUsingMockData() {
  return !isLiveConfigured;
}

// ---------------------------------------------------------------------------
// Mock catalog -- shaped exactly like Storefront API product nodes so
// normalizeProduct() and every consumer works identically against either
// source. Replace with real inventory once SHOPIFY_STORE_DOMAIN /
// SHOPIFY_STOREFRONT_ACCESS_TOKEN are set.
// ---------------------------------------------------------------------------

const PLACEHOLDER_IMAGE = (seed, w = 1200, h = 1500) =>
  `https://cdn.shopify.com/s/files/placeholder/${seed}.jpg?width=${w}&height=${h}`;

const MOCK_PRODUCTS = [
  {
    id: 'gid://shopify/Product/mock-dress-1',
    handle: 'the-aftermath-slip-dress',
    title: 'The Aftermath Slip Dress',
    description: 'A bias-cut satin slip built to move like it has somewhere to be.',
    descriptionHtml: '<p>A bias-cut satin slip built to move like it has somewhere to be.</p>',
    productType: 'Dresses',
    tags: ['dresses', 'new-arrival', 'bestseller'],
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '298.00', currencyCode: 'USD' } },
    images: {
      edges: [
        { node: { url: PLACEHOLDER_IMAGE('dress-1-a'), altText: 'The Aftermath Slip Dress, front', width: 1200, height: 1500 } },
        { node: { url: PLACEHOLDER_IMAGE('dress-1-b'), altText: 'The Aftermath Slip Dress, back', width: 1200, height: 1500 } },
      ],
    },
    variants: {
      edges: [
        { node: { id: 'gid://shopify/ProductVariant/mock-dress-1-xs', title: 'XS', availableForSale: true, price: { amount: '298.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'XS' }] } },
        { node: { id: 'gid://shopify/ProductVariant/mock-dress-1-s', title: 'S', availableForSale: true, price: { amount: '298.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'S' }] } },
        { node: { id: 'gid://shopify/ProductVariant/mock-dress-1-m', title: 'M', availableForSale: true, price: { amount: '298.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'M' }] } },
        { node: { id: 'gid://shopify/ProductVariant/mock-dress-1-l', title: 'L', availableForSale: false, price: { amount: '298.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'L' }] } },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/mock-dress-2',
    handle: 'too-good-to-keep-quiet-gown',
    title: 'Too Good To Keep Quiet Gown',
    description: 'Architectural draping, one shoulder, zero apologies.',
    descriptionHtml: '<p>Architectural draping, one shoulder, zero apologies.</p>',
    productType: 'Dresses',
    tags: ['dresses', 'evening'],
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '412.00', currencyCode: 'USD' } },
    images: {
      edges: [
        { node: { url: PLACEHOLDER_IMAGE('dress-2-a'), altText: 'Too Good To Keep Quiet Gown, front', width: 1200, height: 1500 } },
        { node: { url: PLACEHOLDER_IMAGE('dress-2-b'), altText: 'Too Good To Keep Quiet Gown, detail', width: 1200, height: 1500 } },
      ],
    },
    variants: {
      edges: [
        { node: { id: 'gid://shopify/ProductVariant/mock-dress-2-s', title: 'S', availableForSale: true, price: { amount: '412.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'S' }] } },
        { node: { id: 'gid://shopify/ProductVariant/mock-dress-2-m', title: 'M', availableForSale: true, price: { amount: '412.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'M' }] } },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/mock-heel-1',
    handle: 'high-voltage-stiletto',
    title: 'High-Voltage Stiletto',
    description: 'A 100mm heel engineered for exits, not just entrances.',
    descriptionHtml: '<p>A 100mm heel engineered for exits, not just entrances.</p>',
    productType: 'Heels',
    tags: ['heels', 'bestseller'],
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '345.00', currencyCode: 'USD' } },
    images: {
      edges: [
        { node: { url: PLACEHOLDER_IMAGE('heel-1-a'), altText: 'High-Voltage Stiletto, side', width: 1200, height: 1500 } },
        { node: { url: PLACEHOLDER_IMAGE('heel-1-b'), altText: 'High-Voltage Stiletto, pair', width: 1200, height: 1500 } },
      ],
    },
    variants: {
      edges: [
        { node: { id: 'gid://shopify/ProductVariant/mock-heel-1-6', title: '6', availableForSale: true, price: { amount: '345.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: '6' }] } },
        { node: { id: 'gid://shopify/ProductVariant/mock-heel-1-7', title: '7', availableForSale: true, price: { amount: '345.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: '7' }] } },
        { node: { id: 'gid://shopify/ProductVariant/mock-heel-1-8', title: '8', availableForSale: true, price: { amount: '345.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: '8' }] } },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/mock-heel-2',
    handle: 'speak-first-pump',
    title: 'Speak First Pump',
    description: 'Point-toe, low-cut vamp, the kind of quiet that gets noticed.',
    descriptionHtml: '<p>Point-toe, low-cut vamp, the kind of quiet that gets noticed.</p>',
    productType: 'Heels',
    tags: ['heels', 'new-arrival'],
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '295.00', currencyCode: 'USD' } },
    images: {
      edges: [
        { node: { url: PLACEHOLDER_IMAGE('heel-2-a'), altText: 'Speak First Pump, side', width: 1200, height: 1500 } },
        { node: { url: PLACEHOLDER_IMAGE('heel-2-b'), altText: 'Speak First Pump, top', width: 1200, height: 1500 } },
      ],
    },
    variants: {
      edges: [
        { node: { id: 'gid://shopify/ProductVariant/mock-heel-2-7', title: '7', availableForSale: true, price: { amount: '295.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: '7' }] } },
        { node: { id: 'gid://shopify/ProductVariant/mock-heel-2-8', title: '8', availableForSale: false, price: { amount: '295.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: '8' }] } },
      ],
    },
  },
];
