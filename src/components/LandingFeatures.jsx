import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Icon,
  Flex,
} from "@chakra-ui/react";
import {
  FaFileAlt,
  FaUpload,
  FaEdit,
  FaUserCheck,
  FaSearch,
  FaFolderOpen,
  FaShieldAlt,
  FaRegClock,
  FaFileImport,
  FaKeyboard,
  FaSave,
  FaEye,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import img1 from "../assets/features/dashboard.png";
import img2 from "../assets/features/form.png";
import img3 from "../assets/features/reportpage.jpg";

const LandingFeatures = () => {
  const features = [
    {
      id: 1,
      title: "Dashboard Displaying Reports Created",
      image: img1,
      benefits: [
        {
          icon: FaFileAlt,
          text: "Quick access to all generated reports",
          color: "#10B981",
        },
        {
          icon: FaSearch,
          text: "Search and filter reports efficiently",
          color: "#10B981",
        },
        {
          icon: FaUserCheck,
          text: "Track user activity and report usage",
          color: "#10B981",
        },
        {
          icon: FaFolderOpen,
          text: "Organize reports in one central location",
          color: "#10B981",
        },
      ],
    },
    {
      id: 2,
      title: "Upload Report Guidelines or Reference",
      image: img2,
      benefits: [
        {
          icon: FaUpload,
          text: "Easily upload documents and resources",
          color: "#3B82F6",
        },
        {
          icon: FaFileImport,
          text: "Supports multiple formats (PDF, DOCX)",
          color: "#3B82F6",
        },
        {
          icon: FaShieldAlt,
          text: "Secure upload with encryption",
          color: "#3B82F6",
        },
        {
          icon: FaRegClock,
          text: "Instant access to uploaded files",
          color: "#3B82F6",
        },
      ],
    },
    {
      id: 3,
      title: "In-Browser Web Report Text Editor",
      image: img3,
      benefits: [
        {
          icon: FaEdit,
          text: "Edit content directly in the browser",
          color: "#F59E0B",
        },
        {
          icon: FaKeyboard,
          text: "Supports text formatting and headings",
          color: "#F59E0B",
        },
        {
          icon: FaSave,
          text: "Autosave feature to prevent data loss",
          color: "#F59E0B",
        },
        {
          icon: FaEye,
          text: "Preview and export generated reports",
          color: "#F59E0B",
        },
      ],
    },
  ];

  return (
    <Box py={{ base: 12, lg: 20 }} overflow="hidden">
      <Container maxW="container.xl" mb={8}>
        <VStack spacing={6} textAlign="center">
          <div className="text-center w-full">
            <h2 className="text-[34px] sm:text-[42px] font-bold text-[#11117a] lg:mt-3">
              Our Powerful Features
            </h2>
          </div>
        </VStack>
      </Container>

      {/* Swiper Component */}
      <Box w="full" px={{ base: 4, md: 8 }}>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet",
            bulletActiveClass:
              "swiper-pagination-bullet-active custom-bullet-active",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
          }}
          className="features-swiper"
        >
          {features.map((feature) => (
            <SwiperSlide key={feature.id}>
              <Box
                maxW={{ base: "350px", md: "700px", lg: "900px" }}
                bg="white"
                borderRadius="2xl"
                shadow="sm"
                overflow="hidden"
                mx="auto"
                _hover={{ transform: "translateY(-4px)" }}
                transition="all 0.3s ease"
              >
                <Box flex="1" p={{ base: 3, md: 6 }}>
                  <VStack align="start" spacing={{ base: 4, md: 6 }} h="full">
                    <img
                      src={feature?.image || "/placeholder.svg"}
                      alt={feature?.title}
                      className="w-[400px] sm:w-[500px] md:w-[600px] lg:w-[800px] aspect-[3/2] object-cover rounded-lg"
                    />
                    <Box>
                      <Heading
                        size={{ base: "19px", md: "lg", lg: "xl" }}
                        color="gray.900"
                        mb={4}
                        lineHeight="shorter"
                        fontWeight="bold"
                      >
                        {feature?.title}
                      </Heading>
                    </Box>
                    <VStack align="start" spacing={4} flex="1" w="full">
                      {feature?.benefits.map((benefit, idx) => (
                        <Flex key={idx} align="center" gap={3} w="full">
                          <div
                            className="inline-flex items-center justify-center min-w-10 sm:min-w-12 h-10 sm:h-12 mb-0 rounded-full"
                            style={{ backgroundColor: "#0D0D82" }}
                          >
                            <Icon
                              as={benefit.icon}
                              color="white"
                              boxSize={{ base: 4, md: 5 }}
                              flexShrink={0}
                            />
                          </div>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            color="gray.800"
                            lineHeight="relaxed"
                            fontWeight="medium"
                          >
                            {benefit.text}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  </VStack>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Custom Swiper Styles */}
      <style>
        {`
        .features-swiper {
          padding-bottom: 50px !important;
        }
        
        .features-swiper .swiper-pagination {
          bottom: 10px !important;
        }
        
        .custom-bullet {
          width: 12px !important;
          height: 12px !important;
          background: #cbd5e0 !important;
          opacity: 1 !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }
        
        .custom-bullet-active {
          background: #11117a !important;
          transform: scale(1.2) !important;
        }
        
        .features-swiper .swiper-slide {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
        `}
      </style>
    </Box>
  );
};

export default LandingFeatures;
