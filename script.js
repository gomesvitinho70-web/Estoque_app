// ---- Armazenamento ----
const STORAGE_KEY = 'estoque:produtos';

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Erro ao carregar produtos do armazenamento local:', err);
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

let products = loadProducts();
let editingId = null;

// ---- Referências do DOM ----
const form = document.getElementById('productForm');
const productIdInput = document.getElementById('productId');
const nameInput = document.getElementById('name');
const codeInput = document.getElementById('code');
const quantityInput = document.getElementById('quantity');
const minQuantityInput = document.getElementById('minQuantity');
const priceInput = document.getElementById('price');

const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const productsBody = document.getElementById('productsBody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');

const statCount = document.getElementById('statCount');
const statUnits = document.getElementById('statUnits');
const statValue = document.getElementById('statValue');

// ---- Utilitários ----
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ---- Renderização ----
function render() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term)
  );

  productsBody.innerHTML = '';

  filtered
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    .forEach(p => {
      const isLow = p.minQuantity != null && p.quantity <= p.minQuantity;
      const subtotal = p.quantity * p.price;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="code-cell">${escapeHtml(p.code)}</td>
        <td>${escapeHtml(p.name)}</td>
        <td class="qty-cell">${p.quantity}</td>
        <td class="qty-cell">${p.minQuantity != null ? p.minQuantity : '—'}</td>
        <td class="price-cell">${formatCurrency(p.price)}</td>
        <td class="subtotal-cell">${formatCurrency(subtotal)}</td>
        <td>
          <span class="tag ${isLow ? 'tag--low' : 'tag--ok'}">
            ${isLow ? 'estoque baixo' : 'ok'}
          </span>
        </td>
        <td>
          <div class="row-actions">
            <button class="btn--small" data-action="edit" data-id="${p.id}">Editar</button>
            <button class="btn--small btn--danger" data-action="delete" data-id="${p.id}">Remover</button>
          </div>
        </td>
      `;
      productsBody.appendChild(tr);
    });

  emptyState.hidden = products.length !== 0;

  updateStats();
}

function updateStats() {
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  statCount.textContent = products.length;
  statUnits.textContent = totalUnits;
  statValue.textContent = formatCurrency(totalValue);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Formulário: cadastrar / editar ----
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    name: nameInput.value.trim(),
    code: codeInput.value.trim(),
    quantity: Number(quantityInput.value),
    minQuantity: minQuantityInput.value === '' ? null : Number(minQuantityInput.value),
    price: priceInput.value === '' ? 0 : Number(priceInput.value),
  };

  if (!data.name || !data.code) return;

  if (editingId) {
    products = products.map(p => p.id === editingId ? { ...p, ...data } : p);
  } else {
    products.push({ id: generateId(), ...data });
  }

  saveProducts(products);
  resetForm();
  render();
});

function startEdit(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  editingId = id;
  productIdInput.value = id;
  nameInput.value = product.name;
  codeInput.value = product.code;
  quantityInput.value = product.quantity;
  minQuantityInput.value = product.minQuantity ?? '';
  priceInput.value = product.price;

  formTitle.textContent = `Editando: ${product.name}`;
  submitBtn.textContent = 'Salvar alterações';
  cancelEditBtn.hidden = false;

  nameInput.focus();
}

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = 'Novo produto';
  submitBtn.textContent = 'Cadastrar produto';
  cancelEditBtn.hidden = true;
}

cancelEditBtn.addEventListener('click', resetForm);

// ---- Ações na tabela (editar / remover) ----
productsBody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const { action, id } = btn.dataset;

  if (action === 'edit') {
    startEdit(id);
  }

  if (action === 'delete') {
    const product = products.find(p => p.id === id);
    const confirmed = confirm(`Remover "${product?.name}" do estoque?`);
    if (!confirmed) return;

    products = products.filter(p => p.id !== id);
    saveProducts(products);
    if (editingId === id) resetForm();
    render();
  }
});

// ---- Busca ----
searchInput.addEventListener('input', render);

// ---- Inicialização ----
render();
