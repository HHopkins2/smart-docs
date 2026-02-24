import type { Frontmatter } from './index';

export type VaultObjectType =
  | 'note'
  | 'task'
  | 'workflow'
  | 'project'
  | 'spec'
  | 'decision'
  | 'runbook'
  | 'skill'
  | 'meeting'
  | 'reference';

export interface VaultFrontmatter extends Frontmatter {
  objectType?: VaultObjectType;
  schemaVersion?: string;
  tags?: string[];
  status?: string;
}

export interface VaultObjectClassification {
  type: VaultObjectType;
  label: string;
  tone: 'neutral' | 'blue' | 'green' | 'amber' | 'purple';
  source: 'frontmatter' | 'path' | 'default';
}

const KNOWN_TYPES: VaultObjectType[] = [
  'note',
  'task',
  'workflow',
  'project',
  'spec',
  'decision',
  'runbook',
  'skill',
  'meeting',
  'reference',
];

const PATH_HINTS: Array<{ contains: string; type: VaultObjectType }> = [
  { contains: '/tasks/', type: 'task' },
  { contains: '/workflows/', type: 'workflow' },
  { contains: '/projects/', type: 'project' },
  { contains: '/specs/', type: 'spec' },
  { contains: '/decisions/', type: 'decision' },
  { contains: '/runbooks/', type: 'runbook' },
  { contains: '/skills/', type: 'skill' },
  { contains: '/meetings/', type: 'meeting' },
  { contains: '/reference/', type: 'reference' },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isVaultObjectType(value: unknown): value is VaultObjectType {
  return typeof value === 'string' && KNOWN_TYPES.includes(value as VaultObjectType);
}

export function toVaultFrontmatter(frontmatter: Frontmatter | null): VaultFrontmatter {
  if (!isRecord(frontmatter)) {
    return {};
  }

  const objectType = isVaultObjectType(frontmatter.objectType) ? frontmatter.objectType : undefined;
  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.filter((tag): tag is string => typeof tag === 'string')
    : undefined;

  return {
    ...frontmatter,
    objectType,
    tags,
    schemaVersion: typeof frontmatter.schemaVersion === 'string' ? frontmatter.schemaVersion : undefined,
    status: typeof frontmatter.status === 'string' ? frontmatter.status : undefined,
  };
}

function toLabel(type: VaultObjectType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function toneForType(type: VaultObjectType): VaultObjectClassification['tone'] {
  switch (type) {
    case 'task':
      return 'amber';
    case 'workflow':
    case 'runbook':
      return 'purple';
    case 'project':
    case 'spec':
      return 'blue';
    case 'decision':
    case 'meeting':
      return 'green';
    default:
      return 'neutral';
  }
}

export function classifyVaultObject(path: string, frontmatter: Frontmatter | null): VaultObjectClassification {
  const typed = toVaultFrontmatter(frontmatter);

  if (typed.objectType) {
    return {
      type: typed.objectType,
      label: toLabel(typed.objectType),
      tone: toneForType(typed.objectType),
      source: 'frontmatter',
    };
  }

  const normalizedPath = `/${path.replace(/\\/g, '/').toLowerCase()}`;
  const pathMatch = PATH_HINTS.find((hint) => normalizedPath.includes(hint.contains));

  if (pathMatch) {
    return {
      type: pathMatch.type,
      label: toLabel(pathMatch.type),
      tone: toneForType(pathMatch.type),
      source: 'path',
    };
  }

  return {
    type: 'note',
    label: 'Note',
    tone: 'neutral',
    source: 'default',
  };
}
