import React from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 border border-gray-100 dark:border-gray-700 mt-10">
            <div className="flex flex-col items-center text-center space-y-4 mb-10">
                <div className="w-24 h-24 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-4xl font-black shadow-inner">
                    {(user?.username || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">{user?.username || 'User'}</h1>
                    <p className="text-gray-500 font-medium">{user?.email}</p>
                    <span className="inline-block mt-3 px-4 py-1 bg-violet-50 dark:bg-violet-900/20 rounded-full text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest border border-violet-100 dark:border-violet-800/50">
                        {user?.role}
                    </span>
                </div>
            </div>

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <Input label="Username" value={user?.username || ''} disabled />
                    <Input label="Email" value={user?.email || ''} disabled />
                </div>
                <button disabled className="w-full py-3 bg-gray-100 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 rounded-xl font-bold cursor-not-allowed border border-dashed border-gray-200 dark:border-gray-600">
                    Edit Profile (Coming Soon)
                </button>
            </form>
        </div>
    );
};

export default Profile;
