import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');
const BASE_URL = __ENV.BASE_URL || 'https://demo.prestashop.com/';

export const options = {
  vus: 5,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    errors: ['rate<0.1'],
  },
};

export default function () {
  const home = http.get(BASE_URL);
  const homeOk = check(home, {
    'home status 200': (r) => r.status === 200,
  });
  if (!homeOk) errorRate.add(1);

  sleep(2);
}
