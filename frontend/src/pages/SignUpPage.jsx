import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
    const { loading, signup, user } = useUserStore();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
        setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    };

    return (
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div
                className="sm:mx-auto sm:w-full sm:max-w-md"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="mt-6 text-center text-3xl font-semibold text-purple-400">
                    Create Your Account
                </h2>
            </motion.div>

            <motion.div
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="bg-gray-800 py-8 px-4 shadow rounded-md sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-300"
                            >
                                UserName
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full px-3 py-2 pl-10 bg-gray-700 border  border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm "
                                    name="username"
                                    id="username"
                                    placeholder="Jhon Doe"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            username: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <input
                                    type="email"
                                    className="block w-full px-3 py-2 pl-10 bg-gray-700 border  border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm "
                                    name="email"
                                    id="email"
                                    placeholder="jhondoe@gmail.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <input
                                    type="password"
                                    className="block w-full px-3 py-2 pl-10 bg-gray-700 border  border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm "
                                    name="password"
                                    id="password"
                                    placeholder="••••••"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <input
                                    type="password"
                                    className="block w-full px-3 py-2 pl-10 bg-gray-700 border  border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm "
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <UserPlus
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    Signup
                                </>
                            )}
                        </button>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account ?{" "}
                        <Link
                            to={"/login"}
                            className="font-medium text-purple-400 hover:text-purple-300"
                        >
                            Login here <ArrowRight className="inline h-4 w-4" />
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUpPage;
