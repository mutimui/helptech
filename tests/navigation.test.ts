import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { ActiveScreen, User } from '../src/types/index.ts';

let importNumber = 0;

async function restore(role: User['role'] | null, screen: ActiveScreen) {
  const data = new Map([
    ['helptec_screen', screen],
    ['helptec_tickets_v3', '["preserve existing tickets"]'],
    ['helptec_theme_mode', 'dark'],
  ]);
  if (role) data.set('helptec_auth', JSON.stringify({
    isAuthenticated: true,
    currentUser: { username: role, name: role, role },
  }));
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => data.set(key, value),
    },
  });
  const module = await import(`../src/store/navigationSlice.ts?test=${importNumber++}`);
  return { module, state: module.default(undefined, { type: 'test/init' }), data };
}

test('restoring requester screens as admin opens management and preserves stored data', async () => {
  for (const screen of ['abrir-chamado', 'meus-chamados'] as const) {
    const { state, data } = await restore('admin', screen);
    assert.equal(state.currentScreen, 'todos-chamados');
    assert.equal(data.get('helptec_tickets_v3'), '["preserve existing tickets"]');
    assert.equal(data.get('helptec_theme_mode'), 'dark');
  }
});

test('requester screens still restore for the standard user after switching profiles', async () => {
  await restore('admin', 'abrir-chamado');
  for (const screen of ['inicio', 'abrir-chamado', 'meus-chamados'] as const) {
    assert.equal((await restore('usuario', screen)).state.currentScreen, screen);
  }
  assert.equal((await restore(null, 'abrir-chamado')).state.currentScreen, 'login');
});

test('admin management screens remain available and standard users cannot restore them', async () => {
  for (const screen of ['inicio', 'todos-chamados', 'chamados-concluidos', 'analises'] as const) {
    assert.equal((await restore('admin', screen)).state.currentScreen, screen);
    if (screen !== 'inicio') {
      assert.equal((await restore('usuario', screen)).state.currentScreen, 'inicio');
    }
  }
});

test('live navigation uses the same role guard without changing standard-user screens', async () => {
  const { module } = await restore('admin', 'inicio');
  for (const screen of ['abrir-chamado', 'meus-chamados'] as const) {
    assert.equal(module.getAccessibleScreen(screen, true), 'todos-chamados');
    assert.equal(module.getAccessibleScreen(screen, false), screen);
  }
  for (const screen of ['inicio', 'todos-chamados', 'chamados-concluidos', 'analises'] as const) {
    assert.equal(module.getAccessibleScreen(screen, true), screen);
  }
});
