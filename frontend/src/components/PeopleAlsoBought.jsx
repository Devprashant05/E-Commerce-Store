import React, { use, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("/products/recommendations");

                setRecommendations(response.data.data);
            } catch (error) {
                toast.error(error.response.data.message || "An Error Occured");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    if (isLoading) return <LoadingSpinner className="animate-spin" />;

    return (
        <div className="mt-8 ">
            <h3 className="text-2xl font-semibold text-purple-400 ">
                People Also bought
            </h3>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((product) => (
                    <ProductCard product={product} key={product._id} />
                ))}
            </div>
        </div>
    );
};

export default PeopleAlsoBought;
