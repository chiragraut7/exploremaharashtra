'use client';

import { useState } from 'react';
import type { ModalData } from '@/type/types';

export default function useLazyModalData() {
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadModal(id: string) {
    setLoading(true);
    try {
      // Map ID to JSON filename
      const map: Record<string, string> = {
        '#ancientModal': 'ancient.json',
        '#yadavaModal': 'yadava.json',
        '#marathaModal': 'maratha.json',
        '#britishModal': 'british.json',
        '#independenceModal': 'independence.json',
        '#formationModal': 'formation.json',
        '#industrialModal': 'industrial.json',
        '#tourismModal': 'tourism.json'
      };

      const file = map[id];
      if (!file) throw new Error(`Unknown modal ID: ${id}`);

      const res = await fetch(`/data/modals/${file}`);
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      const data = (await res.json()) as ModalData;
      setModalData(data);
    } catch (err) {
      console.error('❌ Modal loading error:', err);
      setModalData(null);
    } finally {
      setLoading(false);
    }
  }

  function clearModal() {
    setModalData(null);
  }

  return { modalData, loading, loadModal, clearModal };
}
