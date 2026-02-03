'use client';

import { useEffect, useState } from 'react';
import type { ModalData } from '@/type/types';

export default function useModalsPreload() {
  const [modals, setModals] = useState<Record<string, ModalData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function preload() {
      const files = [
        'ancient.json',
        'yadava.json',
        'maratha.json',
        'british.json',
        'independence.json',
        'formation.json',
        'industrial.json',
        'tourism.json'
      ];

      try {
        const results = await Promise.all(
          files.map(async (file) => {
            const res = await fetch(`/data/modals/${file}`);
            const data = (await res.json()) as ModalData;
            return [file.replace('.json', ''), data];
          })
        );

        const mapped = Object.fromEntries(results);
        setModals(mapped);
      } catch (err) {
        console.error('Error preloading modals:', err);
      } finally {
        setLoading(false);
      }
    }

    preload();
  }, []);

  return { modals, loading };
}
