"use client";
import {
  Box,
  Flex,
  VStack,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,  
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,

} from "@chakra-ui/react";

import { FiCreditCard, FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo/logoicon.png";
import { RxDashboard } from "react-icons/rx";
import { useEffect, useState } from "react";

import logo2 from "./../assets/logo/logoicon.png";
const Sidebar = ({  isMobile = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem("seydamtoken");
    localStorage.removeItem("username");
    onClose();
    navigate("/");
  };
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Dashboard", to: "/dashboard", icon: RxDashboard },
    { label: "Buy More Credit", to: "/buy-credit", icon: FiCreditCard },
    { label: "Profile", to: "/profile", icon: FiUser },
  ];

  const handleNavigation = (to) => {
    navigate(to);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <VStack align="start" spacing={6} px={2} pt={isMobile ? 4 : 8}>
      {/* Logo for mobile drawer */}
      {isMobile && (
        <Flex align="center" justify="center" mb={4} w="full">
          <img
            src={logo || "/placeholder.svg"}
            className="h-10 mt-6"
            alt="Logo"
          />{" "}
        </Flex>
      )}

      {links.map((link) => (
        <Button
          key={link.to}
          _hover={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            transform: "translateX(4px)",
          }}
          w="full"
          color={isActive(link.to) ? "white" : "gray.300"}
          backgroundColor={
            isActive(link.to) ? "rgba(255, 255, 255, 0.2)" : "transparent"
          }
          justifyContent="start"
          leftIcon={<link.icon />}
          fontWeight={isActive(link.to) ? "bold" : "normal"}
          borderLeft={
            isActive(link.to) ? "4px solid white" : "4px solid transparent"
          }
          borderRadius="0"
          gap="8px"
          transition="all 0.2s ease"
          onClick={() => handleNavigation(link.to)}
        >
          {link.label}
        </Button>
      ))}

<>
      <Button
        leftIcon={<FiLogOut />}
        ml="5px"
        justifyContent="start"
        w="full"
        color="red.300"
        backgroundColor="transparent"
        _hover={{
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          color: "red.200",
        }}
        transition="all 0.2s ease"
        onClick={onOpen} // Open modal instead of direct logout
      >
        Logout
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to log out?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleLogout}>
              Yes, Logout
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    </VStack>
  );
};

const DashboardLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      const capitalizedUsername = storedUsername
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setUsername(capitalizedUsername);
    }
  }, []);

  return (
    <Flex h="100vh" direction="column">
      {/* Mobile Header */}
      <Box
        display={{ base: "block", md: "none" }}
        bg="black"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={{ base: 4, sm: 6 }}
        py={{ base: 2, sm: 3 }}
        position="sticky"
        top={0}
        zIndex={20}
      >
        <Flex justify="space-between" align="center" py="6px">
          <img src={logo2} className="w-[52px]" />
          {/* <Flex align="center" gap={3}>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              color="white"
            >
              Welcome, {username || "User"}
            </Text>
          </Flex> */}
          <FiMenu onClick={onOpen} className="text-2xl text-white" />
        </Flex>
      </Box>

      <Flex h={{ base: "calc(100vh - 60px)", md: "100vh" }} overflow="hidden">
        {/* Desktop Sidebar */}
        <Box
          w="250px"
          bg="black"
          display={{ base: "none", md: "block" }}
          h="full"
          borderRight="1px"
          borderColor="white"
        >
          <Flex
            as="header"
            color="white"
            align="center"
            justify="center"
            px={6}
            py={6}
          >
            <img
              src={logo || "/placeholder.svg"}
              className="h-10 mt-2"
              alt="Logo"
            />
          </Flex>
          <Sidebar onClose={onClose} />
        </Box>

        {/* Mobile Drawer */}
        <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="xs">
          <DrawerOverlay />
          <DrawerContent bg="black">
            <DrawerCloseButton color="white" size="lg" />
            <DrawerBody p={0}>
              <Sidebar onClose={onClose} isMobile={true} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main content */}
        <Box
          flex="1"
          overflowY="auto"
          h="full"
          //m={4}
          bg="gray.50"
          w={{ base: "100%", md: "calc(100% - 250px)" }}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
