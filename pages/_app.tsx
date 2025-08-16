import Header from"../components/header";
import Footer from"../components/footer";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }) {
  return (
    <div className="container">
      <Header/>
      <Component {...pageProps}/>   
      <Footer/> 
    </div>
  )
}

export default MyApp

