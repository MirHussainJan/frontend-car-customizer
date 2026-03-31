'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

const ModelViewer: any = 'model-viewer';

interface VehicleModelPreviewProps {
  modelUrl?: string;
  vehicleName: string;
  className?: string;
}

export function VehicleModelPreview({
  modelUrl,
  vehicleName,
  className = 'h-full w-full',
}: VehicleModelPreviewProps) {
  const modelViewerRef = useRef<any>(null);
  const hasModel = Boolean(modelUrl && (modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf')));

  useEffect(() => {
    if (!hasModel || !modelViewerRef.current) return;

    const modelViewer = modelViewerRef.current;

    const setMaterialVisible = (material: any, visible: boolean) => {
      if (!material?.pbrMetallicRoughness?.setBaseColorFactor) return;
      if (material.setAlphaMode) {
        material.setAlphaMode(visible ? 'OPAQUE' : 'BLEND');
      }
      material.pbrMetallicRoughness.setBaseColorFactor(visible ? [1, 1, 1, 1] : [1, 1, 1, 0]);
    };

    const extractNumber = (name: string) => {
      const match = String(name || '').match(/(\d+)/);
      return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
    };

    const applyVisibilityPreset = () => {
      const materials = modelViewer.model?.materials || [];
      if (!materials.length) return;

      const wheelMaterials = materials
        .filter((material: any) => /wheel/i.test(material.name))
        .sort((a: any, b: any) => extractNumber(a.name) - extractNumber(b.name));
      const spoilerMaterials = materials
        .filter((material: any) => /spoiler/i.test(material.name))
        .sort((a: any, b: any) => extractNumber(a.name) - extractNumber(b.name));

      if (wheelMaterials.length) {
        wheelMaterials.forEach((material: any, index: number) => {
          setMaterialVisible(material, index === 0);
        });
      }

      if (spoilerMaterials.length) {
        spoilerMaterials.forEach((material: any) => setMaterialVisible(material, false));
      }
    };

    const handleLoad = () => applyVisibilityPreset();

    modelViewer.addEventListener('load', handleLoad);
    if (modelViewer.loaded) {
      applyVisibilityPreset();
    }

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
    };
  }, [hasModel, modelUrl]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_55%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.08))]" />
      <div className="absolute inset-x-6 bottom-3 h-10 rounded-full bg-black/10 blur-2xl" />

      {hasModel ? (
        <ModelViewer
          ref={modelViewerRef}
          src={modelUrl}
          auto-rotate
          auto-rotate-delay="0"
          rotation-per-second="18deg"
          interaction-prompt="none"
          touch-action="none"
          disable-zoom
          shadow-intensity="1"
          exposure="1.1"
          tone-mapping="neutral"
          camera-orbit="28deg 76deg 88%"
          min-camera-orbit="auto auto 84%"
          max-camera-orbit="auto auto 94%"
          field-of-view="26deg"
          className="h-full w-full pointer-events-none"
          style={{ '--poster-color': 'transparent' } as CSSProperties}
        />
      ) : (
        <div className="flex h-full items-center justify-center px-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{vehicleName}</p>
            <p className="text-sm text-muted-foreground">3D preview unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}
