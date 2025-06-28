"use client";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import pathwayConfigData from "../../../data/pathwayConfig.json";
import { PathwayConfigMap, PathwayConfig } from "../../types/pathwayConfig";

const pathwayConfig = pathwayConfigData as PathwayConfigMap;

export default function PathwayPage() {
  const params = useParams();
  const pathwayId = params?.pathwayId as string;

  if (!pathwayId || !pathwayConfig[pathwayId]) {
    return <p>Pathway not found.</p>;
  }

  const config: PathwayConfig = pathwayConfig[pathwayId];

  const LayoutComponent = dynamic<{ config: PathwayConfig }>(
    () => import(`../../components/pathways/${config.layoutComponent}`),
    { ssr: false }
  );

  return <LayoutComponent config={config} />;
}
