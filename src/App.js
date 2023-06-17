import { Fragment, useState } from "react";
import "./App.css";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineGithub } from "react-icons/ai";
import { FcOk } from "react-icons/fc";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

// import logo from '../public/logo192.png'

function App() {
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copy, setCopy] = useState(false);

  const handleShorten = async () => {
    //await the shortened link plus the qr code
    setShowModal(!showModal);
    const encodedParams = new URLSearchParams();
    encodedParams.set("url", url);
    const options = {
      method: "POST",
      url: process.env.REACT_APP_S_URL,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": process.env.REACT_APP_X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.REACT_APP_X_RAPIDAPI_HOST,
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      setShortUrl(response.data.result_url)
    } catch (error) {
      console.error(error);
    }
  };
  //method to handle copying to the clipboard
  const handleCopytoClipboard = (e) => {
    e.preventDefault();
    setCopy(!copy);
    navigator.clipboard.writeText(shortUrl);
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };
  return (
    <section className="shorten-bg text-white">
      <nav className="flex justify-around items-center p-4 border-b bg-slate-950 border-slate-400 w-full text-base">
        <div className="logo text-xl">Shoorten</div>
        <a className="" href="https://github.com/Newton-Nganga/urlShoortener.git">
          <div className="logo flex text-xl items-center gap-4 hover:bg-green-400 bg-green-600 rounded-md p-2 px-4">
            <AiOutlineGithub className="text-2xl" />
            github
          </div>
        </a>
      </nav>
      <div className=" max-w-2xl sm:max-w-3xl m-auto my-4 text-center flex flex-col items-center w-full p-10">
        <h1 className=" text-4xl sm:text-6xl font-bold">
          Shorten Urls,{" "}
          <span className="text-green-600 leading-[6rem] border-2 border-green-600 px-4">
            Generate
          </span>{" "}
          and Share their Dynamic QR Codes.
        </h1>
      </div>
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 md:bg-blue-200 w-fit mx-auto my-4 p-1 md:rounded-full">
          <input
            type="text"
            placeholder="paste in a long url"
            autoFocus
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            className="w-[90vw] md:rounded-l-full  md:w-[40vw]  p-4 px-5 text-lg text-gray-500 outline-none"
          />
          <button
            onClick={(e) => handleShorten(e)}
            className="md:rounded-r-full p-4 px-6 text-lg font-semibold bg-green-500 hover:bg-green-400"
          >
            Shorten
          </button>
        </div>
      </div>
      {(showModal && url.length>0) && (
        <div className="absolute flex flex-col gap-2 text-gray-400 items-center justify-center top-0 bottom-0 h-full w-full left-0 right-0 z-10 bg-[#222721dc]">
          <div className="flex flex-col justify-center gap-6 w-[80vw] sm:w-[50vw] max-w-2xl h-[50vw] max-h-xl">
            { showModal && shortUrl.length > 0 ? (
              <Fragment>
                <div className="flex justify-between gap-4 bg-white p-4 text-base border-b-2 border-green-600">
                  <p>{shortUrl ? shortUrl : "The shortened url"}</p>
                  <button
                    onClick={handleCopytoClipboard}
                    className="text-2xl flex items-center gap-3"
                  >
                    <span className="text-sm">{copy ? "copied" : "copy"}</span>
                    {copy ? (
                      <FcOk />
                    ) : (
                      <IoCopyOutline className="hover:text-green-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-center bg-white p-4 mx-auto border-b-2 border-green-600">
                  {shortUrl ? (
                    <QRCodeSVG
                      value={shortUrl}
                      size={180}
                      fgColor="#fd3c56"
                      level="M"
                      imageSettings={{}}
                    />
                  ) : (
                    <span>Qr code</span>
                  )}
                </div>
              </Fragment>
            ) : (
              <div className="flex gap-4 items-center justify-center h-64 w-64 m-auto">
                <span className="loader"></span>
                <p className="text-sm italic">Shortening the url ...</p>
              </div>
            )}
            <button
              className="hover:text-green-600 underline"
              onClick={(e) => {
                e.preventDefault();
                setShowModal(!showModal);
              }}
            >
              Shorten another url
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
