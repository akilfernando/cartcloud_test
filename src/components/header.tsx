import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { TiShoppingCart } from "react-icons/ti";
import { MdAccountCircle } from "react-icons/md";


interface HeaderProps {
    page: string;
}

export default function Header({ page }: HeaderProps) {
    return (
        <header className="w-full py-4 fixed bg-[var(--header-background)] text-white flex justify-between items-center">
            <NavigationMenu className="w-full ps-4">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/">
                            <span className="inline-flex items-center gap-5 text-2xl font-bold ms-3">
                                <TiShoppingCart className="text-sm scale-300" />
                                CartCloud
                            </span>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu className="w-full pe-4">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href={page === "login" ? "/signup" : "/"} className="text-xl font-semibold px-4 py-2 flex items-center justify-center">
                            <MdAccountCircle className="inline-block text-sm scale-250" />
                            {page === "login" ? <p>Signup</p> : <p>Login</p>}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    )
}