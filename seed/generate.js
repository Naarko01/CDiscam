// Génère les jeux de données de test au format Extended JSON (compatible mongoimport --jsonArray).
// Usage : node seed/generate.js
const fs = require('fs');
const path = require('path');

const oid = (type, n) => ({ $oid: `665f1a2b3c${type}${String(n).padStart(12, '0')}` });
const T = { user: '01', product: '02', cart: '03', order: '04' };
const d = (s) => new Date(s);
const r2 = (n) => Math.round(n * 100) / 100;
const HASH = '$2b$12$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345'; // faux hash, mot de passe de test


// ---------- USERS ----------
const userDefs = [
  ['Claire', 'Martin', '+33612345601', ['12 rue des Lilas', 'Lyon', '69003']],
  ['Thomas', 'Bernard', '+33612345602', ['5 avenue Jean Jaurès', 'Paris', '75019']],
  ['Sophie', 'Dubois', '+33612345603', ['27 cours Mirabeau', 'Aix-en-Provence', '13100']],
  ['Lucas', 'Petit', '+33612345604', ['8 rue Sainte-Catherine', 'Bordeaux', '33000']],
  ['Emma', 'Robert', '+33612345605', ['14 place Stanislas', 'Nancy', '54000']],
  ['Hugo', 'Richard', '+33612345606', ['3 quai de la Fosse', 'Nantes', '44000']],
  ['Camille', 'Moreau', '+33612345607', ['41 rue Nationale', 'Lille', '59800']],
  ['Nathan', 'Simon', '+33612345608', ['9 rue du Bât-d\'Argent', 'Lyon', '69001']],
  ['Léa', 'Laurent', '+33612345609', ['22 boulevard Gambetta', 'Toulouse', '31000']],
  ['Antoine', 'Lefebvre', '+33612345610', ['16 rue de la République', 'Strasbourg', '67000']],
];
const strip = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function generateAge() {
  const min = Math.ceil(18)
  const max = Math.floor(71)
  return Math.floor(Math.random() * (max - min) + min)
}

const users = userDefs.map(([firstName, lastName, phone, [street, city, postalCode]], i) => {
  const n = i + 1;
  const addresses = [
    { label: 'Domicile', street, city, postalCode, country: 'FR', isDefaultShipping: true, isDefaultBilling: true },
  ];
  if (n % 3 === 0) {
    addresses.push({
      label: 'Bureau', street: '100 avenue des Champs', city, postalCode, country: 'FR',
      isDefaultShipping: false, isDefaultBilling: false,
    });
  }
  return {
    _id: oid(T.user, n),
    email: `${strip(firstName)}.${strip(lastName)}@example.com`,
    passwordHash: HASH,
    firstName, lastName, phone,
    age: generateAge(),
    role: 'customer',
    addresses,
    preferences: { newsletter: n % 2 === 1, language: 'fr', currency: 'EUR' },
    isActive: true,
    emailVerified: n !== 7,
    lastLoginAt: d(`2026-10-${String(20 + n).padStart(2, '0')}T18:${String(10 + n).padStart(2, '0')}:00Z`),
    createdAt: d(`2025-0${(n % 9) + 1}-1${n % 9}T09:15:00Z`),
    updatedAt: d(`2026-10-${String(20 + n).padStart(2, '0')}T18:${String(10 + n).padStart(2, '0')}:00Z`),
  };
});

// ---------- PRODUCTS ----------
// price = TTC (TVA 20 %). variants : [suffixe SKU, libellé, attributs, stock]
const productDefs = [
  ['TSH-BLK', 'T-shirt coton bio noir', 'EcoWear', ['vetements', 't-shirts'], ['bio', 'coton', 'unisexe'], 24.90, 29.90,
    'T-shirt unisexe 100 % coton biologique, coupe regular.', { material: 'Coton bio', weightGrams: 180, origin: 'Portugal' },
    [['S', 'Taille S', { size: 'S', color: 'Noir' }, 30], ['M', 'Taille M', { size: 'M', color: 'Noir' }, 50], ['L', 'Taille L', { size: 'L', color: 'Noir' }, 40]]],
  ['JEA-SLM', 'Jean slim brut indigo', 'Denimia', ['vetements', 'jeans'], ['denim', 'slim'], 59.90, null,
    'Jean slim en denim brut stretch, taille mi-haute.', { material: 'Coton/élasthanne', weightGrams: 650, origin: 'Turquie' },
    [['38', 'Taille 38', { size: '38', color: 'Indigo' }, 20], ['40', 'Taille 40', { size: '40', color: 'Indigo' }, 25], ['42', 'Taille 42', { size: '42', color: 'Indigo' }, 18]]],
  ['SNK-WHT', 'Sneakers cuir blanc', 'Stride', ['chaussures', 'sneakers'], ['cuir', 'urbain'], 89.90, 109.90,
    'Sneakers basses en cuir pleine fleur avec semelle gomme.', { material: 'Cuir', weightGrams: 900, origin: 'Portugal' },
    [['40', 'Pointure 40', { size: '40', color: 'Blanc' }, 12], ['42', 'Pointure 42', { size: '42', color: 'Blanc' }, 15], ['44', 'Pointure 44', { size: '44', color: 'Blanc' }, 8]]],
  ['PUL-MER', 'Pull col rond laine mérinos', 'NordKnit', ['vetements', 'pulls'], ['laine', 'merinos'], 79.00, null,
    'Pull en laine mérinos extra-fine, chaud et respirant.', { material: 'Laine mérinos', weightGrams: 420, origin: 'Italie' },
    [['M-GRY', 'Gris - M', { size: 'M', color: 'Gris' }, 22], ['L-NVY', 'Bleu marine - L', { size: 'L', color: 'Bleu marine' }, 18]]],
  ['AUD-HDP', 'Casque Bluetooth à réduction de bruit', 'Soniq', ['high-tech', 'audio'], ['bluetooth', 'casque'], 129.00, 149.00,
    'Casque sans fil, réduction active du bruit, 30 h d\'autonomie.', { batteryHours: 30, weightGrams: 260, warrantyMonths: 24 },
    [['BLK', 'Noir', { color: 'Noir' }, 40], ['SLV', 'Argent', { color: 'Argent' }, 25]]],
  ['AUD-SPK', 'Enceinte portable étanche', 'Soniq', ['high-tech', 'audio'], ['bluetooth', 'enceinte', 'etanche'], 59.99, null,
    'Enceinte Bluetooth IPX7, 12 h d\'autonomie.', { batteryHours: 12, weightGrams: 540, warrantyMonths: 24 },
    [['BLU', 'Bleu', { color: 'Bleu' }, 35], ['RED', 'Rouge', { color: 'Rouge' }, 30]]],
  ['BAG-URB', 'Sac à dos urbain 20 L', 'Carry', ['accessoires', 'sacs'], ['sac', 'ordinateur'], 49.90, null,
    'Sac à dos 20 L avec compartiment ordinateur 15 pouces.', { volumeLiters: 20, weightGrams: 700, origin: 'Vietnam' },
    [['BLK', 'Noir', { color: 'Noir' }, 60]]],
  ['BTL-ISO', 'Bouteille isotherme inox 750 ml', 'Hydro', ['maison', 'cuisine'], ['inox', 'isotherme'], 19.90, null,
    'Bouteille inox double paroi, 24 h au froid et 12 h au chaud.', { volumeMl: 750, weightGrams: 380, origin: 'Chine' },
    [['GRN', 'Vert', { color: 'Vert' }, 80], ['WHT', 'Blanc', { color: 'Blanc' }, 70]]],
  ['WTC-SMT', 'Montre connectée sport GPS', 'Pulse', ['high-tech', 'montres'], ['gps', 'sport'], 199.00, 229.00,
    'Montre GPS avec suivi cardiaque et 7 jours d\'autonomie.', { batteryDays: 7, weightGrams: 45, warrantyMonths: 24 },
    [['BLK', 'Noir', { color: 'Noir' }, 28], ['GRN', 'Vert', { color: 'Vert' }, 14]]],
  ['LMP-LED', 'Lampe de bureau LED dimmable', 'Lumia', ['maison', 'eclairage'], ['led', 'bureau'], 34.50, null,
    'Lampe LED articulée, 3 températures de couleur, port USB.', { powerWatts: 10, weightGrams: 800, origin: 'Chine' },
    [['WHT', 'Blanc', { color: 'Blanc' }, 45]]],
];

const slugify = (s) => strip(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const products = productDefs.map(([code, name, brand, categories, tags, amount, compareAt, description, attributes, variants], i) => {
  const n = i + 1;
  const vs = variants.map(([suf, label, attrs, stock]) => ({ sku: `${code}-${suf}`, label, ...attrs, stock }));
  return {
    _id: oid(T.product, n),
    sku: `${code}-001`,
    name,
    slug: slugify(name),
    description,
    brand,
    categories,
    tags,
    price: { amount, currency: 'EUR', vatRate: 0.2 },
    compareAtPrice: compareAt,
    stock: { quantity: vs.reduce((s, v) => s + v.stock, 0), reserved: n % 4, lowStockThreshold: 10 },
    variants: vs,
    attributes,
    images: [
      { url: `https://cdn.example.com/p/${slugify(name)}-1.jpg`, alt: `${name} - vue principale`, position: 1 },
      { url: `https://cdn.example.com/p/${slugify(name)}-2.jpg`, alt: `${name} - détail`, position: 2 },
    ],
    rating: { average: r2(4 + ((n * 7) % 10) / 10), count: 20 + n * 9 },
    isPublished: true,
    createdAt: d(`2025-01-${String(9 + n).padStart(2, '0')}T08:00:00Z`),
    updatedAt: d(`2026-10-0${(n % 9) + 1}T10:30:00Z`),
  };
});

// ---------- CARTS & ORDERS ----------
// [index utilisateur (null = invité), lignes [produit, variante, qté], coupon, statut commande, transporteur, méthode, paiement, date commande]
const orderDefs = [
  [1, [[1, 1, 2]], 'AUTOMNE10', 'delivered', 'Colissimo', 'standard', 'card', '2026-10-05T09:04:00Z'],
  [2, [[3, 1, 1], [8, 0, 1]], null, 'delivered', 'Chronopost', 'express', 'paypal', '2026-10-08T14:20:00Z'],
  [3, [[5, 0, 1]], 'AUTOMNE10', 'delivered', 'Colissimo', 'standard', 'card', '2026-10-11T11:45:00Z'],
  [4, [[2, 1, 1], [1, 2, 1]], null, 'shipped', 'Mondial Relay', 'relay', 'card', '2026-10-27T17:30:00Z'],
  [5, [[4, 1, 1]], 'BIENVENUE5', 'shipped', 'Colissimo', 'standard', 'card', '2026-10-28T10:10:00Z'],
  [6, [[6, 0, 2], [7, 0, 1]], null, 'processing', 'Colissimo', 'standard', 'paypal', '2026-10-30T08:55:00Z'],
  [7, [[9, 0, 1]], 'AUTOMNE10', 'paid', 'Chronopost', 'express', 'card', '2026-10-31T19:12:00Z'],
  [8, [[10, 0, 1], [8, 1, 2]], null, 'pending', 'Colissimo', 'standard', 'card', '2026-11-01T09:00:00Z'],
  [9, [[3, 2, 1]], null, 'cancelled', 'Colissimo', 'standard', 'card', '2026-10-15T13:00:00Z'],
  [10, [[5, 1, 1], [6, 1, 1]], 'BIENVENUE5', 'refunded', 'Colissimo', 'standard', 'card', '2026-10-18T16:40:00Z'],
  [null, [[1, 0, 1], [7, 0, 1]], null, 'delivered', 'Mondial Relay', 'relay', 'card', '2026-10-20T20:05:00Z'],
];

const guest = {
  email: 'visiteur.invite@example.com',
  sessionId: 'sess_9f3a7c1d2b4e',
  address: { fullName: 'Julien Garnier', street: '7 rue Victor Hugo', city: 'Rennes', postalCode: '35000', country: 'FR' },
};

const chains = {
  pending: ['pending'],
  paid: ['pending', 'paid'],
  processing: ['pending', 'paid', 'processing'],
  shipped: ['pending', 'paid', 'processing', 'shipped'],
  delivered: ['pending', 'paid', 'processing', 'shipped', 'delivered'],
  cancelled: ['pending', 'cancelled'],
  refunded: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded'],
};
const paymentStatus = { pending: 'pending', cancelled: 'failed', refunded: 'refunded' };
const shippingCost = { standard: 4.9, relay: 3.9, express: 9.9 };

const addHours = (date, h) => new Date(date.getTime() + h * 3600 * 1000);
const carts = [];
const orders = [];

orderDefs.forEach(([uIdx, lines, coupon, status, carrier, method, payMethod, orderDate], i) => {
  const n = i + 1;
  const user = uIdx ? users[uIdx - 1] : null;
  const placedAt = d(orderDate);

  const items = lines.map(([pIdx, vIdx, quantity]) => {
    const p = products[pIdx - 1];
    const v = p.variants[vIdx];
    return {
      productId: p._id,
      sku: v.sku,
      name: `${p.name} - ${v.label}`,
      unitPrice: p.price.amount,
      quantity,
      lineTotal: r2(p.price.amount * quantity),
    };
  });
  const subtotal = r2(items.reduce((s, it) => s + it.lineTotal, 0));
  const discount = coupon === 'AUTOMNE10' ? r2(subtotal * 0.1) : coupon === 'BIENVENUE5' ? 5 : 0;
  const shipping = method === 'standard' && subtotal - discount >= 60 ? 0 : shippingCost[method];
  const total = r2(subtotal - discount + shipping);
  const tax = r2((total * 0.2) / 1.2); // TVA incluse dans les prix TTC

  const cartCreated = addHours(placedAt, -2);
  carts.push({
    _id: oid(T.cart, n),
    userId: user ? user._id : null,
    sessionId: user ? null : guest.sessionId,
    status: 'converted',
    items: items.map(({ productId, sku, name, unitPrice, quantity }) => ({
      productId, sku, name, unitPrice, quantity, addedAt: addHours(cartCreated, 0.1),
    })),
    couponCode: coupon,
    totals: { subtotal, discount, currency: 'EUR' },
    createdAt: cartCreated,
    updatedAt: addHours(placedAt, -0.02),
    expiresAt: addHours(cartCreated, 24 * 30),
  });

  const addr = user
    ? { fullName: `${user.firstName} ${user.lastName}`, street: user.addresses[0].street, city: user.addresses[0].city, postalCode: user.addresses[0].postalCode, country: 'FR' }
    : guest.address;

  const chain = chains[status];
  const history = chain.map((s, k) => ({ status: s, at: addHours(placedAt, k === 0 ? 0 : k * 6) }));
  const at = (s) => history.find((h) => h.status === s)?.at;
  const shipped = chain.includes('shipped');

  orders.push({
    _id: oid(T.order, n),
    orderNumber: `CMD-2026-${String(480 + n).padStart(6, '0')}`,
    userId: user ? user._id : null,
    guestEmail: user ? null : guest.email,
    cartId: oid(T.cart, n),
    status,
    items: items.map((it) => ({ ...it, vatRate: 0.2 })),
    shippingAddress: addr,
    billingAddress: addr,
    payment: {
      method: payMethod,
      provider: payMethod === 'paypal' ? 'paypal' : 'stripe',
      transactionId: payMethod === 'paypal' ? `PAYID-${100000 + n * 137}` : `pi_3Q9x${String(n).padStart(2, '0')}ABC123`,
      status: paymentStatus[status] || 'paid',
      paidAt: at('paid') || null,
    },
    shipping: {
      carrier,
      method,
      cost: shipping,
      trackingNumber: shipped ? `6A${String(12345678900 + n)}` : null,
      shippedAt: at('shipped') || null,
      deliveredAt: at('delivered') || null,
    },
    totals: { subtotal, discount, shipping, tax, total, currency: 'EUR' },
    couponCode: coupon,
    statusHistory: history,
    createdAt: placedAt,
    updatedAt: history[history.length - 1].at,
  });
});

// ---------- ÉCRITURE ----------
const replacer = function (key, value) {
  const raw = this[key];
  return raw instanceof Date ? { $date: raw.toISOString() } : value;
};
const outDir = __dirname;
for (const [name, data] of Object.entries({ users, products, carts, orders })) {
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(data, replacer, 2) + '\n');
  console.log(`${name}.json : ${data.length} documents`);
}
