import React from "react";
import { Link } from "react-router-dom";
import {
    IconBrandFacebook,
    IconBrandTwitter,
    IconBrandYoutube,
    IconBrandInstagram,
    IconMail,
    IconPhone,
    IconMapPin,
    IconCircleCheck
} from "@tabler/icons-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: "Mobiles", href: "/dashboard" },
            { name: "Laptops", href: "/dashboard" },
            { name: "Appliances", href: "/dashboard" },
            { name: "Electronics", href: "/dashboard" },
            { name: "Fashion", href: "/dashboard" },
        ],
        support: [
            { name: "Contact Us", href: "#" },
            { name: "About Us", href: "#" },
            { name: "F.A.Q", href: "#" },
            { name: "Shipping Policy", href: "#" },
            { name: "Returns & Refunds", href: "#" },
        ],
        legal: [
            { name: "Terms of Service", href: "#" },
            { name: "Privacy Policy", href: "#" },
            { name: "Security", href: "#" },
            { name: "Sitemap", href: "#" },
        ]
    };

    return (
        <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 font-sans mt-auto border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                                <span className="text-white font-black text-xl">M</span>
                            </div>
                            <span className="text-2xl font-black text-white tracking-tight">MartApp</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Your one-stop destination for the latest gadgets and electronics. Quality products, seamless experience, and dedicated support.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {[
                                { icon: <IconBrandFacebook size={20} />, color: "hover:text-blue-500" },
                                { icon: <IconBrandTwitter size={20} />, color: "hover:text-sky-400" },
                                { icon: <IconBrandInstagram size={20} />, color: "hover:text-pink-500" },
                                { icon: <IconBrandYoutube size={20} />, color: "hover:text-red-500" },
                            ].map((social, i) => (
                                <a key={i} href="#" className={`w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center transition-all duration-300 hover:bg-gray-800 ${social.color}`}>
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Shop Categories</h3>
                        <ul className="space-y-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm hover:text-violet-400 transition-colors duration-200 flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-violet-400 mr-0 group-hover:mr-2 transition-all"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Customer Service</h3>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm hover:text-violet-400 transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 text-sm">
                                <IconMapPin size={20} className="text-violet-500 shrink-0" />
                                <p className="text-gray-400">123 Tech Square, Outer Ring Road, Bengaluru, 560103, India</p>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <IconPhone size={20} className="text-violet-500 shrink-0" />
                                <p className="text-gray-400">+91 044-4561-4700</p>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <IconMail size={20} className="text-violet-500 shrink-0" />
                                <p className="text-gray-400">support@martapp.com</p>
                            </div>
                            <div className="pt-4">
                                <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 mt-2">
                                    <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                                        <IconCircleCheck size={14} className="text-green-500" />
                                        <span>Official Partner store</span>
                                    </div>
                                    <img
                                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg"
                                        alt="Payments"
                                        className="h-6 opacity-70 brightness-150 grayscale hover:grayscale-0 transition-all cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 mt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0 text-center">
                    <p>&copy; {currentYear} MartApp. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {footerLinks.legal.map(link => (
                            <a key={link.name} href={link.href} className="hover:text-white transition-colors">{link.name}</a>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                        <span>Built with ❤️ for Shoppers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
