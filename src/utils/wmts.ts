export interface ImportedLayer {
  id: string;
  name: string;
  description: string;
  resolution: string;
  category: string;
  dataSource: string;
  baseUrl: string;
  tileFormat: string;
  maxZoom: number;
  minLevel?: number;
  type: 'xyz';
}

function text(node: Element | null, sel: string): string | undefined {
  return node?.querySelector(sel)?.textContent ?? undefined;
}

export async function importWmtsLayer(capUrl: string): Promise<ImportedLayer | null> {
  try {
    const xml = await fetch(capUrl).then(r => r.text());
    const doc = new DOMParser().parseFromString(xml, 'application/xml');

    const layerNode = doc.querySelector('Layer');
    if (!layerNode) return null;

    const id = text(layerNode, 'Identifier') ?? 'WMTS_Layer';
    const resUrl = layerNode.querySelector('ResourceURL[resourceType="tile"]')?.getAttribute('template') ?? '';
    const tmsId = text(layerNode, 'TileMatrixSetLink > TileMatrixSet') ?? 'default028mm';

    const tmsSet = Array.from(doc.querySelectorAll('TileMatrixSet')).find(set => {
      return text(set, 'Identifier') === tmsId;
    });
    const levelIds = tmsSet ? Array.from(tmsSet.querySelectorAll('TileMatrix > Identifier')).map(n => parseInt(n.textContent ?? '0', 10)) : [];
    const minLevel = levelIds.length ? Math.min(...levelIds) : 0;
    const maxZoom = levelIds.length ? Math.max(...levelIds) : 9;

    // Map WMTS placeholders -> OpenSeadragon XYZ
    let baseUrl = resUrl.replace('{TileMatrix}', '{z}').replace('{TileRow}', '{y}').replace('{TileCol}', '{x}');
    // Dev proxy
    baseUrl = baseUrl.replace('https://trek.nasa.gov', '/trek');

    return {
      id,
      name: id,
      description: `WMTS ${id}`,
      resolution: '—',
      category: 'Base Layers',
      dataSource: 'NASA Trek',
      baseUrl,
      tileFormat: baseUrl.endsWith('.png') ? 'png' : 'jpg',
      maxZoom,
      minLevel,
      type: 'xyz'
    };
  } catch {
    return null;
  }
}

export async function importWmtsLayers(capUrls: string[]): Promise<ImportedLayer[]> {
  const results = await Promise.allSettled(capUrls.map(importWmtsLayer));
  return results
    .filter((r): r is PromiseFulfilledResult<ImportedLayer | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((r): r is ImportedLayer => !!r);
}


