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

  // Split features into rows for scrolling animation
  const renderFeatureRow = (featuresRow, index, direction = "left") => (
    <Box
      key={index}
      display="flex"
      gap={8}
      animation={`scroll${
        direction === "left" ? "Left" : "Right"
      } 40s linear infinite`}
      whiteSpace="nowrap"
      overflow="hidden"
      py={4}
    >
      {[...featuresRow, ...featuresRow].map((feature, i) => (
        <Box
          key={i}
          minW={{ base: "350px", md: "700px", lg: "900px" }}
          maxW={{ base: "350px", md: "700px", lg: "900px" }}
          bg="white"
          borderRadius="2xl"
          shadow="sm"
          overflow="hidden"
          _hover={{ transform: "translateY(-4px)" }}
          transition="all 0.3s ease"
        >
          <Box flex="1" p={{ base: 3, md: 6 }}>
            <VStack align="start" spacing={{ base: 4, md: 6 }} h="full">
              <img
                src={feature?.image}
                alt="homeimg"
                className="w-[400px] sm:w-[500px] md:w-[600px] lg:w-[800px] aspect-[3/2] object-cover rounded-lg"
              />

              <Box>
                {" "}
                <Heading
                  size={{ base: "19px", md: "lg", lg: "xl" }}
                  color="gray.900"
                  mb={4}
                  lineHeight="shorter"
                  fontWeight="bold"
                >
                  {feature?.title}
                </Heading>
                {/* <Text
                  color="gray.800"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="relaxed"
                  mb={6}
                >
                  {feature?.subtitle}
                </Text> */}
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
                    </div>{" "}
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
      ))}
    </Box>
  );

  return (
    <Box
      py={{ base: 12, lg: 20 }}
      // bg="rgba(26, 26, 140, 0.2)"
      overflow="hidden"
    >
      <Container maxW="container.xl" mb={8}>
        <VStack spacing={6} textAlign="center">
          <div className="text-center w-full">
            <h2 className="text-[34px] sm:text-[42px] font-bold text-[#11117a] lg:mt-3 ">
              Our Powerful Features
            </h2>
          </div>
          {/* <Text
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            color="gray.600"
            maxW="3xl"
            lineHeight="relaxed"
          >
            Discover comprehensive solutions designed to streamline your
            operations, enhance security, and drive business growth with
            cutting-edge technology.
          </Text> */}
        </VStack>
      </Container>

      {/* Scrolling Feature Rows */}
      <VStack spacing={12} w="full">
        {renderFeatureRow(features, 1, "left")}
      </VStack>

      {/* Scrolling animation keyframes */}
      <style>
        {`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        `}
      </style>
    </Box>
  );
};

export default LandingFeatures;
