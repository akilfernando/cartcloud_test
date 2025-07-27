import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

export default function CustomerNav({ page }: { page: string }) {
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-8">
          <NavigationMenuItem>
            <Link to="/home" className={`text-gray-700 hover:text-gray-900 font-medium transition-colors pb-2 border-b-2 ${page === "home" ? "text-gray-900 font-semibold border-gray-800" : "border-transparent hover:border-gray-300"}`}>Home</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/products" className={`text-gray-700 hover:text-gray-900 font-medium transition-colors pb-2 border-b-2 ${page === "products" || page === "shop" ? "text-gray-900 font-semibold border-gray-800" : "border-transparent hover:border-gray-300"}`}>Shop</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/about" className={`text-gray-700 hover:text-gray-900 font-medium transition-colors pb-2 border-b-2 ${page === "about" ? "text-gray-900 font-semibold border-gray-800" : "border-transparent hover:border-gray-300"}`}>About</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/contact" className={`text-gray-700 hover:text-gray-900 font-medium transition-colors pb-2 border-b-2 ${page === "contact" ? "text-gray-900 font-semibold border-gray-800" : "border-transparent hover:border-gray-300"}`}>Contact</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
} 