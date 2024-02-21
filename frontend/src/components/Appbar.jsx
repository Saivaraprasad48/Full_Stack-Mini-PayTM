import Image from "../assets/paytm.png";
export const Appbar = () => {
  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-row items-center justify-center h-full ml-8">
        <img className="w-[40px]" src={Image} alt="icon" />
        <span> Mini PayTM</span>
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">Hello</div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">U</div>
        </div>
      </div>
    </div>
  );
};
