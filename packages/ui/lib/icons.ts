import { icons, type LucideIcon } from "lucide-react";

export interface IconDefinition {
  name: string;
  Icon: LucideIcon;
  keywords: string[];
}

const DEFAULT_ICON_SUGGESTIONS = [
  "LayoutDashboard",
  "House",
  "FolderKanban",
  "Folder",
  "FileText",
  "Users",
  "User",
  "Shield",
  "Mail",
  "Settings2",
  "Database",
  "Server",
  "Workflow",
  "Package",
  "Building2",
  "ChartColumn",
  "Calendar",
  "Bell",
  "Search",
  "Sparkles",
  "Circle",
  "Bolt",
];

const ICON_KEYWORD_ALIASES: Record<string, string> = {
  workspace: "LayoutDashboard",
  dashboard: "LayoutDashboard",
  home: "House",
  project: "FolderKanban",
  folder: "Folder",
  document: "FileText",
  doctype: "FileText",
  user: "Users",
  users: "Users",
  team: "Users",
  role: "Shield",
  permission: "Shield",
  security: "Shield",
  email: "Mail",
  mail: "Mail",
  gender: "VenusAndMars",
  settings: "Settings2",
  setting: "Settings2",
  connection: "Cable",
  connect: "Cable",
  database: "Database",
  report: "ChartColumn",
  chart: "ChartColumn",
  calendar: "Calendar",
  task: "BadgeCheck",
  server: "Server",
  workflow: "Workflow",
  bolt: "Bolt",
  lightning: "Bolt",
  sort: "ArrowUpDown",
  order: "ArrowUpDown",
  "fa-users": "Users",
  "fa-language": "Languages",
  "fa-sort-by-order": "ArrowUpDown",
  "fa-bolt": "Bolt",
};

type IndexedIconDefinition = IconDefinition & {
  normalizedKeywords: string[];
};

function isLucideIcon(value: unknown): value is LucideIcon {
  return typeof value === "object" && value !== null && "$$typeof" in value;
}

function normalizeIconKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/icon$/i, "")
    .replaceAll(/[^a-z0-9]+/g, "");
}

function uniqueValues(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  );
}

function humanizeIconName(name: string): string {
  return name.replaceAll(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function buildBaseKeywords(name: string): string[] {
  const humanizedName = humanizeIconName(name);

  return uniqueValues([
    name,
    `${name} Icon`,
    humanizedName,
    humanizedName.toLowerCase(),
    humanizedName.replaceAll(/\s+/g, "-").toLowerCase(),
    humanizedName.replaceAll(/\s+/g, "_").toLowerCase(),
  ]);
}

const aliasKeywordsByIconName = Object.entries(ICON_KEYWORD_ALIASES).reduce(
  (map, [alias, iconName]) => {
    const currentAliases = map.get(iconName) ?? [];
    currentAliases.push(alias);
    map.set(iconName, currentAliases);
    return map;
  },
  new Map<string, string[]>()
);

const indexedIconDefinitions: IndexedIconDefinition[] = Object.entries(icons)
  .filter(([, Icon]) => isLucideIcon(Icon))
  .map(([name, Icon]) => {
    const keywords = uniqueValues([
      ...buildBaseKeywords(name),
      ...(aliasKeywordsByIconName.get(name) ?? []),
    ]);

    return {
      name,
      Icon,
      keywords,
      normalizedKeywords: uniqueValues(keywords.map(normalizeIconKey)),
    };
  })
  .sort((left, right) => left.name.localeCompare(right.name));

const iconDefinitionByName = new Map(
  indexedIconDefinitions.map((definition) => [definition.name, definition])
);

const iconDefinitionByKeyword = new Map<string, IndexedIconDefinition>();

for (const definition of indexedIconDefinitions) {
  for (const keyword of definition.normalizedKeywords) {
    if (!iconDefinitionByKeyword.has(keyword)) {
      iconDefinitionByKeyword.set(keyword, definition);
    }
  }
}

export const TOTAL_ICON_COUNT = indexedIconDefinitions.length;
export const DEFAULT_ICON_NAME = "Circle";
export const ICON_DEFINITIONS: IconDefinition[] = indexedIconDefinitions.map(
  ({ normalizedKeywords: _normalizedKeywords, ...definition }) => definition
);

export function resolveIconDefinition(
  value?: string | null
): IconDefinition | null {
  if (!value) {
    return null;
  }

  const directMatch = iconDefinitionByKeyword.get(normalizeIconKey(value));

  if (directMatch) {
    return directMatch;
  }

  const fragments = value
    .split(/[^a-zA-Z0-9]+/)
    .map((fragment) => fragment.trim())
    .filter(Boolean);

  for (const fragment of fragments) {
    const fragmentMatch = iconDefinitionByKeyword.get(normalizeIconKey(fragment));

    if (fragmentMatch) {
      return fragmentMatch;
    }
  }

  return null;
}

export function getSuggestedIconDefinitions(limit = 48): IconDefinition[] {
  const suggestedIcons = DEFAULT_ICON_SUGGESTIONS.map((name) =>
    iconDefinitionByName.get(name)
  ).filter((definition): definition is IndexedIconDefinition => Boolean(definition));

  if (suggestedIcons.length >= limit) {
    return suggestedIcons.slice(0, limit);
  }

  const suggestionNames = new Set(suggestedIcons.map((definition) => definition.name));

  const fallbackIcons = indexedIconDefinitions.filter(
    (definition) => !suggestionNames.has(definition.name)
  );

  return [...suggestedIcons, ...fallbackIcons].slice(0, limit);
}

export function searchIconDefinitions(
  query: string,
  limit = 120
): IconDefinition[] {
  const normalizedQuery = normalizeIconKey(query);

  if (!normalizedQuery) {
    return getSuggestedIconDefinitions(limit);
  }

  return indexedIconDefinitions
    .map((definition) => {
      let score = Number.POSITIVE_INFINITY;

      for (const keyword of definition.normalizedKeywords) {
        if (keyword === normalizedQuery) {
          score = Math.min(score, 0);
          continue;
        }

        if (keyword.startsWith(normalizedQuery)) {
          score = Math.min(score, 1);
          continue;
        }

        if (keyword.includes(normalizedQuery)) {
          score = Math.min(score, 2);
        }
      }

      return {
        definition,
        score,
      };
    })
    .filter((entry) => Number.isFinite(entry.score))
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }

      return left.definition.name.localeCompare(right.definition.name);
    })
    .slice(0, limit)
    .map((entry) => entry.definition);
}
