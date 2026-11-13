const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');

function load(file, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  vm.runInThisContext(`(function(require,module,exports){${js}\n})`, { filename: file })(
    name => name in mocks ? mocks[name] : require(name), module, module.exports);
  return module.exports;
}
const next = { NextResponse: { json: (data, init) => Response.json(data, init) } };
const jobId = 'a1f9aeba-bb00-4a0d-8eaa-bf3112095ae4';
const image = 'b1f9aeba-bb00-4a0d-8eaa-bf3112095ae4';
const secret = 'test-callback-secret';
function signedRequest(payload, seconds = Math.floor(Date.now()/1000)) {
  const body = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', secret).update(`${seconds}.${body}`).digest('hex');
  return new Request('https://example.com/api/generate-callback', { method: 'POST', body,
    headers: { 'x-generation-timestamp': String(seconds), 'x-generation-signature': signature } });
}

test('callback rejects unsigned/expired bodies and prevents replay writes', async () => {
  process.env.GENERATION_CALLBACK_SECRET = secret;
  let pending = jobId, completed = null, writes = 0, images = [];
  const db = { user: {
    updateMany: async ({ where, data }) => {
      if (where.id !== 'user' || where.pendingGenerationId !== pending) return { count: 0 };
      pending = data.pendingGenerationId; completed = data.completedGenerationId;
      images = data.generatedImages.set; writes++; return { count: 1 };
    },
    findFirst: async ({where}) => where.id === 'user' && where.completedGenerationId === completed ? {id:'user'} : null,
  } };
  const {POST} = load('src/app/api/generate-callback/route.ts', {
    'next/server': next, '@/lib/db': db, '@/lib/generation-auth': load('src/lib/generation-auth.ts'),
  });
  const payload = {userId:'user', jobId, generatedUuids:[image]};
  assert.equal((await POST(new Request('https://example.com', {method:'POST', body:JSON.stringify(payload)}))).status,401);
  assert.equal((await POST(signedRequest(payload, 1))).status,401);
  assert.equal((await POST(signedRequest({...payload, generatedUuids:[]}))).status,400);
  assert.equal((await POST(signedRequest({...payload, userId:'other'}))).status,409);
  assert.equal(writes,0);
  const response = await POST(signedRequest(payload));
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{success:true});
  assert.deepEqual(images,[image]);
  assert.equal((await POST(signedRequest(payload))).status,200);
  assert.equal(writes,1);
  delete process.env.GENERATION_CALLBACK_SECRET;
  assert.equal((await POST(signedRequest(payload))).status,401);
});

test('image deletion requires ownership and persists removal only after storage succeeds', async () => {
  let session = null, owned = [image], removes = 0, storageCalls = 0;
  const db = { user: {findUnique: async () => ({generatedImages: owned})},
    $executeRaw: async (_strings, uuid, id) => { assert.equal(id,'user'); owned=owned.filter(x=>x!==uuid); removes++; } };
  const originalFetch = global.fetch;
  let storageOk = true;
  global.fetch = async () => {storageCalls++; return new Response('',{status:storageOk ? 200 : 500});};
  try {
    const route = load('src/app/api/my-images/route.ts', {'next/server':next, '@/lib/db':db,
      '@/lib/auth-no-edge':{auth:async()=>session}, '@/lib/uploadcare':{createSignedHeaders:()=>({}),md5hash:()=>''}});
    const req = () => new Request(`https://example.com/api/my-images?uuid=${image}`);
    assert.equal((await route.DELETE(req())).status,401);
    assert.equal((await route.GET(req())).status,401);
    session = {user:{id:'user'}};
    owned=[];
    assert.equal((await route.DELETE(req())).status,403);
    assert.equal(storageCalls,0);
    owned=[image]; storageOk=false;
    assert.equal((await route.DELETE(req())).status,500);
    assert.equal(removes,0);
    storageOk=true;
    assert.equal((await route.DELETE(req())).status,200);
    assert.equal(removes,1);
    assert.deepEqual(await (await route.GET(req())).json(),{generatedImages:[]});
  } finally { global.fetch=originalFetch; }
});

test('legacy uploadcare route delegates owner checks and disables arbitrary writes', async () => {
  const GET=()=>{}, DELETE=()=>{};
  const route=load('src/app/api/uploadcare/route.ts', {'../my-images/route':{GET,DELETE}});
  assert.equal(route.GET,GET); assert.equal(route.DELETE,DELETE);
  assert.equal((await route.POST()).status,410);
});
