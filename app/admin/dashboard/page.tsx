// Admin Dashboard
// Brian's control panel for managing logos

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  categorySlug: string;
  status: "working" | "broken" | "new";
}

export default function AdminDashboard() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "broken" | "new">("all");
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check auth
    const isAuth = document.cookie.includes("admin_auth=true");
    if (!isAuth) {
      router.push("/admin");
      return;
    }

    // Load brands
    fetch("/api/admin/brands")
      .then((res) => res.json())
      .then((data) => {
        setBrands(data.brands);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/admin");
  };

  const filteredBrands = brands.filter((brand) => {
    const matchesFilter = filter === "all" || brand.status === filter;
    const matchesSearch =
      search === "" ||
      brand.name.toLowerCase().includes(search.toLowerCase()) ||
      brand.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: brands.length,
    working: brands.filter((b) => b.status === "working").length,
    broken: brands.filter((b) => b.status === "broken").length,
    new: brands.filter((b) => b.status === "new").length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Palette Planet Admin</h1>
            <p className="text-sm text-slate-400">Manage brand logos</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View Site →
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Total Logos</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-400">Working</p>
            <p className="text-2xl font-bold text-emerald-300">{stats.working}</p>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">Broken</p>
            <p className="text-2xl font-bold text-red-300">{stats.broken}</p>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
            <p className="text-sm text-blue-400">New</p>
            <p className="text-2xl font-bold text-blue-300">{stats.new}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              + Upload New Logo
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search logos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-white"
            >
              <option value="all">All</option>
              <option value="broken">Broken</option>
              <option value="new">New</option>
            </select>
          </div>
        </div>

        {/* Logo Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="group relative rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
            >
              {/* Status Badge */}
              <span
                className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs ${
                  brand.status === "working"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : brand.status === "broken"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {brand.status}
              </span>

              {/* Logo Preview */}
              <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-black/30 p-4">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={120}
                  height={80}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logos/abstract-mark.svg";
                  }}
                />
              </div>

              {/* Info */}
              <h3 className="font-semibold text-white">{brand.name}</h3>
              <p className="text-xs text-slate-400">{brand.categorySlug}</p>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setSelectedBrand(brand)}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedBrand({ ...brand, status: "broken" })}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10"
                >
                  Replace
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {/* Edit Modal */}
      {selectedBrand && (
        <EditModal
          brand={selectedBrand}
          onClose={() => setSelectedBrand(null)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}

// Upload Modal Component
function UploadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("tech-saas");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("category", category);

    await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Upload New Logo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300">Logo File</label>
            <input
              type="file"
              accept=".png,.svg,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 w-full text-sm text-slate-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300">Company Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-white"
            >
              <option value="tech-saas">Tech & SaaS</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail</option>
              <option value="automotive">Automotive</option>
              <option value="healthcare">Healthcare</option>
              <option value="entertainment">Entertainment</option>
              <option value="food-beverage">Food & Beverage</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Modal Component
function EditModal({
  brand,
  onClose,
  onSuccess,
}: {
  brand: Brand;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(brand.name);
  const [category, setCategory] = useState(brand.categorySlug);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("id", brand.id);
    formData.append("name", name);
    formData.append("category", category);
    if (file) formData.append("file", file);

    await fetch("/api/admin/update", {
      method: "POST",
      body: formData,
    });

    setSaving(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">
          {brand.status === "broken" ? "Replace Logo" : "Edit Logo"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {brand.status === "broken" && (
            <div>
              <label className="block text-sm text-slate-300">New Logo File</label>
              <input
                type="file"
                accept=".png,.svg,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 w-full text-sm text-slate-300"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300">Company Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-white"
            >
              <option value="tech-saas">Tech & SaaS</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail</option>
              <option value="automotive">Automotive</option>
              <option value="healthcare">Healthcare</option>
              <option value="entertainment">Entertainment</option>
              <option value="food-beverage">Food & Beverage</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
