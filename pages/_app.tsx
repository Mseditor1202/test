import Header from"../components/header";
import Footer from"../components/footer";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Header/>
      <Component {...pageProps}/>
      <Footer/>
    </div>
  )
}


