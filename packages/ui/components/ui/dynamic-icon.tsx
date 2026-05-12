import type { LucideProps } from "lucide-react";
import { Circle } from "lucide-react";

import { DEFAULT_ICON_NAME, resolveIconDefinition } from "../../lib/icons";

interface DynamicIconProps extends LucideProps {
  icon?: string | null;
  fallbackIcon?: string | null;
}

function DynamicIcon({
  icon,
  fallbackIcon = DEFAULT_ICON_NAME,
  ...props
}: DynamicIconProps) {
  const resolvedIcon =
    resolveIconDefinition(icon) ?? resolveIconDefinition(fallbackIcon);
  const Icon = resolvedIcon?.Icon ?? Circle;

  return <Icon {...props} />;
}

export { DynamicIcon };
