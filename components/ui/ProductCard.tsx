import React from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Tag, PackageX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "../../types";

import { StatusBadge } from "./status-badge";

export const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const hasDiscount = product.isOffer && product.offerPrice && product.offerPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.offerPrice || product.price)) / product.price) * 100)
    : 0;

  const displayPrice = product.isOffer && product.offerPrice ? product.offerPrice : product.price;
  const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Simplified add to cart, usually this would call a context/store
    // For now we navigate to the product
    navigate(`/product/${productSlug}/${product.id}`);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="group relative w-full"
    >
      <Link 
        to={`/product/${productSlug}/${product.id}`}
        className="flex flex-col h-full overflow-hidden rounded-[15px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-all duration-300 hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 block group"
      >
        {/* Image and Discount Badge */}
        <div className="relative h-40 overflow-hidden bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="md:h-full md:w-full h-28 w-28 object-contain transition-transform duration-500 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
          />
          {hasDiscount && (
            <div className="absolute left-2 top-2">
              <StatusBadge leftIcon={Tag} leftLabel={`${discountPercent}% OFF`} />
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-10">
              <StatusBadge leftIcon={PackageX} leftLabel="Out of Stock" status="error" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-1 p-3.5 space-y-2 relative">
          <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-zinc-800 dark:text-zinc-200 dark:text-zinc-700 dark:text-zinc-300">
            <Clock className="h-3 w-3" />
            <span>Fast Delivery</span>
          </div>
          
          <h3 className="h-10 text-xs md:text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex-1" />

          {/* Pricing and Add Button */}
          <div className="flex items-end justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-zinc-800 dark:text-zinc-200 dark:text-zinc-700 dark:text-zinc-300">
                ৳{displayPrice}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-zinc-400 font-semibold line-through">
                  ৳{product.price}
                </span>
              )}
              {!hasDiscount && (
                <div className="h-3.5" />
              )}
            </div>
            
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-4 md:px-5 py-1.5 text-[11px] md:text-xs font-bold text-zinc-900 dark:text-zinc-100 transition-all hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-700 dark:hover:text-zinc-100 disabled:opacity-50 disabled:hover:bg-zinc-100 disabled:hover:text-zinc-900 dark:disabled:hover:bg-zinc-800 dark:disabled:hover:text-zinc-100 shadow-sm active:scale-95 flex items-center space-x-1"
            >
              <span>ADD</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
