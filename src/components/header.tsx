import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { TiShoppingCart } from "react-icons/ti";


export default function Header() {
    return (
        <header className="w-full bg-neutral-300 py-4 fixed">
            <NavigationMenu className="w-full">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/">
                            <span className="inline-flex items-center gap-5 text-2xl font-bold ms-3">
                                <TiShoppingCart className="text-xl scale-300"/>
                                CartCloud
                            </span>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/signup" className="text-xl font-semibold px-4 py-2">
                            Signup
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#" className="text-xl font-semibold px-4 py-2">
                            Cart
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    )
}