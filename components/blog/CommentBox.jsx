const CommentBox = () => {
  return (
    <form className="w-full ">
      <label className="block mb-2">
        <span className="dark:text-white text-[25px] font-medium  ">
          Leave a Reply
        </span>
        <textarea
          className="block w-full mt-3 p-3 dark:text-white hover:outline-none hover:border-0 focus:outline-none rounded dark:bg-[#0b0b0b5e] bg-gray  "
          rows="3"
          required
        ></textarea>
      </label>
      <button className="flex items-center  bg-gradient-to-r from-[#FA5252] to-[#DD2476] duration-200 transition ease-linear  hover:bg-gradient-to-l from-[#DD2476]  to-[#fa5252ef] px-8 py-[12px] text-lg text-white rounded-[35px] mt-8">
        Comment
      </button>
    </form>
  );
};

export default CommentBox;
