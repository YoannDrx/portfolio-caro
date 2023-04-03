import Image from "next/image";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import DarkMode from "../mode/DarkMode";
import DarkModeMobile from "../mode/DarkModeMobile";
import headerMenu from "../../data/HeaderMenu";
import { isActiveLink } from "../../utilis/linkActiveChecker";
import { useRouter } from "next/router";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="container w-full bg-[#F3F6F6] dark:bg-black lg:bg-transparent lg:dark:bg-transparent flex justify-between py-5  lg:px-0 lg:pt-[50px]">
      <div className="w-full flex justify-between  px-4">
        {/* website logo */}

        <Link href="/">
          <Image
            className="h-[26px] lg:h-[32px]"
            width={153}
            height={26}
            priority
            src="/images/logo/logo.png"
            alt="logo"
          />
        </Link>
        {/* start mobile menu toggle and mode btn */}
        <div className="flex items-center">
          <DarkMode />
          <DarkModeMobile />
          {!menuOpen ? (
            <span
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:opacity-0 lg:invisible visible opacity-100  bg-[#ef4060] w-[40px] h-[40px] rounded-full flex justify-center cursor-pointer items-center text-white dark:text-white text-3xl ml-3 "
            >
              <AiOutlineMenu />
            </span>
          ) : (
            <span
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:opacity-0 cursor-pointer lg:invisible visible opacity-100  bg-[#ef4060] w-[40px] h-[40px] rounded-full flex justify-center items-center text-white text-3xl ml-3 "
            >
              <AiOutlineClose />
            </span>
          )}
        </div>
        {/* End mobile menu toggle and mode btn */}
      </div>

      {/* mobile nav menu start */}
      <nav className={`${menuOpen ? "block lg:hidden" : "hidden"}`}>
        {/* Menu items start  */}
        <ul
          className={`${
            menuOpen
              ? "block  rounded-b-[20px] shadow-md absolute left-0 top-20 z-[22222222222222] w-full bg-white dark:bg-[#212425]"
              : "flex my-12 "
          }`}
        >
          {headerMenu.map((item) => (
            <li key={item.id} className="mb-1">
              <Link
                className={`${
                  isActiveLink(item.routePath, router.asPath)
                    ? "rounded-md  cursor-pointer font-poppins bg-white text-gray-lite font-medium mx-2.5 flex text-xtiny py-2.5 px-2 md:px-4 xl:px-5 items-center transition-all duration-300 ease-in-out dark:hover:text-white dark:bg-[#212425] hover:text-white hover:bg-gradient-to-r from-[#FA5252] to-[#DD2476] dark:text-[#A6A6A6] text-white linked bg-gradient-to-r "
                    : "rounded-md  cursor-pointer font-poppins bg-white text-gray-lite font-medium mx-2.5 flex text-xtiny py-2.5 px-2 md:px-4 xl:px-5 items-center transition-all duration-300 ease-in-out dark:hover:text-white dark:bg-[#212425] hover:text-white hover:bg-gradient-to-r from-[#FA5252] to-[#DD2476] dark:text-[#A6A6A6]"
                } `}
                href={item.routePath}
              >
                <span className="mr-2 text-xl">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* Menu items end  */}
      </nav>
      {/* End mobile nav menu end */}
    </div>
  );
};

export default Header;
