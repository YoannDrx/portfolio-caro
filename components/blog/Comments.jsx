const Comments = () => {
  return (
    <div className="rounded-lg mt-6 bg-gradient-to-r from-[#FA5252] to-[#DD2476] p-[1px] mr-3">
      <div className=" dark:bg-[#232220] bg-[#ffffff]   flex  p-4 rounded-lg  ">
        <div>
          <img
            className="md:w-[125px] rounded-xl "
            src="/images/about/about.jpg"
            alt="user"
          />
        </div>
        <div className="pl-5">
          <div className="flex justify-between items-center">
            <h3 className="dark:text-white text-[22px] font-medium">
              Rafia Ana
            </h3>{" "}
            <span className="dark:text-[#dedede] text-tiny ">15 min ago</span>
          </div>
          <p className="dark:text-white  md:pr-16">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi nam
            ad, unde vel aut soluta atque consequatur. Omnis, debitis nihil?
          </p>
          <button className="dark:text-[#dedede] text-tiny hover:text-[#FA5252] dark:hover:text-[#FA5252]">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
