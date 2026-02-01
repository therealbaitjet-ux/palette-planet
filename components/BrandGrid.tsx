import { Brand } from "@/lib/data";
import BrandCard from "@/components/BrandCard";

export default function BrandGrid({ brands }: { brands: Brand[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
}
