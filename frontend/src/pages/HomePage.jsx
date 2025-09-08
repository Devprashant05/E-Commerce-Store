import React, { useEffect } from "react";
import { categories } from "../constants";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProduct from "../components/FeaturedProduct";

const HomePage = () => {
    const { fetchFeaturedProducts, products, loading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    return (
        <div className="relative min-h-screen text-white overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-center text-5xl sm:text-6xl font-semibold text-purple-200 mb-4">
                    Explore Our Categories
                </h1>
                <p className="text-center text-xl text-purple-100 mb-12">
                    Discover the latest trends in eco-friendly fashion
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <CategoryItem category={category} key={category.name} />
                    ))}
                </div>
                {!loading && products.length > 0 && (
                    <FeaturedProduct products={products} />
                )}
            </div>
        </div>
    );
};

export default HomePage;
