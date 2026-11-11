import assert from 'node:assert/strict';
import { test } from 'node:test';

const currentKey = 'helptec_tickets_v3';
const legacyKey = 'helptec_tickets_v2';
const realTicket = {
  id: 'TICK-1024', title: 'Chamado cadastrado na apresentação', category: 'Software',
  details: 'Descrição real', createdAt: '06/11/2026, 10:00',
  createdAtTimestamp: new Date(2026, 10, 6, 10).getTime(),
  author: 'Usuário', authorUsername: 'usuario', status: 'Aberto',
};
const sample = { ...realTicket, createdAt: '12/02/2026, 09:30', title: 'Exemplo editado' };
let importNumber = 0;

function storage(values: Record<string, string> = {}) {
  const data = new Map(Object.entries(values));
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => data.set(key, value),
    },
  });
  return data;
}

async function reload() {
  const module = await import(`../src/store/ticketSlice.ts?test=${importNumber++}`);
  return { ...module, state: module.default(undefined, { type: 'test/init' }) };
}

test('starts empty and keeps a saved empty list after reload', async () => {
  const data = storage();
  assert.deepEqual((await reload()).state.tickets, []);
  data.set(currentKey, '[]');
  data.set(legacyKey, JSON.stringify([sample]));
  assert.deepEqual((await reload()).state.tickets, []);
  assert.deepEqual((await reload()).state.tickets, []);
  assert.equal(data.get(currentKey), '[]');
});

test('removes known samples from both keys and preserves real tickets with a colliding ID', async () => {
  const data = storage({
    [currentKey]: JSON.stringify([sample, realTicket]),
    [legacyKey]: JSON.stringify([sample, { ...realTicket, id: 'TICK-9001' }]),
    helptec_theme_mode: 'dark', unrelated: 'preserve me',
  });
  const { state } = await reload();
  assert.deepEqual(state.tickets, [realTicket]);
  assert.deepEqual(JSON.parse(data.get(currentKey)!), [realTicket]);
  assert.deepEqual(JSON.parse(data.get(legacyKey)!), [{ ...realTicket, id: 'TICK-9001' }]);
  assert.equal(data.get('helptec_theme_mode'), 'dark');
  assert.equal(data.get('unrelated'), 'preserve me');
});

test('migrates legacy-only tickets without changing their author', async () => {
  const ticket = { ...realTicket, author: 'Administrador', authorUsername: undefined };
  const data = storage({ [legacyKey]: JSON.stringify([sample, ticket]) });
  const expected = [{ ...ticket, authorUsername: 'admin' }];
  assert.deepEqual((await reload()).state.tickets, expected);
  assert.deepEqual(JSON.parse(data.get(currentKey)!), expected);
});

test('does not overwrite malformed stored data with an empty list or legacy data', async (context) => {
  const warning = context.mock.method(console, 'warn', () => {});
  const data = storage({ [currentKey]: '{invalid', [legacyKey]: JSON.stringify([realTicket]) });
  assert.deepEqual((await reload()).state.tickets, []);
  assert.equal(data.get(currentKey), '{invalid');
  assert.equal(warning.mock.callCount(), 1);
  data.set(currentKey, JSON.stringify([{ id: 'TICK-9999', author: 'Usuário' }]));
  const malformed = data.get(currentKey);
  assert.deepEqual((await reload()).state.tickets, []);
  assert.equal(data.get(currentKey), malformed);
});

test('storage failures do not crash or replace readable tickets', async (context) => {
  context.mock.method(console, 'warn', () => {});
  storage({ [currentKey]: JSON.stringify([realTicket]) });
  localStorage.setItem = () => { throw new Error('Storage full'); };
  assert.deepEqual((await reload()).state.tickets, [realTicket]);
  localStorage.getItem = () => { throw new Error('Storage unavailable'); };
  assert.deepEqual((await reload()).state.tickets, []);
});

test('create, edit and delete survive reload, including deleting the final ticket', async () => {
  const data = storage();
  let module = await reload();
  let state = module.default(module.state, module.addTicket({
    title: 'Novo chamado', category: 'Hardware', details: 'Detalhes',
    author: 'Usuário', authorUsername: 'usuario',
  }));
  assert.equal(state.tickets.length, 1);
  const id = state.tickets[0].id;
  module = await reload();
  assert.equal(module.state.tickets[0].title, 'Novo chamado');
  state = module.default(module.state, module.editTicket({ id, title: 'Editado', category: 'Software', details: 'Atualizado' }));
  module = await reload();
  assert.equal(module.state.tickets[0].title, 'Editado');
  assert.equal(module.state.tickets[0].details, 'Atualizado');
  module.default(module.state, module.deleteTicket(id));
  assert.deepEqual((await reload()).state.tickets, []);
  assert.equal(data.get(currentKey), '[]');
});
