const Tag = () => {
  const tagList = [
    "Digital Design",
    "Marketing",
    "Social Media",
    "Print",
    "Time Management",
    "Flexibility",
    "Print",
    "Time Management",
    "Flexibility",
    "Print",
  ];
  return (
    <>
      {tagList.map((tag, i) => (
        <button className="resume-btn text-[15px]" key={i}>
          {tag}
        </button>
      ))}
    </>
  );
};

export default Tag;
