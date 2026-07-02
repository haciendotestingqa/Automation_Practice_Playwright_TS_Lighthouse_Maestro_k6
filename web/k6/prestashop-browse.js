import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');
const BASE_URL = __ENV.BASE_URL || 'https://demo.prestashop.com/';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '2m', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    errors: ['rate<0.05'],
  },
};

export default function () {
  const pages = [BASE_URL, `${BASE_URL}#/en/`];

  for (const url of pages) {
    const res = http.get(url);
    const ok = check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 3s': (r) => r.timings.duration < 3000,
    });
    if (!ok) errorRate.add(1);
    sleep(1);
  }
}
