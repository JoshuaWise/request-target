'use strict';

const fake = exports;
const fakeRequest = () => ({
	url: fake.choose(0.8) ? fake.path() : fake.url(),
	headers: { host: fake.host() },
	method: fake.method(),
});

const count = this.count;
requests = new Array(count);

for (let i = 0; i < count; ++i) {
  requests[i] = fakeRequest();
}

iteration = count;

if (typeof global.gc === 'function') {
  global.gc();
}
