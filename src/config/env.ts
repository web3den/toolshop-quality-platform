/**
 * Single source of truth for target environments.
 *
 * The framework can point at three deployments of the same product:
 *  - production: the stable public Toolshop instance (default)
 *  - with-bugs:  the intentionally broken build, used by the @bug-sensitive
 *                lane to prove the suite is falsifiable (tests MUST fail there)
 *  - local:      docker-compose deployment for hermetic CI runs
 */
export type TargetName = 'production' | 'with-bugs' | 'local';

export interface TargetConfig {
  name: TargetName;
  uiBaseUrl: string;
  apiBaseUrl: string;
  /** Seeded credentials shipped with the product's database seeder. */
  users: {
    customer: { email: string; password: string };
    admin: { email: string; password: string };
  };
}

const SEEDED_USERS = {
  customer: { email: 'customer@practicesoftwaretesting.com', password: 'welcome01' },
  admin: { email: 'admin@practicesoftwaretesting.com', password: 'welcome01' },
} as const;

const TARGETS: Record<TargetName, TargetConfig> = {
  production: {
    name: 'production',
    uiBaseUrl: 'https://practicesoftwaretesting.com',
    apiBaseUrl: 'https://api.practicesoftwaretesting.com',
    users: SEEDED_USERS,
  },
  'with-bugs': {
    name: 'with-bugs',
    uiBaseUrl: 'https://with-bugs.practicesoftwaretesting.com',
    apiBaseUrl: 'https://api-with-bugs.practicesoftwaretesting.com',
    users: SEEDED_USERS,
  },
  local: {
    name: 'local',
    uiBaseUrl: process.env.LOCAL_UI_URL ?? 'http://localhost:4200',
    apiBaseUrl: process.env.LOCAL_API_URL ?? 'http://localhost:8091',
    users: SEEDED_USERS,
  },
};

export function resolveTarget(): TargetConfig {
  const raw = (process.env.TARGET ?? 'production').trim() as TargetName;
  const target = TARGETS[raw];
  if (!target) {
    throw new Error(
      `Unknown TARGET "${raw}". Valid targets: ${Object.keys(TARGETS).join(', ')}`,
    );
  }
  return target;
}

export const target = resolveTarget();
