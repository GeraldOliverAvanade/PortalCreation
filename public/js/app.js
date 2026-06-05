const form = document.getElementById('item-form');
const formMessage = document.getElementById('form-message');
const loadBtn = document.getElementById('load-btn');
const itemsList = document.getElementById('items-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('item-name').value.trim();
  const description = document.getElementById('item-desc').value.trim();

  try {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    const data = await res.json();
    formMessage.textContent = res.ok ? 'Item added!' : data.error;
    formMessage.style.color = res.ok ? 'green' : 'red';
    if (res.ok) form.reset();
  } catch {
    formMessage.textContent = 'Request failed.';
    formMessage.style.color = 'red';
  }
});

loadBtn.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/items');
    const items = await res.json();
    itemsList.innerHTML = items.length
      ? items.map(i => `<li><strong>${i.name}</strong> — ${i.description}</li>`).join('')
      : '<li>No items found.</li>';
  } catch {
    itemsList.innerHTML = '<li>Failed to load items.</li>';
  }
});
