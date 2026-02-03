import { getCategoryData } from '@/lib/getCounts';
import Home from './HomeClient';

export default function Page() {
  const categoryData = getCategoryData();
  return <Home categoryData={categoryData} />;
}