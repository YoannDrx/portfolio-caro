import dynamic from "next/dynamic";
import SidebarInfo from "../components/about/SidebarInfo";
import HeaderNavigation from "../components/header/HeaderNavigation";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ResumeCardTwo from "../components/Resume/ResumeCardTwo";
import LineItem from "../components/Resume/LineItem";
import Tag from "../components/tag/Tag";
import Seo from "../components/seo/Seo";

const index = () => {
  return (
    <section className="bg-homeBg dark:bg-homeTwoBg-dark min-h-screen  bg-no-repeat bg-center bg-cover bg-fixed  md:pb-16 w-full">
      <Seo pageTitle="Resume" />
      {/* End Head for Seo */}

      <Header />
      {/* End header */}

      <div className="container grid grid-cols-12 md:gap-10 justify-between lg:mt-[220px]">
        <div className="col-span-12 lg:col-span-4 hidden lg:block h-screen sticky top-44">
          {/* profile sidebar */}
          <SidebarInfo />
        </div>
        <div className="col-span-12 lg:col-span-8">
          <HeaderNavigation />

          <div className="lg:rounded-2xl bg-white dark:bg-[#111111]">
            <div data-aos="fade">
              <div className="container px-4 sm:px-5 md:px-10 lg:px-14">
                <div className="py-12">
                  {/*Resume page title */}
                  <h2 className="after-effect after:left-44">Resume</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-6 mt-[30px]">
                    <ResumeCardTwo />
                    {/* resume items map */}
                  </div>
                </div>
              </div>
              {/* End .container for resume */}

              <div className="container bg-color-810 dark:bg-[#0D0D0D] py-12 px-4 sm:px-5 md:px-10 lg:px-20">
                <div className="grid grid-cols-1  md:grid-cols-2 gap-8">
                  <div className="col-span-1">
                    <h4 className="text-5xl dark:text-white font-medium mb-6">
                      Working Skills
                    </h4>
                    <LineItem />
                    {/* experience percent items */}
                  </div>
                  <div className="col-span-1">
                    <h4 className="text-5xl dark:text-white font-medium mb-8">
                      Knowledges
                    </h4>

                    <div className="flex gap-x-3 gap-y-3 md:gap-y-3 md:gap-x-3 flex-wrap">
                      <Tag />
                    </div>
                    {/* Knowledges items */}
                  </div>
                </div>
              </div>
              {/* End Skills */}

              <Footer />
              {/* Common Footer call here */}
            </div>
            {/* End fade */}
          </div>
          {/* End common-wrap */}
        </div>
      </div>
      {/* End main continer */}
    </section>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
