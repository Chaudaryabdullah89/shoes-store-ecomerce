import {React,useState,useEffect} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./Style.css";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContextProvider";
import { useWishlist } from "../Context/WishlistContextProvider";
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useProductContext } from '../Context/ProductContextProvider';
import FindRetailer from '../Components/FindRetailer';
import Footer from '../Components/Footer';
import QuickView from "../Components/QuickView";
import ProductCard from "../Components/ProductCard";
import axios from 'axios';

const Home = () => {
  const [_, setLoading] = useState(true); // keep setLoading for blog fetch
  const [activeStep, setActiveStep] = useState(2);
  const [quickCartQty, setQuickCartQty] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [quickCartProductId, setQuickCartProductId] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { products, loading: productLoading } = useProductContext();
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Fetch blogs from backend
    axios.get('/api/blogs')
      .then(res => {
        const blogs = Array.isArray(res.data.blogs) ? res.data.blogs : (Array.isArray(res.data) ? res.data : []);
        setBlogPosts(blogs);
      })
      .catch(() => setBlogPosts([]))
      .finally(() => setLoading(false));
  }, []);
  
  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="home-page">
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="mySwiper h-full relative"
        >
          <SwiperSlide>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2560&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-start text-white px-4 sm:px-8 md:px-16 lg:px-40">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 md:mb-4 font-['Montserrat'] uppercase">
                  Find The Perfect
                </h1>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 md:mb-4 font-['Montserrat'] uppercase ">
                  Shoes For You
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-grey-400 font-['Montserrat']">
                  The Style of shoes available
                </p>
                <div className="mt-8">
                  <div className="bg-[#ba7a2d] text-white px-8 py-3 rounded-sm transition-colors overflow-hidden relative group h-12 w-fit">
                    <div className="flex flex-col transition-transform gap-4 duration-300 group-hover:-translate-y-[45px] h-full">
                      <Link
                        to="/Shop"
                        className="h-12 flex items-center font-semibold font-['Montserrat'] uppercase "
                      >
                        Shop Now
                      </Link>
                      <Link
                        to="/Shop"
                        className="h-12 flex items-center font-semibold font-['Montserrat'] uppercase"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                alt=""
              />
              <div className="absolute inset-0 flex flex-col justify-center items-start text-white px-4 sm:px-8 md:px-16 lg:px-40">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 md:mb-4 font-['Montserrat'] uppercase">
                  Your Shoes Show
                </h1>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 md:mb-4 font-['Montserrat'] uppercase ">
                  Your Style{" "}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-grey-400 font-['Montserrat']">
                  The Style of shoes available
                </p>
                <div className="mt-8">
                  <div className="bg-[#ba7a2d] text-white px-8 py-3 rounded-sm hover:bg-gray-100 transition-colors overflow-hidden relative group h-12 w-fit">
                    <div className="flex flex-col transition-transform gap-4 duration-300 group-hover:-translate-y-[45px] h-full">
                      <Link
                        to="/Shop"
                        className="h-12 flex items-center font-semibold font-['Montserrat'] uppercase "
                      >
                        Shop Now
                      </Link>
                      <Link
                        to="/Shop"
                        className="h-12 flex items-center font-semibold font-['Montserrat'] uppercase"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="max-w-full mb-4 bg-gray-100 p-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-around my-12 sm:my-16 md:my-20 lg:my-24 px-4">
          <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-0">
              <svg
                width="53"
                height="40"
                viewBox="0 0 53 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M52.0295 21.9705L41.3612 11.3022C41.1224 11.0618 40.8382 10.8713 40.5251 10.7416C40.2121 10.612 39.8764 10.5457 39.5376 10.5468H24.7812V12.2656H29.0781V25.1562H30.7969V12.2656H39.5376C39.6506 12.2655 39.7625 12.2877 39.8669 12.3309C39.9713 12.3741 40.0661 12.4375 40.146 12.5174L41.613 13.9843H37.6719C37.216 13.9843 36.7789 14.1654 36.4565 14.4877C36.1342 14.8101 35.9531 15.2472 35.9531 15.7031V23.4374C35.9531 23.8933 36.1342 24.3305 36.4565 24.6528C36.7789 24.9751 37.216 25.1562 37.6719 25.1562H50.5625V32.0312C50.5625 32.2591 50.472 32.4777 50.3108 32.6389C50.1496 32.8 49.931 32.8906 49.7031 32.8906H47.9156C47.7101 31.4598 46.9957 30.1511 45.9034 29.2045C44.8111 28.2578 43.4142 27.7367 41.9688 27.7367C40.5233 27.7367 39.1264 28.2578 38.0341 29.2045C36.9418 30.1511 36.2274 31.4598 36.0219 32.8906H23.8531C23.6476 31.4598 22.9332 30.1511 21.8409 29.2045C20.7486 28.2578 19.3517 27.7367 17.9062 27.7367C16.4608 27.7367 15.0639 28.2578 13.9716 29.2045C12.8793 30.1511 12.1649 31.4598 11.9594 32.8906H10.1719C9.94395 32.8906 9.72537 32.8 9.56421 32.6389C9.40304 32.4777 9.3125 32.2591 9.3125 32.0312V24.2968H7.59375V32.0312C7.59375 32.715 7.86537 33.3707 8.34887 33.8542C8.83236 34.3377 9.48811 34.6093 10.1719 34.6093H11.9594C12.1469 35.916 12.7605 37.1243 13.7048 38.0468H0.71875V39.7656H41.9688C43.4138 39.7628 44.8096 39.2404 45.9014 38.2938C46.9932 37.3471 47.7081 36.0394 47.9156 34.6093H49.7031C50.3869 34.6093 51.0426 34.3377 51.5261 33.8542C52.0096 33.3707 52.2812 32.715 52.2812 32.0312V22.5781C52.2812 22.3502 52.1906 22.1316 52.0295 21.9705ZM13.6094 33.7499C13.6094 32.9001 13.8614 32.0693 14.3335 31.3627C14.8057 30.6561 15.4768 30.1054 16.2619 29.7801C17.0471 29.4549 17.911 29.3698 18.7445 29.5356C19.578 29.7014 20.3437 30.1107 20.9446 30.7116C21.5455 31.3125 21.9548 32.0782 22.1206 32.9117C22.2864 33.7452 22.2013 34.6091 21.876 35.3943C21.5508 36.1794 21.0001 36.8505 20.2935 37.3227C19.5868 37.7948 18.7561 38.0468 17.9062 38.0468C16.7671 38.0455 15.6749 37.5923 14.8694 36.7868C14.0639 35.9813 13.6107 34.8891 13.6094 33.7499ZM22.1077 38.0468C23.052 37.1243 23.6656 35.916 23.8531 34.6093H36.0219C36.2094 35.916 36.823 37.1243 37.7673 38.0468H22.1077ZM41.9688 38.0468C41.1189 38.0468 40.2882 37.7948 39.5815 37.3227C38.8749 36.8505 38.3242 36.1794 37.999 35.3943C37.6737 34.6091 37.5886 33.7452 37.7544 32.9117C37.9202 32.0782 38.3295 31.3125 38.9304 30.7116C39.5313 30.1107 40.297 29.7014 41.1305 29.5356C41.964 29.3698 42.8279 29.4549 43.6131 29.7801C44.3982 30.1054 45.0693 30.6561 45.5415 31.3627C46.0136 32.0693 46.2656 32.9001 46.2656 33.7499C46.2643 34.8891 45.8111 35.9813 45.0056 36.7868C44.2001 37.5923 43.1079 38.0455 41.9688 38.0468ZM37.6719 23.4374V15.7031H43.3317L50.5625 22.9338V23.4374H37.6719Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M18.7656 32.8907H17.0469V34.6094H18.7656V32.8907Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M42.8281 32.8907H41.1094V34.6094H42.8281V32.8907Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M5.01562 30.3126H0.71875V32.0313H5.01562V30.3126Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M5.01562 26.875H2.4375V28.5938H5.01562V26.875Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M5.01562 23.4375H3.29688V25.1563H5.01562V23.4375Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M11.8906 22.5781C14.1002 22.5781 16.2602 21.9229 18.0974 20.6953C19.9346 19.4677 21.3665 17.7229 22.2121 15.6815C23.0577 13.6401 23.2789 11.3939 22.8478 9.22672C22.4168 7.05959 21.3527 5.06896 19.7903 3.50654C18.2279 1.94413 16.2373 0.880113 14.0701 0.449044C11.903 0.0179754 9.65673 0.239216 7.61533 1.08479C5.57394 1.93036 3.82913 3.36229 2.60155 5.19949C1.37397 7.03669 0.71875 9.19666 0.71875 11.4062C0.722162 14.3682 1.90029 17.2078 3.99468 19.3022C6.08908 21.3966 8.92871 22.5747 11.8906 22.5781ZM11.8906 1.95313C13.7603 1.95313 15.5879 2.50754 17.1425 3.54627C18.6971 4.58499 19.9087 6.06136 20.6242 7.78869C21.3397 9.51603 21.5269 11.4167 21.1621 13.2505C20.7974 15.0842 19.897 16.7686 18.575 18.0906C17.253 19.4127 15.5686 20.313 13.7348 20.6777C11.9011 21.0425 10.0004 20.8553 8.27307 20.1398C6.54574 19.4243 5.06936 18.2127 4.03064 16.6581C2.99192 15.1036 2.4375 13.2759 2.4375 11.4062C2.44046 8.90003 3.43736 6.49731 5.20952 4.72515C6.98169 2.95299 9.38441 1.95609 11.8906 1.95313Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M11.8906 19.1407C12.1185 19.1406 12.3371 19.05 12.4982 18.8889C13.0516 18.3354 17.9062 13.3743 17.9062 9.68754C17.9062 8.0921 17.2725 6.562 16.1443 5.43385C15.0162 4.3057 13.4861 3.67192 11.8906 3.67192C10.2952 3.67192 8.76508 4.3057 7.63694 5.43385C6.50879 6.562 5.875 8.0921 5.875 9.68754C5.875 13.3743 10.7296 18.3354 11.283 18.8889C11.4442 19.05 11.6627 19.1406 11.8906 19.1407ZM11.8906 5.39067C13.0298 5.39203 14.1219 5.84517 14.9275 6.6507C15.733 7.45622 16.1861 8.54836 16.1875 9.68754C16.1875 11.8927 13.483 15.3001 11.8906 17.0361C10.2982 15.3001 7.59375 11.8927 7.59375 9.68754C7.59511 8.54836 8.04826 7.45622 8.85378 6.6507C9.65931 5.84517 10.7514 5.39203 11.8906 5.39067Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M14.4687 9.68753C14.4687 9.17762 14.3175 8.67917 14.0342 8.2552C13.751 7.83123 13.3483 7.50078 12.8772 7.30565C12.4061 7.11052 11.8878 7.05946 11.3876 7.15894C10.8875 7.25842 10.4282 7.50396 10.0676 7.86452C9.70705 8.22508 9.4615 8.68445 9.36203 9.18456C9.26255 9.68467 9.3136 10.203 9.50874 10.6741C9.70387 11.1452 10.0343 11.5479 10.4583 11.8312C10.8823 12.1144 11.3807 12.2657 11.8906 12.2657C12.5744 12.2657 13.2301 11.994 13.7136 11.5105C14.1971 11.027 14.4687 10.3713 14.4687 9.68753ZM11.0312 9.68753C11.0312 9.51756 11.0816 9.35141 11.1761 9.21008C11.2705 9.06876 11.4047 8.95861 11.5617 8.89357C11.7188 8.82853 11.8916 8.81151 12.0583 8.84467C12.225 8.87782 12.3781 8.95967 12.4983 9.07986C12.6185 9.20004 12.7003 9.35317 12.7335 9.51987C12.7666 9.68657 12.7496 9.85936 12.6846 10.0164C12.6195 10.1734 12.5094 10.3076 12.3681 10.4021C12.2267 10.4965 12.0606 10.5469 11.8906 10.5469C11.6627 10.5469 11.4441 10.4564 11.2829 10.2952C11.1218 10.134 11.0312 9.91545 11.0312 9.68753Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M36.8125 26.875H33.375V28.5938H36.8125V26.875Z"
                  fill=""
                ></path>
              </svg>
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold font-['Montserrat']">FAST DELIVERY</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 font-semibold font-['Montserrat']">
                  All Orders of 120$ Or More Of Eligible
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-0">
              <svg
                width="55"
                height="48"
                viewBox="0 0 55 48"
                fill="#ba7a2d"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.11543 1.72044C5.11543 1.24585 5.50021 0.861069 5.9748 0.861069H17.4626C17.9372 0.861069 18.322 1.24585 18.322 1.72044C18.322 2.19503 17.9372 2.57982 17.4626 2.57982H5.9748C5.50021 2.57982 5.11543 2.19503 5.11543 1.72044ZM55 12.8601V35.1396C55 35.4466 54.8363 35.7303 54.5703 35.8838L35.2757 47.0236C35.1429 47.1003 34.9944 47.1387 34.846 47.1387C34.6977 47.1387 34.5492 47.1004 34.4164 47.0236L15.3213 35.9989H0.859375C0.384785 35.9989 0 35.6141 0 35.1395C0 34.6649 0.384785 34.2801 0.859375 34.2801H14.6921V24.8592H5.9748C5.50021 24.8592 5.11543 24.4744 5.11543 23.9998C5.11543 23.5253 5.50021 23.1405 5.9748 23.1405H14.6921V13.7195H0.859375C0.384785 13.7195 0 13.3347 0 12.8601C0 12.3855 0.384785 12.0007 0.859375 12.0007H15.3212L31.6388 2.57971H23.9193C23.4447 2.57971 23.0599 2.19493 23.0599 1.72034C23.0599 1.24575 23.4447 0.860962 23.9193 0.860962H34.846C34.9969 0.860962 35.1451 0.900708 35.2757 0.976118L54.5703 12.1159C54.8363 12.2694 55 12.5531 55 12.8601ZM16.4108 34.6433L33.9867 44.7908V24.496L28.8559 21.5338L28.8558 28.8185C28.8558 29.1255 28.6921 29.4092 28.4261 29.5627C28.2932 29.6394 28.1447 29.6778 27.9964 29.6778C27.848 29.6778 27.6996 29.6395 27.5667 29.5627L21.9713 26.3322C21.7053 26.1787 21.5416 25.895 21.5416 25.588V17.3109L16.4107 14.3486V34.6433H16.4108ZM27.9965 19.053L45.5724 8.90557L41.6957 6.66733L24.1199 16.8147L27.9965 19.053ZM23.2604 18.3032V25.0918L27.137 27.3299L27.1371 20.5414L23.2604 18.3032ZM52.4219 12.8601L47.2911 9.89783L29.7151 20.0452L34.846 23.0075L52.4219 12.8601ZM34.846 2.7127L17.2702 12.8601L22.4011 15.8224L39.9769 5.67497L34.846 2.7127ZM53.2812 34.6435V14.3485L35.7054 24.496V44.7908L53.2812 34.6435Z"
                  fill=""
                ></path>
              </svg>
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold font-['Montserrat']" >Secure Payment</h2>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-400 font-['Montserrat']">
                 Secure And Manage Your Payment
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-0">
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="black"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M52.42 5.07307C50.34 4.93787 45.1582 4.36587 42.02 1.97214C41.2076 1.34262 40.0721 1.34262 39.2597 1.97214C36.1197 4.36587 30.9397 4.93787 28.8597 5.07307C27.6869 5.14607 26.7717 6.11589 26.7667 7.29087V14.2883C26.7674 17.6741 27.5611 21.0127 29.0841 24.0366H6.83333C4.44129 24.0395 2.50287 25.9779 2.5 28.3699V49.1699C2.50287 51.562 4.44129 53.5004 6.83333 53.5033H43.2333C45.6254 53.5004 47.5638 51.562 47.5667 49.1699V30.2029C51.9743 26.0817 54.4833 20.3225 54.5 14.2883V7.29087C54.4954 6.12058 53.5876 5.1526 52.42 5.07307ZM45.8333 49.1699C45.8333 50.6059 44.6693 51.7699 43.2333 51.7699H6.83333C5.39739 51.7699 4.23333 50.6059 4.23333 49.1699V28.3699C4.23333 26.934 5.39739 25.7699 6.83333 25.7699H30.06C30.1943 25.9857 30.32 26.2033 30.4613 26.4182C32.7576 29.8378 35.9642 32.5473 39.719 34.2407C40.302 34.5036 40.9698 34.5036 41.5529 34.2407C43.0721 33.5521 44.5082 32.6929 45.8333 31.6797V49.1699ZM52.7667 14.2883C52.7378 22.2227 48.0725 29.4074 40.8361 32.6617C40.7068 32.7193 40.559 32.7193 40.4297 32.6617C36.969 31.1013 34.0138 28.6039 31.8982 25.4519C29.679 22.1521 28.4957 18.2649 28.5 14.2883V7.29087C28.5018 7.03178 28.7042 6.81844 28.9628 6.80294C31.7439 6.62267 36.9145 5.93627 40.3031 3.35014C40.4969 3.19873 40.7689 3.19873 40.9627 3.35014C44.3522 5.93454 49.5227 6.62267 52.3039 6.80294C52.5625 6.81844 52.7649 7.03178 52.7667 7.29087V14.2883Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M49.555 9.2634C46.7351 8.92099 44.0002 8.07219 41.482 6.75787C40.9559 6.45981 40.312 6.45981 39.7859 6.75787C37.2675 8.07245 34.5322 8.92126 31.712 9.2634C30.8639 9.38945 30.2353 10.1167 30.2335 10.9742V15.2885C30.2297 18.9199 31.3097 22.4699 33.3353 25.4839C34.9889 27.9388 37.2003 29.9673 39.7885 31.4033C40.3139 31.6909 40.9497 31.6909 41.475 31.4033C47.3545 28.1694 51.0147 21.9986 51.0335 15.2885V10.9742C51.0317 10.1167 50.4031 9.38945 49.555 9.2634ZM49.3002 15.2885C49.2824 21.3698 45.9633 26.9617 40.6335 29.8901H40.6248C38.2769 28.5862 36.271 26.7448 34.7714 24.5167C32.939 21.7883 31.9625 18.5751 31.9668 15.2885L31.9573 10.9759C34.9911 10.612 37.9322 9.6931 40.6335 8.265C43.332 9.69146 46.2697 10.6098 49.3002 10.9742V15.2885Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M9.43304 36.3034H12.8997C14.3356 36.3034 15.4997 35.1394 15.4997 33.7034V31.9701C15.4997 30.5341 14.3356 29.3701 12.8997 29.3701H9.43304C7.9971 29.3701 6.83304 30.5341 6.83304 31.9701V33.7034C6.83304 35.1394 7.9971 36.3034 9.43304 36.3034ZM8.56637 31.9701C8.56637 31.4914 8.95439 31.1034 9.43304 31.1034H12.8997C13.3784 31.1034 13.7664 31.4914 13.7664 31.9701V33.7034C13.7664 34.1821 13.3784 34.5701 12.8997 34.5701H9.43304C8.95439 34.5701 8.56637 34.1821 8.56637 33.7034V31.9701Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M7.69971 40.6367H11.1664C11.645 40.6367 12.033 40.2487 12.033 39.77C12.033 39.2914 11.645 38.9034 11.1664 38.9034H7.69971C7.22106 38.9034 6.83304 39.2914 6.83304 39.77C6.83304 40.2487 7.22106 40.6367 7.69971 40.6367Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M18.0998 38.9034H14.6331C14.1545 38.9034 13.7664 39.2914 13.7664 39.77C13.7664 40.2487 14.1545 40.6367 14.6331 40.6367H18.0998C18.5784 40.6367 18.9664 40.2487 18.9664 39.77C18.9664 39.2914 18.5784 38.9034 18.0998 38.9034Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M25.0332 38.9034H21.5665C21.0879 38.9034 20.6998 39.2914 20.6998 39.77C20.6998 40.2487 21.0879 40.6367 21.5665 40.6367H25.0332C25.5118 40.6367 25.8998 40.2487 25.8998 39.77C25.8998 39.2914 25.5118 38.9034 25.0332 38.9034Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M31.9666 38.9034H28.4999C28.0212 38.9034 27.6332 39.2914 27.6332 39.77C27.6332 40.2487 28.0212 40.6367 28.4999 40.6367H31.9666C32.4452 40.6367 32.8332 40.2487 32.8332 39.77C32.8332 39.2914 32.4452 38.9034 31.9666 38.9034Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M39.7666 39.77C39.7666 39.2914 39.3786 38.9034 38.8999 38.9034H35.4333C34.9546 38.9034 34.5666 39.2914 34.5666 39.77C34.5666 40.2487 34.9546 40.6367 35.4333 40.6367H38.8999C39.3786 40.6367 39.7666 40.2487 39.7666 39.77Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M13.7668 44.1032H11.1668C10.6882 44.1032 10.3002 44.4912 10.3002 44.9699C10.3002 45.4485 10.6882 45.8365 11.1668 45.8365H13.7668C14.2455 45.8365 14.6335 45.4485 14.6335 44.9699C14.6335 44.4912 14.2455 44.1032 13.7668 44.1032Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M13.7664 47.5699H7.69971C7.22106 47.5699 6.83304 47.9579 6.83304 48.4366C6.83304 48.9152 7.22106 49.3032 7.69971 49.3032H13.7664C14.245 49.3032 14.633 48.9152 14.633 48.4366C14.633 47.9579 14.245 47.5699 13.7664 47.5699Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M38.0335 14.6366V15.5033C37.0762 15.5033 36.3002 16.2793 36.3002 17.2366V22.4366C36.3002 23.3939 37.0762 24.1699 38.0335 24.1699H43.2335C44.1908 24.1699 44.9669 23.3939 44.9669 22.4366V17.2366C44.9669 16.2793 44.1908 15.5033 43.2335 15.5033V14.6366C43.2335 13.2006 42.0695 12.0366 40.6335 12.0366C39.1976 12.0366 38.0335 13.2006 38.0335 14.6366ZM39.7669 14.6366C39.7669 14.1579 40.1549 13.7699 40.6335 13.7699C41.1122 13.7699 41.5002 14.1579 41.5002 14.6366V15.5033H39.7669V14.6366ZM43.2335 17.2366V22.4366H38.0335V17.2366H43.2335Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M40.6331 20.7033C41.1118 20.7033 41.4998 20.3153 41.4998 19.8366C41.4998 19.358 41.1118 18.97 40.6331 18.97C40.1545 18.97 39.7664 19.358 39.7664 19.8366C39.7664 20.3153 40.1545 20.7033 40.6331 20.7033Z"
                  fill="#BA7A2D"
                ></path>
                <path
                  d="M41.5002 48.4366H37.1669C36.6882 48.4366 36.3002 48.8246 36.3002 49.3032C36.3002 49.7819 36.6882 50.1699 37.1669 50.1699H42.3669C42.8455 50.1699 43.2335 49.7819 43.2335 49.3032V44.9699C43.2335 44.4912 42.8455 44.1032 42.3669 44.1032C41.8882 44.1032 41.5002 44.4912 41.5002 44.9699V48.4366Z"
                  fill=""
                ></path>
              </svg>
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold font-['Montserrat']">Order Traking</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 font-semibold font-['Montserrat']">
                  All Orders of 120$ Or More Of Eligible
                </p>
              </div>
            </div>
          
          </div>
        </div>
      
      
      <div className='max-w-7xl mx-auto my-12 sm:my-16 md:my-20 lg:my-24 px-4' >
      <h1 className="text-center text-2xl sm:text-3xl font-bold font-['Montserrat'] uppercase">Top Collection</h1>
      <div className='item-center flex gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 justify-center' >
        <button 
          onClick={() => setActiveStep(2)}
          className={`relative pb-2 hover:after:content-[""] hover:after:absolute text-lg font-semibold hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-yellow-400 hover:after:transition-all hover:after:duration-300 ${activeStep === 2 ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300' : ''}`}
        >
          Latest Products
        </button>
        <button 
          onClick={() => setActiveStep(3)}
          className={`relative pb-2 hover:after:content-[""] hover:after:absolute text-lg font-semibold hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-yellow-400 hover:after:transition-all hover:after:duration-300 ${activeStep === 3 ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300' : ''}`}
        >
          Best Sellers
        </button>
      </div>
      
      {/* Product Card Grid */}
      {activeStep === 2 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mt-8 sm:mt-10 md:mt-12">
          {products.filter(product => product.isFeatured).map((product, idx) => (
            <ProductCard
              key={product._id || product.id || idx}
              product={product}
              addToWishlist={addToWishlist}
              addToCart={addToCart}
              setQuickViewProduct={setQuickViewProduct}
              setQuickViewQty={setQuickViewQty}
              setAgreed={setAgreed}
            />
          ))}
        </div>
      )}
      
      {activeStep === 3 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mt-8 sm:mt-10 md:mt-12">
          {products.map((product, idx) => (
            <ProductCard
              key={product._id || product.id || idx}
              productId={product._id || product.id}
              quickCartProductId={quickCartProductId}
              setQuickCartProductId={setQuickCartProductId}
              quickCartQty={quickCartQty}
              setQuickCartQty={setQuickCartQty}
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              setQuickViewProduct={setQuickViewProduct}
              setQuickViewQty={setQuickViewQty}
              setAgreed={setAgreed}
            />
          ))}
        </div>
      )}
      </div>
      
      {quickViewProduct && (
        <QuickView
          quickViewProduct={quickViewProduct}
          setQuickViewProduct={setQuickViewProduct}
          quickViewQty={quickViewQty}
          setQuickViewQty={setQuickViewQty}
          addToCart={addToCart}
          agreed={agreed}
          setAgreed={setAgreed}
        />
      )}
      
      <div className="flex flex-col lg:flex-row max-w-7xl my-12 sm:my-16 md:my-20 mx-auto gap-6 lg:gap-8 px-4">

          <div className="w-full lg:w-1/2">
  <img src="https://gwath-store-newdemo.myshopify.com/cdn/shop/files/banner1_1.jpg?v=1748483509&width=1883" alt="" className="w-full h-auto" />
          </div>
          <div className="flex flex-col items-start justify-center w-full lg:w-1/2">
  <h2 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">New Arrivals</h2>
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
    Heures Créatives<br />
    Romantique.
  </h1>
  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 leading-relaxed max-w-md">
    Inspired by a piece from 1916 created during the
    Belle Époque and Art Nouveau period
  </p>
  <div className="bg-[#ba7a2d] text-white px-8 py-3 rounded-sm transition-colors overflow-hidden relative group h-12 w-fit">
                    <div className="flex flex-col transition-transform gap-4 duration-300 group-hover:-translate-y-[40px] h-full">
                      <Link
                        to="/Shop"
                        className="h-12 flex items-center font-semibold font-['Montserrat'] uppercase "
                      >
                        Shop Now
                      </Link>
                      <Link
                        to="/Shop"
                        className="h-12 flex items-center font-semibold font-['Montserrat'] uppercase"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>

          </div>
      </div>

<section className="max-w-7xl mx-auto my-8 sm:my-12 md:my-16 lg:my-20 px-4 sm:px-6">
  <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Latest News & Articles</h1>
    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
      Discover the latest trends, watch care tips, and industry insights from our expert team
    </p>
  </div>

  {/* Desktop Grid */}
  <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
    {Array.isArray(blogPosts) && blogPosts.slice(0, 3).map((post) => (
      <article
        key={post.id}
        className="rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full w-full transform hover:-translate-y-1"
      >
        <div className="relative w-full h-48 sm:h-52 lg:h-56 overflow-hidden">
          <img
            src={post.image.url}
            alt={post.title}
            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
          />
          {post.featured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
              ⭐ Featured
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>📝 {post.status}</span>
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 hover:text-[#ba7a2d] transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3 flex-grow">
            {post.content}
          </p>
          <div className="mt-auto">
            <Link
              to={`/blog/${post.id}`}
              className="inline-flex items-center text-[#ba7a2d] font-semibold font-['Montserrat'] transition-colors hover:text-[#a06a25] text-xs sm:text-sm"
            >
              Read More 
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    ))}
  </div>

  {/* Mobile Swiper */}
  <div className="sm:hidden">
    <Swiper
      slidesPerView={1.2}
      spaceBetween={12}
      className="blog-swiper"
    >
      {Array.isArray(blogPosts) && blogPosts.slice(0, 3).map((post) => (
        <SwiperSlide key={post.id}>
          <article
            className="rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full w-full"
          >
            <div className="relative w-full h-40 overflow-hidden">
              <img
                src={post.image.url}
                alt={post.title}
                className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
              />
              {post.featured && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
                  ⭐ Featured
                </div>
              )}
            </div>
            <div className="p-3 sm:p-4 flex flex-col flex-1">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="mx-1">•</span>
                <span>📝 {post.status}</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 hover:text-[#ba7a2d] transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-grow">
                {post.content}
              </p>
              <div className="mt-auto">
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-[#ba7a2d] font-semibold font-['Montserrat'] transition-colors hover:text-[#a06a25] text-xs"
                >
                  Read More 
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>

  <div className="text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12">
    <Link 
      to="/blog" 
      className="bg-[#ba7a2d] text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-sm hover:bg-[#a06a25] transition-colors font-semibold uppercase tracking-wide text-xs sm:text-sm lg:text-base"
    >
      View All Articles
    </Link>
  </div>
</section>



      <FindRetailer />

      </div>
    </>
  );
};

export default Home;
