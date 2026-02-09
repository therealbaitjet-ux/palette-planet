import { Brand } from "@/lib/data";
import BrandCard from "@/components/BrandCard";

export default function BrandGrid({ brands }: { brands: Brand[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
}
