import { CONTAINER_DEFINITIONS } from '@/config/containerDefinitions';

export const FREE_CONTAINER_ID = 'seven-days-of-noticing';

export function isFreeContainer(containerId: string): boolean {
  return containerId === FREE_CONTAINER_ID;
}

export function isTransformationContainer(containerId: string): boolean {
  return !isFreeContainer(containerId);
}

export function getFreeContainerCount(): number {
  return CONTAINER_DEFINITIONS.filter((container) => isFreeContainer(container.id)).length;
}
